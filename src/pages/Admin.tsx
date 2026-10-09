import React, { useState, useRef } from 'react';
import {
  Lock,
  LogOut,
  Save,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  FileText,
  Users,
  Settings as SettingsIcon,
  Shield,
  Clock,
  Sparkles,
  Database,
  X,
  Loader2,
  RefreshCw,
  Info,
  Check,
  BookOpen,
} from 'lucide-react';
import { useLibrary, BOOTSTRAP_ADMIN_EMAIL } from '../context/LibraryContext';
import { uploadAndProcessPhoto, validateImageFile, ImageUploadResult, blobToBase64 } from '../lib/firebase';
import { NewsItem, SOPEntry, StaffMember, OperatingHours, ContactInfo, LibraryProfile } from '../types';

interface ConfirmDialogState {
  isOpen: boolean;
  type: 'deleteNews' | 'deleteSOP' | 'deleteStaff' | 'removeAdmin' | 'seed';
  id: string;
  title: string;
  message: string;
  targetName?: string;
}

interface ToastState {
  type: 'success' | 'error' | 'info';
  message: string;
  details?: string;
}

export const Admin: React.FC = () => {
  const {
    settings,
    operatingHours,
    contactInfo,
    newsList,
    sopList,
    staffList,
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
  } = useLibrary();

  const [activeTab, setActiveTab] = useState<'settings' | 'news' | 'sop' | 'staff' | 'admins'>('settings');
  const [authError, setAuthError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal konfirmasi khusus (pengganti window.confirm / alert)
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null);
  const [isConfirmingAction, setIsConfirmingAction] = useState(false);

  // States for Settings Form
  const [profileForm, setProfileForm] = useState<LibraryProfile>(settings);
  const [hoursForm, setHoursForm] = useState<OperatingHours[]>(operatingHours);
  const [contactForm, setContactForm] = useState<ContactInfo>(contactInfo);

  // States for Logo Upload di Pengaturan Umum
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null);
  const logoFileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync settings form when settings load from Firestore
  React.useEffect(() => {
    setProfileForm(settings);
    setHoursForm(operatingHours);
    setContactForm(contactInfo);
  }, [settings, operatingHours, contactInfo]);

  // Handler Upload Logo Perpustakaan
  const handleLogoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi format logo (PNG, JPG, WebP, SVG)
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    const validExts = /\.(png|jpe?g|webp|svg)$/i;
    if (!validTypes.includes(file.type.toLowerCase()) && !validExts.test(file.name)) {
      setLogoUploadError('Format logo tidak didukung. Harap pilih file gambar PNG, JPG, WebP, atau SVG.');
      if (logoFileInputRef.current) logoFileInputRef.current.value = '';
      return;
    }

    setLogoUploading(true);
    try {
      let finalLogoUrl = '';
      if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
        // SVG langsung dijadikan Data URL bersih
        finalLogoUrl = await blobToBase64(file);
      } else {
        // Kompresi otomatis target < 200 KB
        const uploadResult = await uploadAndProcessPhoto(file, 'logos');
        finalLogoUrl = uploadResult.url;
      }

      setProfileForm((prev) => ({ ...prev, logoUrl: finalLogoUrl }));
      showToast('Logo berhasil diunggah! Simpan pengaturan untuk menerapkan ke seluruh halaman.');
    } catch (err: any) {
      console.error('[handleLogoFileSelect] Error:', err);
      setLogoUploadError('Gagal mengunggah logo: ' + (err.message || 'Terjadi kesalahan sistem.'));
    } finally {
      setLogoUploading(false);
      if (logoFileInputRef.current) logoFileInputRef.current.value = '';
    }
  };

  const handleRemoveLogo = () => {
    setProfileForm((prev) => ({ ...prev, logoUrl: '' }));
    if (logoFileInputRef.current) logoFileInputRef.current.value = '';
    showToast('Logo dihapus. Tampilan website kembali menggunakan ikon buku bawaan.');
  };

  // Handler Manipulasi Baris Jam Layanan
  const handleAddHourRow = () => {
    setHoursForm((prev) => [
      ...prev,
      {
        dayRange: 'Hari Baru',
        hours: '08.00 – 14.00 WIB',
        breakTime: '-',
        isOpen: true,
        notes: '',
      },
    ]);
  };

  const handleRemoveHourRow = (index: number) => {
    if (hoursForm.length <= 1) {
      showToast('Minimal harus ada 1 baris jadwal layanan.', 'info');
      return;
    }
    setHoursForm((prev) => prev.filter((_, i) => i !== index));
  };

  // States for News Modal/Editing
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [newsImageFile, setNewsImageFile] = useState<File | null>(null);
  const [newsImagePreview, setNewsImagePreview] = useState<string>('');
  const [newsImageError, setNewsImageError] = useState<string | null>(null);
  const [newsUploadStatus, setNewsUploadStatus] = useState<string>('');
  const [newsFormError, setNewsFormError] = useState<string | null>(null);
  const [isSubmittingNews, setIsSubmittingNews] = useState(false);
  const newsFileInputRef = useRef<HTMLInputElement | null>(null);

  // States for SOP Modal/Editing
  const [editingSOP, setEditingSOP] = useState<SOPEntry | null>(null);
  const [isSOPModalOpen, setIsSOPModalOpen] = useState(false);

  // States for Staff Modal/Editing
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [staffImageFile, setStaffImageFile] = useState<File | null>(null);
  const [staffImagePreview, setStaffImagePreview] = useState<string>('');
  const [staffImageError, setStaffImageError] = useState<string | null>(null);
  const [staffUploadStatus, setStaffUploadStatus] = useState<string>('');
  const [isSubmittingStaff, setIsSubmittingStaff] = useState(false);
  const staffFileInputRef = useRef<HTMLInputElement | null>(null);

  // New Admin email input
  const [newAdminEmail, setNewAdminEmail] = useState('');

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success', details?: string) => {
    setToast({ type, message, details });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  // Helper untuk membuat slug ramah URL
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // --- AUTH CHECK SCREENS ---
  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E6DFD3] p-8 sm:p-10 shadow-sm text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-7 h-7 text-emerald-200" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Masuk Dashboard Admin
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
              Portal manajemen konten Perpustakaan Titian Ilmu SMP Negeri 1 Tambak.
              Hanya email yang telah terdaftar sebagai administrator yang diizinkan masuk.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 text-left flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={async () => {
                setAuthError(null);
                try {
                  await loginWithGoogle();
                } catch (err: any) {
                  console.error('Login error:', err);
                  setAuthError(err.message || 'Gagal masuk akun. Pastikan koneksi stabil.');
                }
              }}
              className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-sm transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Masuk dengan Akun Google</span>
            </button>
          </div>

          <div className="pt-2 text-[11px] text-stone-500 border-t border-[#E6DFD3] space-y-1">
            <p>Administrator Terdaftar:</p>
            <p className="font-mono text-stone-700 font-medium">{BOOTSTRAP_ADMIN_EMAIL}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E6DFD3] p-8 text-center space-y-5 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6 text-amber-700" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Akses Ditolak
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
            Akun <strong>{user.email}</strong> berhasil login, tetapi belum terdaftar di dalam daftar administrator Perpustakaan Titian Ilmu.
          </p>
          <div className="pt-2">
            <button
              onClick={logout}
              className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Keluar & Ganti Akun
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- HANDLER SIMPAN PENGATURAN UMUM ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await updateSettings(profileForm, hoursForm, contactForm);
      showToast('Pengaturan umum perpustakaan berhasil diperbarui!');
    } catch (err: any) {
      console.error('[handleSaveSettings] Error:', err);
      showToast('Gagal menyimpan pengaturan: ' + (err.message || 'Terjadi kesalahan.'), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // --- EKSEKUSI DIALOG KONFIRMASI (HAPUS BERITA, SOP, STAF, ADMIN, SEED) ---
  const handleExecuteConfirmedAction = async () => {
    if (!confirmDialog) return;
    setIsConfirmingAction(true);
    try {
      switch (confirmDialog.type) {
        case 'deleteNews':
          console.log(`[Admin] Menghapus dokumen berita ID: ${confirmDialog.id}`);
          await deleteNews(confirmDialog.id);
          showToast(`Berita "${confirmDialog.targetName || ''}" berhasil dihapus.`);
          break;
        case 'deleteSOP':
          console.log(`[Admin] Menghapus dokumen SOP ID: ${confirmDialog.id}`);
          await deleteSOP(confirmDialog.id);
          showToast(`SOP "${confirmDialog.targetName || ''}" berhasil dihapus.`);
          break;
        case 'deleteStaff':
          console.log(`[Admin] Menghapus dokumen staf ID: ${confirmDialog.id}`);
          await deleteStaff(confirmDialog.id);
          showToast(`Data pengelola "${confirmDialog.targetName || ''}" berhasil dihapus.`);
          break;
        case 'removeAdmin':
          console.log(`[Admin] Mencabut akses admin untuk: ${confirmDialog.id}`);
          await removeAdminEmail(confirmDialog.id);
          showToast(`Akses admin untuk "${confirmDialog.id}" telah dicabut.`);
          break;
        case 'seed':
          console.log('[Admin] Menginisialisasi data awal Firestore...');
          await seedInitialDataIfEmpty();
          showToast('Data awal berhasil diinisialisasi ke Firestore!');
          break;
      }
      setConfirmDialog(null);
    } catch (err: any) {
      console.error('[handleExecuteConfirmedAction] Error:', err);
      showToast('Gagal menjalankan aksi: ' + (err.message || 'Terjadi kesalahan sistem.'), 'error');
    } finally {
      setIsConfirmingAction(false);
    }
  };

  // --- HANDLER UPLOAD FOTO BERITA (DENGAN KOMPRESI & VALIDASI) ---
  const handleNewsFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewsImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Validasi format JPG, PNG, WebP
      validateImageFile(file);
      setNewsImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setNewsImagePreview(previewUrl);
    } catch (valErr: any) {
      console.warn('[NewsFile] Format ditolak:', valErr);
      setNewsImageError(valErr.message || 'Format file bukan gambar yang didukung.');
      if (newsFileInputRef.current) newsFileInputRef.current.value = '';
    }
  };

  const handleRemoveNewsPhoto = () => {
    setNewsImageFile(null);
    setNewsImagePreview('');
    setNewsImageError(null);
    if (editingNews) {
      setEditingNews({ ...editingNews, imageUrl: '' });
    }
    if (newsFileInputRef.current) newsFileInputRef.current.value = '';
  };

  // --- HANDLER SUBMIT BERITA (TAMBAH / EDIT DENGAN updateDoc) ---
  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;

    if (!editingNews.title.trim()) {
      setNewsFormError('Judul berita tidak boleh kosong.');
      return;
    }
    if (!editingNews.excerpt.trim()) {
      setNewsFormError('Cuplikan ringkas berita tidak boleh kosong.');
      return;
    }

    setNewsFormError(null);
    setIsSubmittingNews(true);
    setNewsUploadStatus('Menyiapkan data berita...');

    try {
      let finalImageUrl = editingNews.imageUrl || '';
      let usedFallback = false;
      let fallbackSize = 0;

      // 1. Jika pengguna memilih file foto baru
      if (newsImageFile) {
        setNewsUploadStatus('Mengompresi gambar di browser (maks. 1280px, ~80%, <300 KB)...');
        console.log('[handleSaveNews] Memproses upload foto baru:', newsImageFile.name);

        const uploadResult: ImageUploadResult = await uploadAndProcessPhoto(newsImageFile, 'news_covers');
        finalImageUrl = uploadResult.url;

        if (uploadResult.source === 'base64_fallback') {
          usedFallback = true;
          fallbackSize = uploadResult.sizeKB;
          console.info(`[handleSaveNews] Menggunakan cadangan Base64 Firestore (${uploadResult.sizeKB} KB)`);
        } else {
          console.info('[handleSaveNews] Berhasil mengunggah ke Firebase Storage:', uploadResult.url);
        }
      } else if (!newsImagePreview) {
        // Pengguna menghapus foto
        finalImageUrl = '';
      }

      setNewsUploadStatus('Menyimpan dokumen ke database Firestore...');

      // Olah paragraf konten
      const processedContent = Array.isArray(editingNews.content)
        ? editingNews.content.filter((p) => typeof p === 'string' && p.trim().length > 0)
        : typeof editingNews.content === 'string'
        ? (editingNews.content as string)
            .split('\n\n')
            .map((p) => p.trim())
            .filter(Boolean)
        : [''];

      const payloadData: Omit<NewsItem, 'id'> = {
        title: editingNews.title.trim(),
        slug: editingNews.slug?.trim() || generateSlug(editingNews.title.trim()),
        category: editingNews.category || 'Kegiatan',
        date: editingNews.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        author: editingNews.author?.trim() || user.displayName || 'Admin Pustaka',
        authorRole: editingNews.authorRole?.trim() || 'Pengelola Perpustakaan',
        readTime: editingNews.readTime?.trim() || '3 menit baca',
        excerpt: editingNews.excerpt.trim(),
        content: processedContent.length > 0 ? processedContent : ['Konten berita akan segera dilengkapi.'],
        imageUrl: finalImageUrl,
        featured: Boolean(editingNews.featured),
      };

      if (editingNews.id) {
        // Mode EDIT: panggil updateNews yang menggunakan updateDoc dengan ID dokumen yang tepat
        console.log(`[handleSaveNews] Memperbarui berita dengan ID: "${editingNews.id}"`, payloadData);
        await updateNews(editingNews.id, payloadData);
        if (usedFallback) {
          showToast(
            'Berita berhasil diperbarui!',
            'info',
            `Foto disimpan via cadangan Base64 Firestore (${fallbackSize} KB) karena Firebase Storage tidak aktif.`
          );
        } else {
          showToast('Berita berhasil diperbarui di database Firestore!');
        }
      } else {
        // Mode TAMBAH BARU
        console.log('[handleSaveNews] Menerbitkan berita baru:', payloadData);
        await addNews(payloadData);
        if (usedFallback) {
          showToast(
            'Berita baru berhasil diterbitkan!',
            'info',
            `Foto disimpan via cadangan Base64 Firestore (${fallbackSize} KB) karena Firebase Storage tidak aktif.`
          );
        } else {
          showToast('Berita baru berhasil diterbitkan ke website!');
        }
      }

      setIsNewsModalOpen(false);
      setEditingNews(null);
      setNewsImageFile(null);
      setNewsImagePreview('');
    } catch (err: any) {
      console.error('[handleSaveNews] Gagal menyimpan berita:', err);
      setNewsFormError('Gagal menyimpan berita: ' + (err.message || 'Terjadi kesalahan koneksi database.'));
      showToast('Gagal menyimpan berita: ' + (err.message || 'Periksa koneksi Anda.'), 'error');
    } finally {
      setIsSubmittingNews(false);
      setNewsUploadStatus('');
    }
  };

  // --- HANDLER FOTO STAF (DENGAN KOMPRESI) ---
  const handleStaffFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStaffImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      validateImageFile(file);
      setStaffImageFile(file);
      setStaffImagePreview(URL.createObjectURL(file));
    } catch (err: any) {
      setStaffImageError(err.message || 'Format foto tidak didukung.');
      if (staffFileInputRef.current) staffFileInputRef.current.value = '';
    }
  };

  const handleRemoveStaffPhoto = () => {
    setStaffImageFile(null);
    setStaffImagePreview('');
    setStaffImageError(null);
    if (editingStaff) {
      setEditingStaff({ ...editingStaff, avatarUrl: '' });
    }
    if (staffFileInputRef.current) staffFileInputRef.current.value = '';
  };

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    setIsSubmittingStaff(true);
    setStaffUploadStatus('Memproses data staf...');

    try {
      let finalAvatarUrl = editingStaff.avatarUrl || '';

      if (staffImageFile) {
        setStaffUploadStatus('Mengompresi foto staf di browser...');
        const res = await uploadAndProcessPhoto(staffImageFile, 'staff_avatars');
        finalAvatarUrl = res.url;
      } else if (!staffImagePreview) {
        finalAvatarUrl = '';
      }

      const payload = {
        ...editingStaff,
        avatarUrl: finalAvatarUrl,
      };

      if (editingStaff.id) {
        await updateStaff(editingStaff.id, payload);
        showToast('Data pengelola perpustakaan berhasil diperbarui!');
      } else {
        const { id, ...dataToSave } = payload;
        await addStaff(dataToSave);
        showToast('Staf baru berhasil ditambahkan!');
      }

      setIsStaffModalOpen(false);
      setEditingStaff(null);
      setStaffImageFile(null);
      setStaffImagePreview('');
    } catch (err: any) {
      console.error('[handleSaveStaff] Error:', err);
      showToast('Gagal menyimpan staf: ' + (err.message || 'Terjadi kesalahan.'), 'error');
    } finally {
      setIsSubmittingStaff(false);
      setStaffUploadStatus('');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification Elegan */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-4 rounded-2xl shadow-xl flex items-start gap-3.5 max-w-md border transition-all animate-in fade-in slide-in-from-bottom-2 ${
            toast.type === 'success'
              ? 'bg-[#1B4332] text-white border-emerald-800'
              : toast.type === 'info'
              ? 'bg-amber-950 text-amber-50 border-amber-800'
              : 'bg-rose-950 text-rose-50 border-rose-800'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />}

          <div className="flex-1 space-y-0.5 text-xs sm:text-sm font-sans">
            <p className="font-semibold leading-snug">{toast.message}</p>
            {toast.details && <p className="text-[11px] opacity-90 leading-relaxed">{toast.details}</p>}
          </div>

          <button
            onClick={() => setToast(null)}
            className="text-white/70 hover:text-white p-0.5 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Admin Header Bar */}
      <div className="bg-white rounded-3xl border border-[#E6DFD3] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1B4332] uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Panel Pengelola Perpustakaan</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Dashboard Administrator
          </h1>
          <p className="text-xs text-stone-500">
            Masuk sebagai: <span className="font-mono font-medium text-stone-800">{user.email}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setConfirmDialog({
                isOpen: true,
                type: 'seed',
                id: 'seed-action',
                title: 'Inisialisasi Data Contoh?',
                message:
                  'Tindakan ini akan mengisikan berita contoh, alur SOP, dan struktur organisasi awal ke Firestore jika database Anda saat ini masih kosong.',
                targetName: 'Data Contoh Perpustakaan',
              });
            }}
            disabled={actionLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] hover:bg-[#F2ECE1] text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
            title="Isi data awal jika database masih kosong"
          >
            <Database className="w-4 h-4 text-[#1B4332]" />
            <span>Inisialisasi Data Awal</span>
          </button>

          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E6DFD3]">
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-[#1B4332] text-white shadow-2xs'
              : 'bg-white text-stone-600 hover:text-stone-900 border border-[#E6DFD3]'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>Pengaturan Umum</span>
        </button>

        <button
          onClick={() => setActiveTab('news')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'news'
              ? 'bg-[#1B4332] text-white shadow-2xs'
              : 'bg-white text-stone-600 hover:text-stone-900 border border-[#E6DFD3]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Kelola Berita ({newsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sop')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'sop'
              ? 'bg-[#1B4332] text-white shadow-2xs'
              : 'bg-white text-stone-600 hover:text-stone-900 border border-[#E6DFD3]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Kelola SOP Pelayanan ({sopList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'staff'
              ? 'bg-[#1B4332] text-white shadow-2xs'
              : 'bg-white text-stone-600 hover:text-stone-900 border border-[#E6DFD3]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Kelola Struktur Organisasi ({staffList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('admins')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'admins'
              ? 'bg-[#1B4332] text-white shadow-2xs'
              : 'bg-white text-stone-600 hover:text-stone-900 border border-[#E6DFD3]'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Daftar Email Admin ({adminEmails.length})</span>
        </button>
      </div>

      {/* TAB 1: PENGATURAN UMUM */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-8">
          {/* Section: Logo Perpustakaan */}
          <div className="bg-white rounded-3xl border border-[#E6DFD3] p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E6DFD3] pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Logo & Identitas Visual Perpustakaan
                </h3>
                <p className="text-xs text-stone-500 font-sans mt-0.5">
                  Logo ini akan menggantikan ikon buku bawaan di navbar, footer, dan favicon browser.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {profileForm.logoUrl ? 'Logo Kustom Aktif' : 'Ikon Buku Bawaan'}
              </span>
            </div>

            {logoUploadError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{logoUploadError}</span>
              </div>
            )}

            <input
              ref={logoFileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleLogoFileSelect}
              className="hidden"
            />

            <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6DFD3]">
              {/* Logo Preview (object-contain, proporsional, tidak gepeng) */}
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-white border-2 border-stone-200 p-2 flex items-center justify-center shrink-0 shadow-2xs">
                {profileForm.logoUrl ? (
                  <img
                    src={profileForm.logoUrl}
                    alt="Logo Perpustakaan"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-[#1B4332] text-white flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-emerald-200" strokeWidth={2} />
                  </div>
                )}
              </div>

              <div className="space-y-2 flex-1">
                <div>
                  <h4 className="text-sm font-bold text-stone-900 font-sans">
                    {profileForm.logoUrl ? 'Logo Resmi Perpustakaan Titian Ilmu' : 'Belum Ada Logo yang Diunggah'}
                  </h4>
                  <p className="text-xs text-stone-600 font-sans leading-relaxed">
                    Dukung format PNG, JPG, WebP, atau SVG transparan. Gambar otomatis dikompres di browser (&lt; 200 KB) agar cepat dimuat di HP.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    disabled={logoUploading}
                    onClick={() => logoFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E6DFD3] bg-white hover:bg-stone-50 text-xs font-semibold text-stone-800 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
                  >
                    {logoUploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Mengompres & Mengunggah...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-[#1B4332]" />
                        <span>{profileForm.logoUrl ? 'Ganti Logo' : 'Pilih File Logo'}</span>
                      </>
                    )}
                  </button>

                  {profileForm.logoUrl && (
                    <button
                      type="button"
                      disabled={logoUploading}
                      onClick={handleRemoveLogo}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Logo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#E6DFD3] p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="font-serif text-xl font-bold text-stone-900 border-b border-[#E6DFD3] pb-3">
              Identitas Perpustakaan & Tagline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">Nama Perpustakaan</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-[#1B4332] focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">Nama Sekolah</label>
                <input
                  type="text"
                  value={profileForm.schoolName}
                  onChange={(e) => setProfileForm({ ...profileForm, schoolName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-[#1B4332] focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">Tagline / Semboyan</label>
                <input
                  type="text"
                  value={profileForm.tagline}
                  onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-[#1B4332] focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">Nomor Pokok Sekolah Nasional (NPSN)</label>
                <input
                  type="text"
                  value={profileForm.npsn}
                  onChange={(e) => setProfileForm({ ...profileForm, npsn: e.target.value })}
                  placeholder="Diisi nomor NPSN atau '-'"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-[#1B4332] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">Status Akreditasi</label>
                <input
                  type="text"
                  value={profileForm.accreditation}
                  onChange={(e) => setProfileForm({ ...profileForm, accreditation: e.target.value })}
                  placeholder="Contoh: Akreditasi A atau '-'"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-[#1B4332] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">Tentang Perpustakaan (Ringkasan)</label>
              <textarea
                rows={3}
                value={profileForm.about}
                onChange={(e) => setProfileForm({ ...profileForm, about: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-[#1B4332] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">Sejarah Singkat</label>
              <textarea
                rows={4}
                value={profileForm.history}
                onChange={(e) => setProfileForm({ ...profileForm, history: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-[#1B4332] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">Visi</label>
              <textarea
                rows={2}
                value={profileForm.vision}
                onChange={(e) => setProfileForm({ ...profileForm, vision: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-[#1B4332] focus:outline-none"
              />
            </div>
          </div>

          {/* Jam Layanan */}
          <div className="bg-white rounded-3xl border border-[#E6DFD3] p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6DFD3] pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Jadwal Jam Layanan Pemustaka
                </h3>
                <p className="text-xs text-stone-500 font-sans mt-0.5">
                  Atur jam buka hari kerja dan hari tutup (Sabtu & Minggu tutup). Perubahan tampil otomatis di seluruh halaman.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddHourRow}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] hover:bg-[#F2ECE1] text-xs font-semibold text-stone-700 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5 text-[#1B4332]" />
                <span>Tambah Baris Jadwal</span>
              </button>
            </div>

            <div className="space-y-3">
              {hoursForm.map((slot, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    slot.isOpen ? 'bg-[#FAF8F5] border-[#E6DFD3]' : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    <div>
                      <label className="text-[11px] font-semibold text-stone-700 block">Hari</label>
                      <input
                        type="text"
                        value={slot.dayRange}
                        onChange={(e) => {
                          const copy = [...hoursForm];
                          copy[idx].dayRange = e.target.value;
                          setHoursForm(copy);
                        }}
                        className="w-full mt-1 px-3 py-2 rounded-xl border border-[#E6DFD3] bg-white text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-stone-700 block">Status Layanan</label>
                      <select
                        value={slot.isOpen ? 'open' : 'closed'}
                        onChange={(e) => {
                          const copy = [...hoursForm];
                          copy[idx].isOpen = e.target.value === 'open';
                          if (e.target.value === 'closed' && copy[idx].hours !== 'Tutup') {
                            copy[idx].hours = 'Tutup';
                          }
                          setHoursForm(copy);
                        }}
                        className="w-full mt-1 px-3 py-2 rounded-xl border border-[#E6DFD3] bg-white text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
                      >
                        <option value="open">Buka (Layanan Aktif)</option>
                        <option value="closed">Tutup (Libur)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-stone-700 block">Jam Operasional</label>
                      <input
                        type="text"
                        value={slot.hours}
                        onChange={(e) => {
                          const copy = [...hoursForm];
                          copy[idx].hours = e.target.value;
                          setHoursForm(copy);
                        }}
                        className="w-full mt-1 px-3 py-2 rounded-xl border border-[#E6DFD3] bg-white text-xs text-stone-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
                      />
                    </div>

                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="text-[11px] font-semibold text-stone-700 block">Keterangan / Istirahat</label>
                        <input
                          type="text"
                          value={slot.notes || slot.breakTime || ''}
                          onChange={(e) => {
                            const copy = [...hoursForm];
                            copy[idx].notes = e.target.value;
                            setHoursForm(copy);
                          }}
                          placeholder="Misal: Pelayanan tatap muka libur"
                          className="w-full mt-1 px-3 py-2 rounded-xl border border-[#E6DFD3] bg-white text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveHourRow(idx)}
                        className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                        title="Hapus baris jadwal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kontak & Media Sosial */}
          <div className="bg-white rounded-3xl border border-[#E6DFD3] p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="font-serif text-xl font-bold text-stone-900 border-b border-[#E6DFD3] pb-3">
              Kontak, Alamat & Media Sosial
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Alamat Lengkap</label>
                <input
                  type="text"
                  value={contactForm.address}
                  onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6DFD3] text-xs text-stone-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Nomor Telepon</label>
                <input
                  type="text"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6DFD3] text-xs text-stone-900 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">WhatsApp</label>
                <input
                  type="text"
                  value={contactForm.whatsapp}
                  onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6DFD3] text-xs text-stone-900 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Email Resmi</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6DFD3] text-xs text-stone-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Instagram</label>
                <input
                  type="text"
                  value={contactForm.instagram}
                  onChange={(e) => setContactForm({ ...contactForm, instagram: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6DFD3] text-xs text-stone-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">YouTube</label>
                <input
                  type="text"
                  value={contactForm.youtube}
                  onChange={(e) => setContactForm({ ...contactForm, youtube: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6DFD3] text-xs text-stone-900"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1B4332] text-white text-sm font-semibold hover:bg-[#143527] transition-all shadow-xs cursor-pointer"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{actionLoading ? 'Menyimpan...' : 'Simpan Seluruh Pengaturan'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: KELOLA BERITA */}
      {activeTab === 'news' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Daftar Berita & Warta Literasi
              </h3>
              <p className="text-xs text-stone-500">
                Publikasikan artikel, dokumentasi kegiatan, atau pengumuman perpustakaan.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingNews({
                  id: '',
                  slug: '',
                  title: '',
                  category: 'Kegiatan',
                  date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                  author: user.displayName || 'Admin Pustaka',
                  authorRole: 'Pengelola Perpustakaan',
                  readTime: '3 menit baca',
                  excerpt: '',
                  content: [''],
                  imageUrl: '',
                  featured: false,
                });
                setNewsImagePreview('');
                setNewsImageFile(null);
                setNewsImageError(null);
                setNewsFormError(null);
                if (newsFileInputRef.current) newsFileInputRef.current.value = '';
                setIsNewsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B4332] text-white text-xs font-semibold hover:bg-[#143527] transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tulis Berita Baru</span>
            </button>
          </div>

          {newsList.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E6DFD3] p-10 text-center space-y-3">
              <p className="text-sm text-stone-600">Belum ada berita yang tersimpan di database Firestore.</p>
              <button
                onClick={() => {
                  setConfirmDialog({
                    isOpen: true,
                    type: 'seed',
                    id: 'seed-news',
                    title: 'Inisialisasi Berita Contoh?',
                    message: 'Mengisi database Firestore dengan 3 artikel berita literasi contoh.',
                    targetName: 'Berita Contoh',
                  });
                }}
                className="text-xs font-semibold text-[#1B4332] hover:underline cursor-pointer"
              >
                Inisialisasi dengan Berita Contoh
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#E6DFD3] p-5 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-xs transition-shadow"
                >
                  <div className="space-y-3">
                    {item.imageUrl ? (
                      <div className="relative w-full h-40 rounded-xl overflow-hidden bg-stone-100 border border-[#E6DFD3]">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        {item.imageUrl.startsWith('data:') && (
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] text-white font-mono">
                            Base64
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-28 rounded-xl bg-[#FAF8F5] border border-dashed border-[#E6DFD3] flex items-center justify-center text-xs text-stone-400 gap-2">
                        <ImageIcon className="w-4 h-4" />
                        <span>Tanpa Foto Sampul</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-[11px] text-stone-500 font-sans">
                      <span className="font-semibold text-[#1B4332]">{item.category}</span>
                      <span>·</span>
                      <span>{item.date}</span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-stone-900 line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-sans">{item.excerpt}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#F2ECE1]">
                    <span className="text-[11px] text-stone-500 font-sans">{item.author}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingNews(item);
                          setNewsImagePreview(item.imageUrl || '');
                          setNewsImageFile(null);
                          setNewsImageError(null);
                          setNewsFormError(null);
                          if (newsFileInputRef.current) newsFileInputRef.current.value = '';
                          setIsNewsModalOpen(true);
                        }}
                        className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Edit Berita"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            type: 'deleteNews',
                            id: item.id,
                            title: 'Hapus Berita Ini?',
                            message: `Apakah Anda yakin ingin menghapus artikel "${item.title}"? Dokumen akan dihapus permanen dari Firestore.`,
                            targetName: item.title,
                          });
                        }}
                        className="p-2 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus Berita"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: KELOLA SOP */}
      {activeTab === 'sop' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Kelola Standar Operasional Prosedur (SOP)
              </h3>
              <p className="text-xs text-stone-500">
                Atur alur layanan, persyaratan, dan estimasi waktu pemrosesan buku & keanggotaan.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingSOP({
                  id: '',
                  title: '',
                  category: 'Layanan Sirkulasi',
                  description: '',
                  targetAudience: 'Seluruh Siswa dan Guru',
                  processingTime: '± 2 menit',
                  requirements: ['Membawa Kartu Anggota'],
                  steps: [{ stepNumber: 1, title: 'Langkah Awal', description: 'Deskripsi langkah' }],
                  notes: '',
                });
                setIsSOPModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B4332] text-white text-xs font-semibold hover:bg-[#143527] transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Dokumen SOP</span>
            </button>
          </div>

          <div className="space-y-3">
            {sopList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E6DFD3] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 font-sans">
                    <span className="font-semibold text-[#1B4332]">{item.category}</span>
                    <span>·</span>
                    <span>{item.steps.length} Langkah Alur</span>
                    <span>·</span>
                    <span>{item.processingTime}</span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-stone-900">
                    {item.title}
                  </h4>
                  <p className="text-xs text-stone-600 line-clamp-1">{item.description}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => {
                      setEditingSOP(item);
                      setIsSOPModalOpen(true);
                    }}
                    className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                    title="Edit SOP"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        type: 'deleteSOP',
                        id: item.id,
                        title: 'Hapus Dokumen SOP?',
                        message: `Apakah Anda yakin ingin menghapus SOP "${item.title}"? Prosedur ini akan dihilangkan dari tampilan publik.`,
                        targetName: item.title,
                      });
                    }}
                    className="p-2 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus SOP"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: KELOLA STRUKTUR ORGANISASI */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Kelola Struktur Organisasi & Pengelola
              </h3>
              <p className="text-xs text-stone-500">
                Daftar pengurus perpustakaan (Kepala Sekolah, Kepala Pustaka, Staf Teknis & Sirkulasi).
              </p>
            </div>
            <button
              onClick={() => {
                setEditingStaff({
                  id: '',
                  name: '',
                  role: '',
                  positionCategory: 'Layanan',
                  nip: '-',
                  education: '',
                  bio: '',
                  tasks: [''],
                  avatarUrl: '',
                });
                setStaffImagePreview('');
                setStaffImageFile(null);
                setStaffImageError(null);
                if (staffFileInputRef.current) staffFileInputRef.current.value = '';
                setIsStaffModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B4332] text-white text-xs font-semibold hover:bg-[#143527] transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Staf Pengelola</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E6DFD3] p-5 flex flex-col justify-between space-y-4 shadow-2xs"
              >
                <div className="flex items-start gap-4">
                  {item.avatarUrl ? (
                    <img
                      src={item.avatarUrl}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#E6DFD3]"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-[#1B4332] text-white flex items-center justify-center font-serif text-lg font-bold shrink-0">
                      {item.name.slice(0, 2)}
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-[#1B4332] uppercase tracking-wider block">
                      {item.role}
                    </span>
                    <h4 className="font-serif font-bold text-base text-stone-900 leading-snug">
                      {item.name}
                    </h4>
                    <p className="text-xs font-mono text-stone-500">NIP. {item.nip || '-'}</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#F2ECE1] text-xs text-stone-600">
                  <p className="font-semibold text-stone-700">Tugas Pokok:</p>
                  <ul className="space-y-1">
                    {item.tasks.slice(0, 2).map((t, i) => (
                      <li key={i} className="line-clamp-1">• {t}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F2ECE1]">
                  <button
                    onClick={() => {
                      setEditingStaff(item);
                      setStaffImagePreview(item.avatarUrl || '');
                      setStaffImageFile(null);
                      setStaffImageError(null);
                      if (staffFileInputRef.current) staffFileInputRef.current.value = '';
                      setIsStaffModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                    title="Edit Staf"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        type: 'deleteStaff',
                        id: item.id,
                        title: 'Hapus Data Staf?',
                        message: `Apakah Anda yakin ingin menghapus data pengelola "${item.name}"?`,
                        targetName: item.name,
                      });
                    }}
                    className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus Staf"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: KELOLA EMAIL ADMIN */}
      {activeTab === 'admins' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#E6DFD3] p-6 sm:p-8 space-y-6 shadow-xs max-w-2xl">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Otorisasi Email Administrator
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Hanya email-email di bawah ini yang dapat masuk ke panel dashboard dan memodifikasi data website.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Tambah email admin baru..."
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
              />
              <button
                type="button"
                onClick={async () => {
                  if (!newAdminEmail.trim()) return;
                  try {
                    await addAdminEmail(newAdminEmail);
                    setNewAdminEmail('');
                    showToast(`Email ${newAdminEmail} berhasil ditambahkan sebagai admin.`);
                  } catch (err: any) {
                    showToast('Gagal menambahkan admin: ' + err.message, 'error');
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-[#1B4332] text-white text-xs font-semibold hover:bg-[#143527] transition-colors cursor-pointer"
              >
                Tambah
              </button>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-stone-700">Daftar Admin Aktif:</label>
              {adminEmails.map((email) => {
                const isBootstrap = email.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();
                return (
                  <div
                    key={email}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#E6DFD3] text-xs font-mono"
                  >
                    <span className="text-stone-900">{email}</span>
                    {isBootstrap ? (
                      <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md font-sans">
                        Utama (Owner)
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            type: 'removeAdmin',
                            id: email,
                            title: 'Cabut Akses Admin?',
                            message: `Apakah Anda yakin ingin mencabut hak akses administrator untuk "${email}"?`,
                            targetName: email,
                          });
                        }}
                        className="text-rose-600 hover:text-rose-800 font-sans font-semibold hover:underline cursor-pointer"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL EDIT/TAMBAH BERITA (DENGAN UPLOAD FOTO & PREVIEW & STEP LOADING) --- */}
      {isNewsModalOpen && editingNews && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E6DFD3] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E6DFD3] pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  {editingNews.id ? 'Edit Berita Literasi' : 'Tulis Berita Baru'}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5 font-sans">
                  {editingNews.id ? `Memperbarui dokumen ID: ${editingNews.id}` : 'Menerbitkan artikel baru ke website'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!isSubmittingNews) setIsNewsModalOpen(false);
                }}
                disabled={isSubmittingNews}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {newsFormError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{newsFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveNews} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Judul Berita *</label>
                <input
                  type="text"
                  required
                  value={editingNews.title}
                  onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                  placeholder="Contoh: Kunjungan Rutin Pojok Baca Kelas VII..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Kategori</label>
                  <select
                    value={editingNews.category}
                    onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                  >
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Pengumuman">Pengumuman</option>
                    <option value="Literasi">Literasi</option>
                    <option value="Resensi Buku">Resensi Buku</option>
                    <option value="Prestasi">Prestasi</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Tanggal Terbit</label>
                  <input
                    type="text"
                    value={editingNews.date}
                    onChange={(e) => setEditingNews({ ...editingNews, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Cuplikan Ringkas (Excerpt) *</label>
                <textarea
                  rows={2}
                  required
                  value={editingNews.excerpt}
                  onChange={(e) => setEditingNews({ ...editingNews, excerpt: e.target.value })}
                  placeholder="Ringkasan 1-2 kalimat untuk kartu berita di beranda..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">
                  Isi Berita Lengkap * (Gunakan dua kali Enter untuk paragraf baru)
                </label>
                <textarea
                  rows={6}
                  required
                  value={Array.isArray(editingNews.content) ? editingNews.content.join('\n\n') : editingNews.content}
                  onChange={(e) =>
                    setEditingNews({
                      ...editingNews,
                      content: e.target.value.split('\n\n').filter(Boolean),
                    })
                  }
                  placeholder="Tuliskan isi berita atau dokumentasi kegiatan secara lengkap..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900 font-sans focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                />
              </div>

              {/* SECTION: FOTO SAMPUL (DENGAN INPUT FILE, KOMPRESI BROWSER, PREVIEW, GANTI & HAPUS) */}
              <div className="space-y-2.5 pt-2 border-t border-[#E6DFD3]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-800">
                    Foto Sampul Berita (JPG, PNG, atau WebP)
                  </label>
                  <span className="text-[11px] text-stone-500 font-sans">
                    Otomatis dikompres &lt; 300 KB di browser
                  </span>
                </div>

                {/* Error jika file bukan gambar */}
                {newsImageError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                    <span>{newsImageError}</span>
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  ref={newsFileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handleNewsFileSelect}
                  className="hidden"
                />

                {/* Jika sudah ada foto (baik preview file baru maupun imageUrl tersimpan) */}
                {newsImagePreview ? (
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E6DFD3] flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full sm:w-36 h-24 rounded-xl overflow-hidden bg-stone-100 border border-[#E6DFD3] shrink-0">
                      <img
                        src={newsImagePreview}
                        alt="Preview Foto Sampul"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-1.5 text-left w-full">
                      <div className="flex items-center gap-2">
                        {newsImageFile ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-semibold">
                            <Sparkles className="w-3 h-3" /> Foto Baru Terpilih ({(newsImageFile.size / 1024).toFixed(0)} KB)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                            <Check className="w-3 h-3" /> Foto Sampul Aktif
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-1">
                        {newsImageFile ? newsImageFile.name : 'Gambar sampul terpasang pada dokumen berita.'}
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => newsFileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg border border-[#E6DFD3] bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
                          <span>Ganti Foto</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleRemoveNewsPhoto}
                          className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus Foto</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Area Pilih Foto jika belum ada */
                  <div
                    onClick={() => newsFileInputRef.current?.click()}
                    className="p-6 rounded-2xl border-2 border-dashed border-[#E6DFD3] hover:border-[#1B4332] bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] transition-colors cursor-pointer text-center space-y-2 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#E6DFD3] group-hover:border-[#1B4332] text-[#1B4332] flex items-center justify-center mx-auto shadow-2xs">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-stone-800">
                        Klik untuk Memilih Foto Sampul (JPG, PNG, atau WebP)
                      </p>
                      <p className="text-[11px] text-stone-500 font-sans">
                        Lebar maksimal 1280 px, kompresi otomatis ke &lt; 300 KB.
                      </p>
                    </div>
                  </div>
                )}

                {/* Info sistem cadangan */}
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6DFD3] text-[11px] text-stone-600 flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#1B4332] shrink-0" />
                  <span>
                    Prioritas diunggah ke Firebase Storage. Bila Storage belum aktif, sistem otomatis menyimpan foto sebagai cadangan Base64 (&lt; 200 KB) di dokumen Firestore.
                  </span>
                </div>
              </div>

              {/* Status indikator saat upload */}
              {isSubmittingNews && newsUploadStatus && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600 shrink-0" />
                  <span className="font-medium">{newsUploadStatus}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E6DFD3]">
                <button
                  type="button"
                  disabled={isSubmittingNews}
                  onClick={() => setIsNewsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E6DFD3] text-xs font-semibold text-stone-600 hover:bg-stone-50 cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNews}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B4332] text-white text-xs font-semibold hover:bg-[#143527] transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isSubmittingNews && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isSubmittingNews ? 'Menyimpan...' : editingNews.id ? 'Simpan Pembaruan' : 'Terbitkan Berita'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL EDIT/TAMBAH SOP --- */}
      {isSOPModalOpen && editingSOP && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E6DFD3] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E6DFD3] pb-4">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                {editingSOP.id ? 'Edit Dokumen SOP' : 'Tambah SOP Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsSOPModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setActionLoading(true);
                try {
                  if (editingSOP.id) {
                    await updateSOP(editingSOP.id, editingSOP);
                    showToast('SOP pelayanan berhasil diperbarui!');
                  } else {
                    const { id, ...dataToSave } = editingSOP;
                    await addSOP(dataToSave);
                    showToast('SOP baru berhasil ditambahkan!');
                  }
                  setIsSOPModalOpen(false);
                } catch (err: any) {
                  console.error('[handleSaveSOP] Error:', err);
                  showToast('Gagal menyimpan SOP: ' + (err.message || 'Terjadi kesalahan.'), 'error');
                } finally {
                  setActionLoading(false);
                }
              }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Judul SOP *</label>
                <input
                  type="text"
                  required
                  value={editingSOP.title}
                  onChange={(e) => setEditingSOP({ ...editingSOP, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Kategori</label>
                  <input
                    type="text"
                    value={editingSOP.category}
                    onChange={(e) => setEditingSOP({ ...editingSOP, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Estimasi Waktu</label>
                  <input
                    type="text"
                    value={editingSOP.processingTime}
                    onChange={(e) => setEditingSOP({ ...editingSOP, processingTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Deskripsi Ringkas</label>
                <textarea
                  rows={2}
                  value={editingSOP.description}
                  onChange={(e) => setEditingSOP({ ...editingSOP, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Sasaran Pemustaka</label>
                <input
                  type="text"
                  value={editingSOP.targetAudience}
                  onChange={(e) => setEditingSOP({ ...editingSOP, targetAudience: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E6DFD3]">
                <button
                  type="button"
                  onClick={() => setIsSOPModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E6DFD3] text-xs font-semibold text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#1B4332] text-white text-xs font-semibold hover:bg-[#143527] transition-colors cursor-pointer"
                >
                  {actionLoading ? 'Menyimpan...' : 'Simpan SOP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL EDIT/TAMBAH STAF (DENGAN KOMPRESI FOTO) --- */}
      {isStaffModalOpen && editingStaff && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E6DFD3] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E6DFD3] pb-4">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                {editingStaff.id ? 'Edit Data Pengelola' : 'Tambah Staf Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsStaffModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    required
                    value={editingStaff.name}
                    onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Jabatan di Perpustakaan *</label>
                  <input
                    type="text"
                    required
                    value={editingStaff.role}
                    onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">NIP (Placeholder '-' jika belum ada)</label>
                  <input
                    type="text"
                    value={editingStaff.nip}
                    onChange={(e) => setEditingStaff({ ...editingStaff, nip: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Pendidikan Terakhir</label>
                  <input
                    type="text"
                    value={editingStaff.education || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, education: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Bio Singkat</label>
                <textarea
                  rows={2}
                  value={editingStaff.bio}
                  onChange={(e) => setEditingStaff({ ...editingStaff, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Uraian Tugas (Pisahkan baris baru)</label>
                <textarea
                  rows={3}
                  value={Array.isArray(editingStaff.tasks) ? editingStaff.tasks.join('\n') : editingStaff.tasks}
                  onChange={(e) =>
                    setEditingStaff({
                      ...editingStaff,
                      tasks: e.target.value.split('\n').filter(Boolean),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900"
                />
              </div>

              {/* Upload Foto Staf dengan Kompres Otomatis */}
              <div className="space-y-2 pt-1 border-t border-[#E6DFD3]">
                <label className="text-xs font-semibold text-stone-700 block">
                  Foto / Avatar (Kompres otomatis &lt; 300 KB)
                </label>

                {staffImageError && (
                  <p className="text-xs text-rose-600">{staffImageError}</p>
                )}

                <input
                  ref={staffFileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handleStaffFileSelect}
                  className="hidden"
                />

                <div className="flex items-center gap-4">
                  {staffImagePreview ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={staffImagePreview}
                        alt="Preview Avatar"
                        className="w-14 h-14 object-cover rounded-xl border border-[#E6DFD3]"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => staffFileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg border border-[#E6DFD3] text-xs font-semibold text-stone-700 hover:bg-stone-50"
                        >
                          Ganti
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveStaffPhoto}
                          className="px-3 py-1.5 rounded-lg border border-rose-200 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => staffFileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] hover:bg-[#F2ECE1] text-xs font-semibold text-stone-700 cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-[#1B4332]" />
                      <span>Pilih Foto Avatar</span>
                    </button>
                  )}
                </div>
              </div>

              {isSubmittingStaff && staffUploadStatus && (
                <p className="text-xs text-emerald-700 font-medium flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> {staffUploadStatus}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E6DFD3]">
                <button
                  type="button"
                  disabled={isSubmittingStaff}
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E6DFD3] text-xs font-semibold text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingStaff}
                  className="px-5 py-2.5 rounded-xl bg-[#1B4332] text-white text-xs font-semibold hover:bg-[#143527] transition-colors cursor-pointer"
                >
                  {isSubmittingStaff ? 'Menyimpan...' : 'Simpan Data Staf'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL KONFIRMASI KHUSUS (PENGGANTI WINDOW.CONFIRM DI DALAM IFRAME) --- */}
      {confirmDialog && confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#E6DFD3] max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                {confirmDialog.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                {confirmDialog.message}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                disabled={isConfirmingAction}
                onClick={() => setConfirmDialog(null)}
                className="px-5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                disabled={isConfirmingAction}
                onClick={handleExecuteConfirmedAction}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
              >
                {isConfirmingAction && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isConfirmingAction ? 'Memproses...' : 'Ya, Lanjutkan'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
