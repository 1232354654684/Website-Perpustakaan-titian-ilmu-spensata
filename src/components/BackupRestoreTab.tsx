import React, { useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import {
  Download,
  Upload,
  Archive,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  FileJson,
  Image as ImageIcon,
  Database,
  Info,
  Loader2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  FileCheck,
} from 'lucide-react';
import { db, storage, uploadAndProcessPhoto } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface BackupMetadata {
  version: string;
  backupDate: string;
  appId: string;
  urlMap: Record<string, string>; // urlLama -> nama file di images/
  collections: {
    settings: Record<string, any>;
    news: Record<string, any>;
    sop: Record<string, any>;
    staff: Record<string, any>;
    admin_emails: Record<string, any>;
  };
}

interface BackupReport {
  timestamp: string;
  totalDocs: number;
  totalImages: number;
  successImages: number;
  failedImages: { url: string; error: string }[];
  fileName: string;
}

interface RestorePreview {
  version: string;
  backupDate: string;
  collectionsCount: {
    settings: number;
    news: number;
    sop: number;
    staff: number;
    admin_emails: number;
  };
  totalDocs: number;
  totalImages: number;
  parsedData: BackupMetadata;
  zipInstance: JSZip;
}

interface RestoreReport {
  timestamp: string;
  totalDocs: number;
  successDocs: number;
  failedDocs: number;
  totalImages: number;
  successImages: number;
  failedImages: number;
  safetyBackupName?: string;
  details: string[];
}

interface BackupRestoreTabProps {
  onShowToast: (message: string, type?: 'success' | 'error' | 'info', details?: string) => void;
}

export const BackupRestoreTab: React.FC<BackupRestoreTabProps> = ({ onShowToast }) => {
  // Metadata backup terakhir
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null);
  const [loadingMeta, setLoadingMeta] = useState(true);

  // Status proses Backup
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgressText, setBackupProgressText] = useState('');
  const [backupReport, setBackupReport] = useState<BackupReport | null>(null);

  // Status proses Restore
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [isValidatingZip, setIsValidatingZip] = useState(false);
  const [restorePreview, setRestorePreview] = useState<RestorePreview | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Dialog Konfirmasi Ganda Restore
  const [confirmStep, setConfirmStep] = useState<0 | 1 | 2>(0);
  const [confirmationInput, setConfirmationInput] = useState('');
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreProgressText, setRestoreProgressText] = useState('');
  const [restoreReport, setRestoreReport] = useState<RestoreReport | null>(null);

  // Accordion Petunjuk CORS
  const [showCorsGuide, setShowCorsGuide] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Ambil tanggal backup terakhir dari Firestore
  useEffect(() => {
    async function fetchLastBackup() {
      try {
        const metaDoc = await getDoc(doc(db, 'settings', 'backup_meta'));
        if (metaDoc.exists()) {
          const data = metaDoc.data();
          if (data?.lastBackupAt) {
            setLastBackupDate(data.lastBackupAt);
          }
        }
      } catch (err) {
        console.warn('Gagal membaca metadata backup:', err);
      } finally {
        setLoadingMeta(false);
      }
    }
    fetchLastBackup();
  }, []);

  // Hitung selisih hari dari backup terakhir
  const getDaysAgo = (dateStr: string | null): number | null => {
    if (!dateStr) return null;
    const backupTime = new Date(dateStr).getTime();
    const now = Date.now();
    const diffDays = Math.floor((now - backupTime) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : 0;
  };

  const daysAgo = getDaysAgo(lastBackupDate);

  // Helper untuk mengubah data URL base64 menjadi Uint8Array
  const dataUrlToUint8Array = (dataUrl: string): Uint8Array => {
    const arr = dataUrl.split(',');
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return u8arr;
  };

  // Helper unduh file ke browser
  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper kumpulkan semua URL gambar dari dokumen Firestore
  const extractImageUrls = (collections: BackupMetadata['collections']): string[] => {
    const urls = new Set<string>();

    // 1. Settings (logoUrl)
    if (collections.settings?.general?.profile?.logoUrl) {
      urls.add(collections.settings.general.profile.logoUrl);
    }
    if (collections.settings?.general?.logoUrl) {
      urls.add(collections.settings.general.logoUrl);
    }

    // 2. News (imageUrl)
    Object.values(collections.news || {}).forEach((item: any) => {
      if (item?.imageUrl && typeof item.imageUrl === 'string') {
        urls.add(item.imageUrl);
      }
    });

    // 3. Staff (avatarUrl)
    Object.values(collections.staff || {}).forEach((item: any) => {
      if (item?.avatarUrl && typeof item.avatarUrl === 'string') {
        urls.add(item.avatarUrl);
      }
    });

    return Array.from(urls).filter((u) => u && typeof u === 'string' && u.trim().length > 0);
  };

  // -------------------------------------------------------------
  // PROSES BACKUP LENGKAP
  // -------------------------------------------------------------
  const handleBackup = async (isSafetyBackup = false): Promise<Blob | null> => {
    if (!isSafetyBackup) {
      setIsBackingUp(true);
      setBackupReport(null);
    }
    setBackupProgressText('Membaca seluruh koleksi data dari Firestore...');

    try {
      const zip = new JSZip();
      const imagesFolder = zip.folder('images');

      // 1. Ambil seluruh dokumen Firestore
      const collectionsData: BackupMetadata['collections'] = {
        settings: {},
        news: {},
        sop: {},
        staff: {},
        admin_emails: {},
      };

      let totalDocsCount = 0;

      // a. Settings
      try {
        const snap = await getDocs(collection(db, 'settings'));
        snap.forEach((d) => {
          collectionsData.settings[d.id] = d.data();
          totalDocsCount++;
        });
      } catch (e) {
        console.warn('Backup settings warning:', e);
      }

      // b. News
      try {
        const snap = await getDocs(collection(db, 'news'));
        snap.forEach((d) => {
          collectionsData.news[d.id] = d.data();
          totalDocsCount++;
        });
      } catch (e) {
        console.warn('Backup news warning:', e);
      }

      // c. SOP
      try {
        const snap = await getDocs(collection(db, 'sop'));
        snap.forEach((d) => {
          collectionsData.sop[d.id] = d.data();
          totalDocsCount++;
        });
      } catch (e) {
        console.warn('Backup sop warning:', e);
      }

      // d. Staff
      try {
        const snap = await getDocs(collection(db, 'staff'));
        snap.forEach((d) => {
          collectionsData.staff[d.id] = d.data();
          totalDocsCount++;
        });
      } catch (e) {
        console.warn('Backup staff warning:', e);
      }

      // e. Admin emails
      try {
        const snap = await getDocs(collection(db, 'admin_emails'));
        snap.forEach((d) => {
          collectionsData.admin_emails[d.id] = d.data();
          totalDocsCount++;
        });
      } catch (e) {
        console.warn('Backup admin_emails warning:', e);
      }

      // 2. Kumpulkan URL gambar
      const imageUrls = extractImageUrls(collectionsData);
      const urlMap: Record<string, string> = {};
      const failedImages: { url: string; error: string }[] = [];
      let successImagesCount = 0;

      for (let i = 0; i < imageUrls.length; i++) {
        const imgUrl = imageUrls[i];
        const currentNum = i + 1;
        setBackupProgressText(`Mengunduh gambar ${currentNum} dari ${imageUrls.length}...`);

        const ext = imgUrl.includes('.png')
          ? 'png'
          : imgUrl.includes('.webp')
          ? 'webp'
          : imgUrl.includes('.svg')
          ? 'svg'
          : 'jpg';
        const fileName = `img_${currentNum}_${Date.now()}.${ext}`;

        try {
          if (imgUrl.startsWith('data:')) {
            // Gambar format Data URL Base64
            const u8 = dataUrlToUint8Array(imgUrl);
            imagesFolder?.file(fileName, u8);
            urlMap[imgUrl] = fileName;
            successImagesCount++;
          } else {
            // Gambar format URL HTTP/HTTPS (Firebase Storage)
            try {
              const res = await fetch(imgUrl, { mode: 'cors' });
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              const blob = await res.blob();
              imagesFolder?.file(fileName, blob);
              urlMap[imgUrl] = fileName;
              successImagesCount++;
            } catch (fetchErr: any) {
              console.warn(`Gagal fetch ${imgUrl}:`, fetchErr);
              failedImages.push({
                url: imgUrl,
                error: fetchErr?.message || 'Gagal mengunduh (CORS atau akses terputus)',
              });
            }
          }
        } catch (err: any) {
          failedImages.push({
            url: imgUrl,
            error: err?.message || 'Gagal memproses gambar',
          });
        }
      }

      // 3. Buat data.json
      const backupMeta: BackupMetadata = {
        version: '1.0',
        backupDate: new Date().toISOString(),
        appId: 'perpustakaan-titian-ilmu-spensata',
        urlMap,
        collections: collectionsData,
      };

      zip.file('data.json', JSON.stringify(backupMeta, null, 2));

      // 4. Kompres jadi SATU file ZIP
      setBackupProgressText('Mengemas seluruh file ke arsip ZIP...');
      const zipBlob = await zip.generateAsync({ type: 'blob' });

      const dateStr = new Date().toISOString().split('T')[0];
      const zipFileName = isSafetyBackup
        ? `pengaman-sebelum-restore-${dateStr}-${Date.now().toString().slice(-4)}.zip`
        : `backup-perpustakaan-${dateStr}.zip`;

      // Simpan tanggal backup terakhir ke Firestore jika ini backup manual
      if (!isSafetyBackup) {
        const nowIso = new Date().toISOString();
        try {
          await setDoc(
            doc(db, 'settings', 'backup_meta'),
            {
              lastBackupAt: nowIso,
              totalDocs: totalDocsCount,
              totalImages: successImagesCount,
              lastFileName: zipFileName,
            },
            { merge: true }
          );
          setLastBackupDate(nowIso);
        } catch (metaErr) {
          console.warn('Gagal mencatat metadata backup di Firestore:', metaErr);
        }

        // Picu unduhan ke browser pengguna
        triggerDownload(zipBlob, zipFileName);

        setBackupReport({
          timestamp: new Date().toLocaleTimeString('id-ID'),
          totalDocs: totalDocsCount,
          totalImages: imageUrls.length,
          successImages: successImagesCount,
          failedImages,
          fileName: zipFileName,
        });

        onShowToast(
          'Backup berhasil diunduh!',
          'success',
          `${totalDocsCount} dokumen dan ${successImagesCount} gambar tersimpan dalam file ZIP.`
        );
      }

      return zipBlob;
    } catch (err: any) {
      console.error('Error saat backup:', err);
      if (!isSafetyBackup) {
        onShowToast('Gagal membuat backup', 'error', err?.message || 'Terjadi kesalahan sistem.');
      }
      throw err;
    } finally {
      if (!isSafetyBackup) {
        setIsBackingUp(false);
        setBackupProgressText('');
      }
    }
  };

  // -------------------------------------------------------------
  // PROSES RESTORE: VALIDASI FILE ZIP
  // -------------------------------------------------------------
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    setRestorePreview(null);
    setRestoreReport(null);
    setConfirmStep(0);
    setConfirmationInput('');

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.zip')) {
      setValidationError('File harus berformat .zip');
      return;
    }

    setRestoreFile(file);
    setIsValidatingZip(true);

    try {
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(file);

      // Cek keberadaan file data.json
      const dataJsonFile = loadedZip.file('data.json');
      if (!dataJsonFile) {
        throw new Error('File data.json tidak ditemukan di dalam arsip ZIP. Pastikan file adalah backup resmi.');
      }

      const jsonText = await dataJsonFile.async('string');
      let parsed: BackupMetadata;
      try {
        parsed = JSON.parse(jsonText);
      } catch {
        throw new Error('File data.json rusak atau format JSON tidak valid.');
      }

      // Validasi versi & struktur
      if (!parsed.version || !parsed.collections) {
        throw new Error('Struktur data.json tidak cocok dengan spesifikasi sistem cadangan Titian Ilmu.');
      }

      // Hitung dokumen per koleksi
      const counts = {
        settings: Object.keys(parsed.collections.settings || {}).length,
        news: Object.keys(parsed.collections.news || {}).length,
        sop: Object.keys(parsed.collections.sop || {}).length,
        staff: Object.keys(parsed.collections.staff || {}).length,
        admin_emails: Object.keys(parsed.collections.admin_emails || {}).length,
      };

      const totalDocs = Object.values(counts).reduce((a, b) => a + b, 0);

      // Hitung jumlah gambar di dalam folder images/
      let totalImages = 0;
      loadedZip.forEach((relativePath) => {
        if (relativePath.startsWith('images/') && !relativePath.endsWith('/')) {
          totalImages++;
        }
      });

      setRestorePreview({
        version: parsed.version,
        backupDate: parsed.backupDate,
        collectionsCount: counts,
        totalDocs,
        totalImages,
        parsedData: parsed,
        zipInstance: loadedZip,
      });

      onShowToast('File backup valid!', 'info', 'Periksa pratinjau data sebelum melanjutkan restore.');
    } catch (err: any) {
      console.error('Validasi backup error:', err);
      setValidationError(err?.message || 'File ZIP tidak valid atau rusak.');
      setRestoreFile(null);
    } finally {
      setIsValidatingZip(false);
    }
  };

  // -------------------------------------------------------------
  // PROSES RESTORE LENGKAP DENGAN BATCH WRITE & PENGAMAN
  // -------------------------------------------------------------
  const handleExecuteRestore = async () => {
    if (!restorePreview) return;
    setIsRestoring(true);
    setRestoreProgressText('Membuat cadangan pengaman (safety backup) otomatis...');

    const reportDetails: string[] = [];

    try {
      // 1. SAFETY BACKUP OTOMATIS SEBELUM MENIMPA DATA
      let safetyName = '';
      try {
        const dateStr = new Date().toISOString().split('T')[0];
        safetyName = `pengaman-sebelum-restore-${dateStr}.zip`;
        const safetyBlob = await handleBackup(true);
        if (safetyBlob) {
          triggerDownload(safetyBlob, safetyName);
          reportDetails.push(`Cadangan pengaman otomatis telah diunduh (${safetyName})`);
        }
      } catch (safetyErr) {
        console.warn('Safety backup warning:', safetyErr);
        reportDetails.push('Peringatan: Cadangan pengaman lokal gagal diunduh, melanjutkan restore...');
      }

      const { parsedData, zipInstance } = restorePreview;
      const urlMap = parsedData.urlMap || {};
      const newUrlMap: Record<string, string> = {};

      let successImages = 0;
      let failedImages = 0;

      // 2. UNGGAH ULANG SEMUA GAMBAR KE STORAGE / DATA URL
      const entries = Object.entries(urlMap);
      for (let i = 0; i < entries.length; i++) {
        const [oldUrl, imageName] = entries[i];
        setRestoreProgressText(`Mengunggah gambar ${i + 1} dari ${entries.length} (${imageName})...`);

        const imgFile = zipInstance.file(`images/${imageName}`);
        if (imgFile) {
          try {
            const blob = await imgFile.async('blob');
            const fileObj = new File([blob], imageName, { type: blob.type || 'image/jpeg' });

            // Unggah gambar baru
            const uploadRes = await uploadAndProcessPhoto(fileObj, 'restored_images');
            newUrlMap[oldUrl] = uploadRes.url;
            successImages++;
          } catch (imgErr) {
            console.warn(`Gagal restore gambar ${imageName}:`, imgErr);
            newUrlMap[oldUrl] = oldUrl; // fallback tetap gunakan URL lama
            failedImages++;
          }
        } else {
          newUrlMap[oldUrl] = oldUrl;
        }
      }

      // 3. GANTI URL GAMBAR DI DOKUMEN DENGAN URL BARU
      const replaceUrlsInObject = (obj: any): any => {
        if (!obj || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) {
          return obj.map(replaceUrlsInObject);
        }
        const res: Record<string, any> = {};
        for (const [k, v] of Object.entries(obj)) {
          if (typeof v === 'string' && newUrlMap[v]) {
            res[k] = newUrlMap[v];
          } else if (typeof v === 'object' && v !== null) {
            res[k] = replaceUrlsInObject(v);
          } else {
            res[k] = v;
          }
        }
        return res;
      };

      setRestoreProgressText('Menulis dokumen ke database Firestore via batch write...');

      // 4. TULIS DOKUMEN KE FIRESTORE VIA BATCH WRITE (MAKS 500 OPERASI)
      let currentBatch = writeBatch(db);
      let opCount = 0;
      let totalSuccessDocs = 0;
      let totalFailedDocs = 0;

      const collections = parsedData.collections;

      const queueBatchDoc = async (collName: string, docId: string, docData: any) => {
        const processedData = replaceUrlsInObject(docData);
        currentBatch.set(doc(db, collName, docId), processedData, { merge: true });
        opCount++;
        totalSuccessDocs++;

        if (opCount >= 450) {
          await currentBatch.commit();
          currentBatch = writeBatch(db);
          opCount = 0;
        }
      };

      // Tulis Settings
      for (const [docId, docData] of Object.entries(collections.settings || {})) {
        await queueBatchDoc('settings', docId, docData);
      }

      // Tulis News
      for (const [docId, docData] of Object.entries(collections.news || {})) {
        await queueBatchDoc('news', docId, docData);
      }

      // Tulis SOP
      for (const [docId, docData] of Object.entries(collections.sop || {})) {
        await queueBatchDoc('sop', docId, docData);
      }

      // Tulis Staff
      for (const [docId, docData] of Object.entries(collections.staff || {})) {
        await queueBatchDoc('staff', docId, docData);
      }

      // Tulis Admin Emails
      for (const [docId, docData] of Object.entries(collections.admin_emails || {})) {
        await queueBatchDoc('admin_emails', docId, docData);
      }

      if (opCount > 0) {
        await currentBatch.commit();
      }

      reportDetails.push(`Berhasil memulihkan ${totalSuccessDocs} dokumen Firestore.`);
      reportDetails.push(`Berhasil memproses ${successImages} gambar (${failedImages} gagal).`);

      setRestoreReport({
        timestamp: new Date().toLocaleTimeString('id-ID'),
        totalDocs: restorePreview.totalDocs,
        successDocs: totalSuccessDocs,
        failedDocs: totalFailedDocs,
        totalImages: entries.length,
        successImages,
        failedImages,
        safetyBackupName: safetyName,
        details: reportDetails,
      });

      onShowToast(
        'Restore data selesai!',
        'success',
        `${totalSuccessDocs} dokumen dan ${successImages} gambar berhasil dipulihkan ke Firestore.`
      );

      // Reset form
      setConfirmStep(0);
      setConfirmationInput('');
      setRestorePreview(null);
      setRestoreFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      console.error('Error saat restore:', err);
      onShowToast('Gagal memulihkan data', 'error', err?.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsRestoring(false);
      setRestoreProgressText('');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-12">
      {/* Kartu Header Ringkasan Status Backup */}
      <div className="bg-white rounded-3xl border border-[#E6DFD3] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E6DFD3] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1B4332] uppercase tracking-wider">
              <Archive className="w-3.5 h-3.5" />
              <span>Pusat Cadangan & Pemulihan Sistem</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Backup & Restore Data Perpustakaan
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
              Kemas seluruh koleksi berita, profil visi misi, jam layanan, SOP, struktur organisasi, dan file foto ke dalam satu berkas arsip ZIP berstandar aman.
            </p>
          </div>

          {/* Indikator Status Waktu Backup Terakhir */}
          <div className="shrink-0">
            {loadingMeta ? (
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memuat status backup...</span>
              </div>
            ) : lastBackupDate ? (
              <div
                className={`p-4 rounded-2xl border flex items-center gap-3 ${
                  daysAgo !== null && daysAgo > 7
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}
              >
                {daysAgo !== null && daysAgo > 7 ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                <div>
                  <p className="text-xs font-bold leading-tight">
                    {daysAgo === 0 ? 'Backup terakhir: Hari ini' : `Backup terakhir: ${daysAgo} hari lalu`}
                  </p>
                  <p className="text-[11px] opacity-80 font-mono mt-0.5">
                    {new Date(lastBackupDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    WIB
                  </p>
                  {daysAgo !== null && daysAgo > 7 && (
                    <span className="inline-block mt-1 text-[10px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
                      ⚠️ Lebih dari 7 hari: Dianjurkan membuat cadangan baru!
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold">Belum pernah melakukan backup</p>
                  <p className="text-[11px] opacity-80 mt-0.5">
                    Klik tombol "Backup Data Sekarang" untuk membuat cadangan pertama.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dua Kolom: BACKUP & RESTORE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ======================================================== */}
          {/* KOLOM KIRI: BACKUP DATA                                  */}
          {/* ======================================================== */}
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#E6DFD3] p-6 sm:p-7 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1B4332] text-white flex items-center justify-center shadow-2xs">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Cadangkan Data (Backup)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Menghasilkan satu file berkas ZIP terpadu.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-stone-600 leading-relaxed font-sans bg-white p-4 rounded-xl border border-[#E6DFD3]">
                <p className="font-semibold text-stone-800 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-[#1B4332]" />
                  Struktur Berkas Cadangan:
                </p>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-stone-600 ml-1">
                  <li>
                    <strong className="text-stone-800 font-mono">data.json</strong>: Seluruh dokumen koleksi berita, pengaturan, jam operasional, statistik, dan SOP.
                  </li>
                  <li>
                    <strong className="text-stone-800 font-mono">images/</strong>: Seluruh berkas gambar foto berita, avatar staf, dan logo resmi sekolah.
                  </li>
                  <li>
                    Pemetaan otomatis URL foto lama ke berkas lokal.
                  </li>
                  <li>
                    Penamaan otomatis: <span className="font-mono bg-stone-100 px-1 py-0.5 rounded text-stone-800">backup-perpustakaan-YYYY-MM-DD.zip</span>
                  </li>
                </ul>
              </div>

              {isBackingUp && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                    <span>Sedang memproses cadangan...</span>
                  </div>
                  <p className="text-xs text-emerald-800 font-mono">{backupProgressText}</p>
                </div>
              )}

              {backupReport && (
                <div className="p-4 rounded-xl bg-white border border-[#E6DFD3] space-y-2 text-xs text-stone-700 animate-in fade-in">
                  <p className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Laporan Backup Selesai ({backupReport.timestamp})
                  </p>
                  <p className="text-[11px]">
                    Nama berkas: <span className="font-mono font-semibold">{backupReport.fileName}</span>
                  </p>
                  <p className="text-[11px]">
                    Total dokumen: <strong>{backupReport.totalDocs}</strong> · Gambar berhasil diunduh: <strong>{backupReport.successImages}</strong> dari {backupReport.totalImages}
                  </p>
                  {backupReport.failedImages.length > 0 && (
                    <div className="pt-1 border-t border-stone-200">
                      <p className="text-[10px] text-amber-800 font-semibold">
                        Catatan {backupReport.failedImages.length} gambar dilewati (CORS atau URL offline):
                      </p>
                      <ul className="text-[10px] text-stone-500 list-disc list-inside mt-0.5 space-y-0.5">
                        {backupReport.failedImages.slice(0, 3).map((f, idx) => (
                          <li key={idx} className="truncate" title={f.url}>
                            {f.error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#E6DFD3]">
              <button
                type="button"
                disabled={isBackingUp || isRestoring}
                onClick={() => handleBackup(false)}
                className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-[#1B4332] text-white text-xs sm:text-sm font-semibold hover:bg-[#143527] transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isBackingUp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sedang Mengunduh Backup...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Backup Data Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* KOLOM KANAN: RESTORE DATA                                */}
          {/* ======================================================== */}
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#E6DFD3] p-6 sm:p-7 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-2xs">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Pulihkan Data (Restore)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Unggah berkas ZIP cadangan resmi sebelumnya.
                  </p>
                </div>
              </div>

              {/* Area Pilih File */}
              <div className="p-4 rounded-xl bg-white border border-[#E6DFD3] space-y-3">
                <label className="text-xs font-semibold text-stone-700 block">
                  Pilih File ZIP Cadangan (.zip)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".zip,application/zip"
                    onChange={handleFileSelect}
                    disabled={isRestoring || isValidatingZip}
                    className="block w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-3 file:rounded-xl file:border file:border-[#E6DFD3] file:text-xs file:font-semibold file:bg-[#FAF8F5] file:text-stone-700 hover:file:bg-[#F2ECE1] cursor-pointer"
                  />
                </div>

                {isValidatingZip && (
                  <p className="text-xs text-[#1B4332] font-medium flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Memeriksa struktur arsip ZIP & data.json...
                  </p>
                )}

                {validationError && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{validationError}</span>
                  </div>
                )}
              </div>

              {/* Pratinjau Data Jika File ZIP Valid */}
              {restorePreview && (
                <div className="p-4 rounded-xl bg-white border-2 border-emerald-400 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      Pratinjau Berkas Cadangan
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                      Format v{restorePreview.version}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                      <span className="text-[10px] text-stone-500 block uppercase">Tanggal Cadangan</span>
                      <strong className="text-stone-800 font-mono text-[11px]">
                        {new Date(restorePreview.backupDate).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </strong>
                    </div>

                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                      <span className="text-[10px] text-stone-500 block uppercase">Total Dokumen</span>
                      <strong className="text-[#1B4332] font-mono text-base">
                        {restorePreview.totalDocs} item
                      </strong>
                    </div>
                  </div>

                  {/* Rincian Koleksi */}
                  <div className="text-[11px] text-stone-600 space-y-1 bg-stone-50/70 p-2.5 rounded-lg border border-stone-200">
                    <p className="font-semibold text-stone-700">Rincian Dokumen:</p>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                      <span>• Berita: <strong>{restorePreview.collectionsCount.news}</strong></span>
                      <span>• SOP Pelayanan: <strong>{restorePreview.collectionsCount.sop}</strong></span>
                      <span>• Struktur Organisasi: <strong>{restorePreview.collectionsCount.staff}</strong></span>
                      <span>• Berkas Foto: <strong>{restorePreview.totalImages} file</strong></span>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-[11px] text-blue-900 flex items-start gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <span>
                      Sistem akan <strong>mengunduh cadangan pengaman otomatis</strong> sebelum proses restore dimulai.
                    </span>
                  </div>
                </div>
              )}

              {/* Status Progres Restore */}
              {isRestoring && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-700" />
                    <span>Sedang memulihkan data...</span>
                  </div>
                  <p className="text-xs font-mono text-amber-900">{restoreProgressText}</p>
                </div>
              )}

              {/* Laporan Akhir Restore */}
              {restoreReport && (
                <div className="p-4 rounded-xl bg-white border border-[#E6DFD3] space-y-2 text-xs text-stone-700 animate-in fade-in">
                  <p className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Laporan Pemulihan Selesai ({restoreReport.timestamp})
                  </p>
                  <p className="text-[11px]">
                    Dokumen dipulihkan: <strong>{restoreReport.successDocs}</strong> item · Foto berhasil diunggah: <strong>{restoreReport.successImages}</strong>
                  </p>
                  {restoreReport.safetyBackupName && (
                    <p className="text-[10px] text-stone-500 font-mono">
                      Cadangan pengaman: {restoreReport.safetyBackupName}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#E6DFD3]">
              <button
                type="button"
                disabled={!restorePreview || isRestoring || isValidatingZip}
                onClick={() => setConfirmStep(1)}
                className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-rose-700 text-white text-xs sm:text-sm font-semibold hover:bg-rose-800 transition-all shadow-xs cursor-pointer disabled:opacity-40"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Mulai Proses Restore Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion: Petunjuk Aturan CORS Firebase Storage */}
      <div className="bg-white rounded-3xl border border-[#E6DFD3] overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => setShowCorsGuide(!showCorsGuide)}
          className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm sm:text-base text-stone-900">
                Informasi & Panduan CORS Firebase Storage
              </h4>
              <p className="text-xs text-stone-500 font-sans">
                Penjelasan teknis jika unduhan gambar antar-domain dari Firebase Storage memerlukan konfigurasi izin CORS.
              </p>
            </div>
          </div>
          <div className="p-1.5 rounded-lg border border-[#E6DFD3] text-stone-500 bg-[#FAF8F5]">
            {showCorsGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showCorsGuide && (
          <div className="p-6 border-t border-[#E6DFD3] bg-[#FAF8F5] space-y-4 text-xs sm:text-sm text-stone-700 font-sans leading-relaxed">
            <p>
              Saat fitur Backup mengunduh file foto yang tersimpan di <strong>Firebase Storage</strong>, browser web memerlukan izin akses lintas-asal (CORS). Sistem kami telah dilengkapi dengan pendeteksi otomatis dan cadangan Base64 lokal, sehingga proses backup tetap berjalan aman bahkan jika izin CORS belum disetel.
            </p>
            <p>
              Namun, untuk memastikan seluruh gambar asli dari Google Cloud Storage dapat diunduh tanpa rintangan browser, Anda dapat menyetel aturan CORS pada Firebase Storage bucket Anda:
            </p>

            <div className="space-y-2">
              <p className="font-semibold text-stone-800 text-xs">
                1. Buat file <code className="bg-stone-200 px-1.5 py-0.5 rounded text-stone-900 font-mono">cors.json</code>:
              </p>
              <pre className="p-4 rounded-xl bg-stone-900 text-emerald-400 font-mono text-xs overflow-x-auto">
{`[
  {
    "origin": ["*"],
    "method": ["GET"],
    "maxAgeSeconds": 3600
  }
]`}
              </pre>
            </div>

            <div className="space-y-1">
              <p className="font-semibold text-stone-800 text-xs">
                2. Jalankan perintah Google Cloud SDK / gsutil:
              </p>
              <pre className="p-3.5 rounded-xl bg-stone-900 text-stone-100 font-mono text-xs overflow-x-auto">
gsutil cors set cors.json gs://ai-studio-perpustakaantiti-2784dc37-4cea-48d6-912d-787defc09871.appspot.com
              </pre>
            </div>

            <p className="text-xs text-stone-500 pt-2 border-t border-[#E6DFD3]">
              *Catatan: Foto berita dan avatar baru yang diunggah melalui dashboard juga otomatis tersimpan dengan mekanisme cadangan ganda (Storage + Firestore Base64) sehingga tetap aman terkelola.
            </p>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL KONFIRMASI GANDA RESTORE (2x KONFIRMASI AMAN)     */}
      {/* ======================================================== */}
      {confirmStep > 0 && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#E6DFD3] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* TAHAP 1: PERINGATAN AWAL */}
            {confirmStep === 1 && (
              <div className="space-y-5 text-center">
                <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto shadow-xs">
                  <ShieldAlert className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                    Konfirmasi Tahap 1 dari 2
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-stone-900 pt-1">
                    Peringatan Penimpaan Data
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                    Memulihkan data akan <strong>menimpa seluruh konten website saat ini</strong> (berita, profil, jam layanan, SOP, dan susunan organisasi) dengan data dari berkas cadangan tanggal{' '}
                    <strong>
                      {restorePreview &&
                        new Date(restorePreview.backupDate).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                    </strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 text-left flex items-start gap-2.5 font-sans">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    Sebagai langkah pengaman, sistem akan secara otomatis mengunduh berkas backup kondisi saat ini ke komputer Anda sebelum penulisan dilakukan.
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setConfirmStep(0)}
                    className="px-5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfirmStep(2)}
                    className="px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                  >
                    Saya Mengerti, Lanjut Tahap Akhir
                  </button>
                </div>
              </div>
            )}

            {/* TAHAP 2: KONFIRMASI FINAL DENGAN VERIFIKASI TEKS */}
            {confirmStep === 2 && (
              <div className="space-y-5 text-center">
                <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center mx-auto shadow-xs">
                  <AlertTriangle className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-2.5 py-1 rounded-full">
                    Konfirmasi Final (Tahap 2 dari 2)
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-stone-900 pt-1">
                    Konfirmasi Penimpaan Database
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                    Untuk menghindari ketidaksengajaan, ketik kata{' '}
                    <strong className="text-rose-700 font-mono bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      RESTORE
                    </strong>{' '}
                    pada kotak di bawah ini untuk memulai proses pemulihan data:
                  </p>
                </div>

                <div className="max-w-xs mx-auto">
                  <input
                    type="text"
                    value={confirmationInput}
                    onChange={(e) => setConfirmationInput(e.target.value)}
                    placeholder="Ketik RESTORE"
                    className="w-full px-4 py-2.5 text-center rounded-xl border-2 border-stone-300 font-mono font-bold text-sm text-stone-900 tracking-widest focus:border-rose-600 focus:outline-none uppercase"
                  />
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmStep(0);
                      setConfirmationInput('');
                    }}
                    className="px-5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>

                  <button
                    type="button"
                    disabled={confirmationInput.trim().toUpperCase() !== 'RESTORE'}
                    onClick={() => {
                      setConfirmStep(0);
                      handleExecuteRestore();
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-xs"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Pulihkan Data Sekarang</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
