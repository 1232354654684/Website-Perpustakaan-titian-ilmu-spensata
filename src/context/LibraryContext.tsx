import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocFromServer,
} from 'firebase/firestore';
import { onAuthStateChanged, User, signOut, signInWithPopup } from 'firebase/auth';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { ContactInfo, LibraryProfile, NewsItem, OperatingHours, SOPEntry, StaffMember } from '../types';
import {
  libraryProfileData as defaultProfile,
  operatingHoursData as defaultHours,
  contactInfoData as defaultContact,
  newsData as defaultNews,
  sopData as defaultSOP,
  staffData as defaultStaff,
} from '../data/libraryData';

export const BOOTSTRAP_ADMIN_EMAIL = 'roni.ardiansyah57@guru.smk.belajar.id';

/**
 * Mengubah string tanggal (Indonesian "18 Februari 2026", ISO "2026-02-18", dsb.)
 * menjadi milidetik timestamp untuk pengurutan akurat.
 */
export function parseNewsDateToMillis(dateStr?: string): number {
  if (!dateStr || typeof dateStr !== 'string') return 0;
  const trimmed = dateStr.trim();
  if (!trimmed || trimmed === '-') return 0;

  // 1. Coba parse format ISO / standar
  const parsedIso = Date.parse(trimmed);
  if (!isNaN(parsedIso)) {
    return parsedIso;
  }

  // 2. Parse format bahasa Indonesia: "18 Februari 2026" atau "2 Februari 2026"
  const indonesianMonths: Record<string, number> = {
    januari: 0, jan: 0,
    februari: 1, feb: 1,
    maret: 2, mar: 2,
    april: 3, apr: 3,
    mei: 4,
    juni: 5, jun: 5,
    juli: 6, jul: 6,
    agustus: 7, agu: 7, ags: 7,
    september: 8, sep: 8,
    oktober: 9, okt: 9,
    november: 10, nov: 10,
    desember: 11, des: 11,
  };

  const match = trimmed.match(/^(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})/i);
  if (match) {
    const day = parseInt(match[1], 10);
    const monthName = match[2].toLowerCase();
    const year = parseInt(match[3], 10);
    const month = indonesianMonths[monthName];
    if (month !== undefined && !isNaN(day) && !isNaN(year)) {
      return new Date(year, month, day).getTime();
    }
  }

  // 3. Jika hanya ada tahun atau pola angka
  const yearMatch = trimmed.match(/\b(20\d\d)\b/);
  if (yearMatch) {
    return new Date(parseInt(yearMatch[1], 10), 0, 1).getTime();
  }

  return 0;
}

/**
 * Membandingkan 2 berita untuk pengurutan Descending (terbaru di paling atas):
 * 1. Tanggal berita (descending). Berita tanpa tanggal bernilai 0 dan tampil di urutan paling bawah.
 * 2. Jika tanggal sama, urutkan berdasarkan waktu dibuat (createdAt / updatedAt) descending.
 * 3. Jika tetap sama, urutkan berdasarkan ID.
 */
export function compareNewsDescending(a: NewsItem, b: NewsItem): number {
  const timeA = parseNewsDateToMillis(a.date);
  const timeB = parseNewsDateToMillis(b.date);

  // Jika tanggal berbeda
  if (timeA !== timeB) {
    if (timeA === 0) return 1; // a tanpa tanggal -> tempatkan di paling bawah
    if (timeB === 0) return -1; // b tanpa tanggal -> tempatkan di paling bawah
    return timeB - timeA; // tanggal terbaru di urutan teratas
  }

  // Jika tanggal sama atau sama-sama 0, urutkan berdasarkan waktu dibuat (createdAt / updatedAt)
  const createdA = (a as any).createdAt ? new Date((a as any).createdAt).getTime() : 0;
  const createdB = (b as any).createdAt ? new Date((b as any).createdAt).getTime() : 0;
  if (createdA !== createdB) {
    return createdB - createdA;
  }

  const updatedA = (a as any).updatedAt ? new Date((a as any).updatedAt).getTime() : 0;
  const updatedB = (b as any).updatedAt ? new Date((b as any).updatedAt).getTime() : 0;
  if (updatedA !== updatedB) {
    return updatedB - updatedA;
  }

  return (b.id || '').localeCompare(a.id || '');
}

interface LibraryContextType {
  settings: LibraryProfile;
  operatingHours: OperatingHours[];
  contactInfo: ContactInfo;
  newsList: NewsItem[];
  sopList: SOPEntry[];
  staffList: StaffMember[];
  loading: boolean;
  user: User | null;
  isAdmin: boolean;
  adminEmails: string[];
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateSettings: (profile: LibraryProfile, hours: OperatingHours[], contact: ContactInfo) => Promise<void>;
  addNews: (item: Omit<NewsItem, 'id'>) => Promise<void>;
  updateNews: (id: string, item: Partial<NewsItem>) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  addSOP: (item: Omit<SOPEntry, 'id'>) => Promise<void>;
  updateSOP: (id: string, item: Partial<SOPEntry>) => Promise<void>;
  deleteSOP: (id: string) => Promise<void>;
  addStaff: (item: Omit<StaffMember, 'id'>) => Promise<void>;
  updateStaff: (id: string, item: Partial<StaffMember>) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
  seedInitialDataIfEmpty: () => Promise<void>;
  addAdminEmail: (email: string) => Promise<void>;
  removeAdminEmail: (email: string) => Promise<void>;
}

const LibraryContext = createContext<LibraryContextType | null>(null);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<LibraryProfile>(defaultProfile);
  const [operatingHours, setOperatingHours] = useState<OperatingHours[]>(defaultHours);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContact);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [sopList, setSopList] = useState<SOPEntry[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmails, setAdminEmails] = useState<string[]>([BOOTSTRAP_ADMIN_EMAIL]);

  // Test Firestore connection on boot
  useEffect(() => {
    async function testConn() {
      try {
        await getDocFromServer(doc(db, 'settings', 'general'));
      } catch (err) {
        // Offline or initial probe notice
      }
    }
    testConn();
  }, []);

  // Listen for Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email) {
        const email = currentUser.email.toLowerCase();
        // Check if user is in admin list
        const isAllowed =
          email === BOOTSTRAP_ADMIN_EMAIL.toLowerCase() ||
          adminEmails.map((e) => e.toLowerCase()).includes(email);

        if (isAllowed) {
          setIsAdmin(true);
        } else {
          // Double check in Firestore admin_emails collection
          try {
            const adminDoc = await getDoc(doc(db, 'admin_emails', email));
            if (adminDoc.exists()) {
              setIsAdmin(true);
              return;
            }
          } catch (e) {
            // No permission or doesn't exist
          }
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, [adminEmails]);

  // Listen to admin emails collection
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'admin_emails'),
      (snapshot) => {
        const emails: string[] = [BOOTSTRAP_ADMIN_EMAIL];
        snapshot.forEach((d) => {
          const data = d.data();
          if (data.email && !emails.includes(data.email)) {
            emails.push(data.email);
          }
        });
        setAdminEmails(emails);
      },
      (error) => {
        // Ignored for non-admins
      }
    );
    return () => unsub();
  }, []);

  // Real-time synchronization with Firestore collections for public & admin
  useEffect(() => {
    let settingsLoaded = false;
    let newsLoaded = false;
    let sopLoaded = false;
    let staffLoaded = false;

    const checkAllLoaded = () => {
      if (settingsLoaded && newsLoaded && sopLoaded && staffLoaded) {
        setLoading(false);
      }
    };

    // 1. Settings listener
    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'general'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.profile) setSettings(data.profile);
          if (data.operatingHours) setOperatingHours(data.operatingHours);
          if (data.contactInfo) setContactInfo(data.contactInfo);
        }
        settingsLoaded = true;
        checkAllLoaded();
      },
      (err) => {
        console.warn('Settings load fallback:', err);
        settingsLoaded = true;
        checkAllLoaded();
      }
    );

    // 2. News listener dengan query orderBy('date', 'desc')
    let unsubNews: () => void = () => {};

    const processNewsSnapshot = (snap: any) => {
      const list: NewsItem[] = [];
      snap.forEach((d: any) => {
        list.push({ id: d.id, ...d.data() } as NewsItem);
      });
      // Urutkan dari yang paling baru ke paling lama (descending tanggal, tie-breaker createdAt)
      // Data lama tanpa field tanggal tetap tampil di urutan paling bawah tanpa error
      list.sort(compareNewsDescending);
      setNewsList(list);
      newsLoaded = true;
      checkAllLoaded();
    };

    try {
      const newsQuery = query(collection(db, 'news'), orderBy('date', 'desc'));
      unsubNews = onSnapshot(
        newsQuery,
        processNewsSnapshot,
        (queryErr) => {
          console.warn('News orderBy query warning, beralih ke snapshot koleksi biasa:', queryErr);
          // Fallback ke collection(db, 'news') agar data lama tanpa field tanggal tetap terpanggil dan diurutkan di paling bawah
          unsubNews = onSnapshot(
            collection(db, 'news'),
            processNewsSnapshot,
            (collErr) => {
              console.warn('News snapshot error:', collErr);
              newsLoaded = true;
              checkAllLoaded();
            }
          );
        }
      );
    } catch (err) {
      console.warn('News query setup error, fallback ke collection:', err);
      unsubNews = onSnapshot(
        collection(db, 'news'),
        processNewsSnapshot,
        (collErr) => {
          console.warn('News collection error:', collErr);
          newsLoaded = true;
          checkAllLoaded();
        }
      );
    }

    // 3. SOP listener
    const unsubSOP = onSnapshot(
      collection(db, 'sop'),
      (snap) => {
        const list: SOPEntry[] = [];
        snap.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as SOPEntry);
        });
        // Sort if orderIndex exists
        list.sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0));
        setSopList(list);
        sopLoaded = true;
        checkAllLoaded();
      },
      (err) => {
        console.warn('SOP load fallback:', err);
        sopLoaded = true;
        checkAllLoaded();
      }
    );

    // 4. Staff listener
    const unsubStaff = onSnapshot(
      collection(db, 'staff'),
      (snap) => {
        const list: StaffMember[] = [];
        snap.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as StaffMember);
        });
        list.sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0));
        setStaffList(list);
        staffLoaded = true;
        checkAllLoaded();
      },
      (err) => {
        console.warn('Staff load fallback:', err);
        staffLoaded = true;
        checkAllLoaded();
      }
    );

    return () => {
      unsubSettings();
      unsubNews();
      unsubSOP();
      unsubStaff();
    };
  }, []);

  // Sinkronisasi favicon browser dinamis dengan logo perpustakaan
  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    if (settings.logoUrl) {
      link.href = settings.logoUrl;
    }
  }, [settings.logoUrl]);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email?.toLowerCase() || '';
      const allowed =
        email === BOOTSTRAP_ADMIN_EMAIL.toLowerCase() ||
        adminEmails.map((e) => e.toLowerCase()).includes(email);

      if (!allowed) {
        // Check Firestore admin_emails
        const adminDoc = await getDoc(doc(db, 'admin_emails', email));
        if (!adminDoc.exists()) {
          await signOut(auth);
          throw new Error(
            `Email ${email} tidak memiliki izin akses administrator Perpustakaan Titian Ilmu.`
          );
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setIsAdmin(false);
  };

  const updateSettings = async (
    profile: LibraryProfile,
    hours: OperatingHours[],
    contact: ContactInfo
  ) => {
    const path = 'settings/general';
    try {
      await setDoc(
        doc(db, 'settings', 'general'),
        {
          profile,
          operatingHours: hours,
          contactInfo: contact,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      setSettings(profile);
      setOperatingHours(hours);
      setContactInfo(contact);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const addNews = async (item: Omit<NewsItem, 'id'>) => {
    const id = `news_${Date.now()}`;
    const path = `news/${id}`;
    try {
      console.log(`[addNews] Menyimpan berita baru ${id}:`, item);
      await setDoc(doc(db, 'news', id), {
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log(`[addNews] Berhasil menyimpan berita baru ${id}`);
    } catch (err) {
      console.error(`[addNews] Gagal membuat berita ${id}:`, err);
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const updateNews = async (id: string, item: Partial<NewsItem>) => {
    if (!id || typeof id !== 'string') {
      console.error('[updateNews] ID dokumen berita kosong atau tidak valid:', id);
      throw new Error('ID dokumen berita tidak valid atau kosong.');
    }
    const path = `news/${id}`;
    try {
      console.log(`[updateNews] Memperbarui dokumen berita dengan ID "${id}":`, item);
      const cleanItem: Record<string, any> = { ...item };
      delete cleanItem.id;
      cleanItem.updatedAt = new Date().toISOString();

      // Hapus properti bernilai undefined agar Firestore tidak error
      Object.keys(cleanItem).forEach((key) => {
        if (cleanItem[key] === undefined) {
          delete cleanItem[key];
        }
      });

      const newsDocRef = doc(db, 'news', id);
      // Panggil updateDoc sesuai spesifikasi; jika dokumen lokal/baru belum ada, gunakan setDoc merge
      try {
        await updateDoc(newsDocRef, cleanItem);
        console.log(`[updateNews] updateDoc berhasil untuk ID: ${id}`);
      } catch (updateErr: any) {
        console.warn(`[updateNews] updateDoc gagal (${updateErr?.message}), mencoba setDoc dengan merge untuk ID: ${id}`);
        await setDoc(newsDocRef, cleanItem, { merge: true });
        console.log(`[updateNews] setDoc merge berhasil untuk ID: ${id}`);
      }
    } catch (err) {
      console.error(`[updateNews] Gagal memperbarui berita ${id}:`, err);
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const deleteNews = async (id: string) => {
    if (!id) {
      console.error('[deleteNews] ID dokumen berita kosong.');
      throw new Error('ID dokumen berita tidak valid.');
    }
    const path = `news/${id}`;
    try {
      console.log(`[deleteNews] Memanggil deleteDoc pada dokumen: ${path}`);
      await deleteDoc(doc(db, 'news', id));
      console.log(`[deleteNews] Berhasil menghapus dokumen: ${path}`);
    } catch (err) {
      console.error(`[deleteNews] Gagal menghapus dokumen ${id}:`, err);
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const addSOP = async (item: Omit<SOPEntry, 'id'>) => {
    const id = `sop_${Date.now()}`;
    const path = `sop/${id}`;
    try {
      await setDoc(doc(db, 'sop', id), {
        ...item,
        orderIndex: sopList.length,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const updateSOP = async (id: string, item: Partial<SOPEntry>) => {
    const path = `sop/${id}`;
    try {
      await updateDoc(doc(db, 'sop', id), item);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const deleteSOP = async (id: string) => {
    const path = `sop/${id}`;
    try {
      await deleteDoc(doc(db, 'sop', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const addStaff = async (item: Omit<StaffMember, 'id'>) => {
    const id = `staff_${Date.now()}`;
    const path = `staff/${id}`;
    try {
      await setDoc(doc(db, 'staff', id), {
        ...item,
        orderIndex: staffList.length,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const updateStaff = async (id: string, item: Partial<StaffMember>) => {
    const path = `staff/${id}`;
    try {
      await updateDoc(doc(db, 'staff', id), item);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const deleteStaff = async (id: string) => {
    const path = `staff/${id}`;
    try {
      await deleteDoc(doc(db, 'staff', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const addAdminEmail = async (email: string) => {
    const normalized = email.trim().toLowerCase();
    const path = `admin_emails/${normalized}`;
    try {
      await setDoc(doc(db, 'admin_emails', normalized), {
        email: normalized,
        addedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const removeAdminEmail = async (email: string) => {
    const normalized = email.trim().toLowerCase();
    const path = `admin_emails/${normalized}`;
    try {
      await deleteDoc(doc(db, 'admin_emails', normalized));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  /**
   * Seed Data Awal ke Firestore bila database masih kosong.
   */
  const seedInitialDataIfEmpty = async () => {
    try {
      // 1. Settings
      await setDoc(
        doc(db, 'settings', 'general'),
        {
          profile: defaultProfile,
          operatingHours: defaultHours,
          contactInfo: defaultContact,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      // 2. News
      for (const item of defaultNews) {
        await setDoc(doc(db, 'news', item.id), item);
      }

      // 3. SOP
      for (let i = 0; i < defaultSOP.length; i++) {
        const item = defaultSOP[i];
        await setDoc(doc(db, 'sop', item.id), {
          ...item,
          orderIndex: i,
        });
      }

      // 4. Staff
      for (let i = 0; i < defaultStaff.length; i++) {
        const item = defaultStaff[i];
        await setDoc(doc(db, 'staff', item.id), {
          ...item,
          orderIndex: i,
        });
      }

      // 5. Admin Email
      await setDoc(doc(db, 'admin_emails', BOOTSTRAP_ADMIN_EMAIL.toLowerCase()), {
        email: BOOTSTRAP_ADMIN_EMAIL.toLowerCase(),
        addedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error seeding initial data:', err);
    }
  };

  return (
    <LibraryContext.Provider
      value={{
        settings,
        operatingHours,
        contactInfo,
        newsList,
        sopList,
        staffList,
        loading,
        user,
        isAdmin,
        adminEmails,
        loginWithGoogle,
        logout,
        updateSettings,
        addNews,
        updateNews,
        deleteNews,
        addSOP,
        updateSOP,
        deleteSOP,
        addStaff,
        updateStaff,
        deleteStaff,
        seedInitialDataIfEmpty,
        addAdminEmail,
        removeAdminEmail,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
