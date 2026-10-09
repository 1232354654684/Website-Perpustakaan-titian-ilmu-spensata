import React, { useState } from 'react';
import {
  Lock,
  LogOut,
  Save,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
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
  ExternalLink,
  ChevronRight,
  Database,
  X,
} from 'lucide-react';
import { useLibrary, BOOTSTRAP_ADMIN_EMAIL } from '../context/LibraryContext';
import { uploadImageToStorage } from '../lib/firebase';
import { NewsItem, SOPEntry, StaffMember, OperatingHours, ContactInfo, LibraryProfile } from '../types';

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
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // States for Settings Form
  const [profileForm, setProfileForm] = useState<LibraryProfile>(settings);
  const [hoursForm, setHoursForm] = useState<OperatingHours[]>(operatingHours);
  const [contactForm, setContactForm] = useState<ContactInfo>(contactInfo);

  // Sync settings form when settings load from Firestore
  React.useEffect(() => {
    setProfileForm(settings);
    setHoursForm(operatingHours);
    setContactForm(contactInfo);
  }, [settings, operatingHours, contactInfo]);

  // States for News Modal/Editing
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [newsImageFile, setNewsImageFile] = useState<File | null>(null);
  const [newsImagePreview, setNewsImagePreview] = useState<string>('');

  // States for SOP Modal/Editing
  const [editingSOP, setEditingSOP] = useState<SOPEntry | null>(null);
  const [isSOPModalOpen, setIsSOPModalOpen] = useState(false);

  // States for Staff Modal/Editing
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [staffImageFile, setStaffImageFile] = useState<File | null>(null);
  const [staffImagePreview, setStaffImagePreview] = useState<string>('');

  // New Admin email input
  const [newAdminEmail, setNewAdminEmail] = useState('');

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
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

  // --- DASHBOARD ADMIN UTAMA ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await updateSettings(profileForm, hoursForm, contactForm);
      triggerToast('Pengaturan umum perpustakaan berhasil diperbarui!');
    } catch (err: any) {
      alert('Gagal menyimpan pengaturan: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSeedData = async () => {
    if (confirm('Inisialisasi data contoh ke database Firestore? Tindakan ini akan mengisi berita, SOP, dan struktur staf awal.')) {
      setActionLoading(true);
      try {
        await seedInitialDataIfEmpty();
        triggerToast('Data awal berhasil diisi ke Firestore!');
      } catch (err: any) {
        alert('Gagal inisialisasi: ' + err.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1B4332] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in text-xs sm:text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span>{successToast}</span>
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
            onClick={handleSeedData}
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

      {/* Navigation Tabs (Pengaturan, Berita, SOP, Struktur, Admin Emails) */}
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
            <h3 className="font-serif text-xl font-bold text-stone-900 border-b border-[#E6DFD3] pb-3">
              Jadwal Jam Layanan
            </h3>

            <div className="space-y-3">
              {hoursForm.map((slot, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6DFD3]">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600">Hari</label>
                    <input
                      type="text"
                      value={slot.dayRange}
                      onChange={(e) => {
                        const copy = [...hoursForm];
                        copy[idx].dayRange = e.target.value;
                        setHoursForm(copy);
                      }}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg border border-[#E6DFD3] bg-white text-xs text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600">Jam Operasional</label>
                    <input
                      type="text"
                      value={slot.hours}
                      onChange={(e) => {
                        const copy = [...hoursForm];
                        copy[idx].hours = e.target.value;
                        setHoursForm(copy);
                      }}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg border border-[#E6DFD3] bg-white text-xs text-stone-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600">Keterangan / Istirahat</label>
                    <input
                      type="text"
                      value={slot.notes || slot.breakTime || ''}
                      onChange={(e) => {
                        const copy = [...hoursForm];
                        copy[idx].notes = e.target.value;
                        setHoursForm(copy);
                      }}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg border border-[#E6DFD3] bg-white text-xs text-stone-900"
                    />
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
                <label className="text-xs font-semibold text-stone-700">Nomor WhatsApp (contoh: 6281234567890)</label>
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
                <label className="text-xs font-semibold text-stone-700">Tautan Instagram</label>
                <input
                  type="text"
                  value={contactForm.instagram}
                  onChange={(e) => setContactForm({ ...contactForm, instagram: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6DFD3] text-xs text-stone-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Tautan YouTube</label>
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
              <Save className="w-4 h-4" />
              <span>{actionLoading ? 'Menyimpan...' : 'Simpan Seluruh Pengaturan'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: KELOLA BERITA */}
      {activeTab === 'news' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
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
                setIsNewsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B4332] text-white text-xs font-semibold hover:bg-[#143527] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tulis Berita Baru</span>
            </button>
          </div>

          {newsList.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E6DFD3] p-10 text-center space-y-3">
              <p className="text-sm text-stone-600">Belum ada berita yang tersimpan di database.</p>
              <button
                onClick={handleSeedData}
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
                  className="bg-white rounded-2xl border border-[#E6DFD3] p-5 flex flex-col justify-between space-y-4 shadow-2xs"
                >
                  <div className="space-y-3">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-36 object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-full h-24 rounded-xl bg-[#FAF8F5] border border-[#E6DFD3] flex items-center justify-center text-xs text-stone-400">
                        Tanpa Foto Sampul
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-[11px] text-stone-500">
                      <span className="font-semibold text-[#1B4332]">{item.category}</span>
                      <span>·</span>
                      <span>{item.date}</span>
                    </div>
                    <h4 className="font-serif font-bold text-base text-stone-900 line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-stone-600 line-clamp-2">{item.excerpt}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#F2ECE1]">
                    <span className="text-[11px] text-stone-500">{item.author}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingNews(item);
                          setNewsImagePreview(item.imageUrl || '');
                          setNewsImageFile(null);
                          setIsNewsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Edit Berita"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Hapus berita "${item.title}"?`)) {
                            await deleteNews(item.id);
                            triggerToast('Berita berhasil dihapus.');
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors cursor-pointer"
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
          <div className="flex items-center justify-between">
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
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B4332] text-white text-xs font-semibold hover:bg-[#143527] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Dokumen SOP</span>
            </button>
          </div>

          <div className="space-y-3">
            {sopList.map((item, idx) => (
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
                    onClick={async () => {
                      if (confirm(`Hapus SOP "${item.title}"?`)) {
                        await deleteSOP(item.id);
                        triggerToast('SOP berhasil dihapus.');
                      }
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
          <div className="flex items-center justify-between">
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
                setIsStaffModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B4332] text-white text-xs font-semibold hover:bg-[#143527] transition-colors cursor-pointer"
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
                      setIsStaffModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                    title="Edit Staf"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm(`Hapus pengelola "${item.name}"?`)) {
                        await deleteStaff(item.id);
                        triggerToast('Data staf berhasil dihapus.');
                      }
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
                  await addAdminEmail(newAdminEmail);
                  setNewAdminEmail('');
                  triggerToast('Email admin berhasil ditambahkan.');
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
                        onClick={async () => {
                          if (confirm(`Cabut akses admin untuk ${email}?`)) {
                            await removeAdminEmail(email);
                            triggerToast('Akses email admin dicabut.');
                          }
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

      {/* --- MODAL EDIT/TAMBAH BERITA --- */}
      {isNewsModalOpen && editingNews && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E6DFD3] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E6DFD3] pb-4">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                {editingNews.id ? 'Edit Berita Literasi' : 'Tulis Berita Baru'}
              </h3>
              <button
                onClick={() => setIsNewsModalOpen(false)}
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
                  let uploadedUrl = editingNews.imageUrl;
                  if (newsImageFile) {
                    uploadedUrl = await uploadImageToStorage(newsImageFile, 'news_covers');
                  }

                  const payload = {
                    ...editingNews,
                    imageUrl: uploadedUrl,
                  };

                  if (editingNews.id) {
                    await updateNews(editingNews.id, payload);
                    triggerToast('Berita berhasil diperbarui!');
                  } else {
                    const { id, ...dataToSave } = payload;
                    await addNews(dataToSave);
                    triggerToast('Berita baru berhasil diterbitkan!');
                  }
                  setIsNewsModalOpen(false);
                } catch (err: any) {
                  alert('Gagal menyimpan berita: ' + err.message);
                } finally {
                  setActionLoading(false);
                }
              }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Judul Berita *</label>
                <input
                  type="text"
                  required
                  value={editingNews.title}
                  onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Kategori</label>
                  <select
                    value={editingNews.category}
                    onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Isi Berita Lengkap (Pisahkan paragraf dengan baris baru) *</label>
                <textarea
                  rows={6}
                  required
                  value={Array.isArray(editingNews.content) ? editingNews.content.join('\n\n') : editingNews.content}
                  onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value.split('\n\n').filter(Boolean) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900 font-sans"
                />
              </div>

              {/* Upload Foto dengan Kompres Otomatis */}
              <div className="space-y-2 pt-1 border-t border-[#E6DFD3]">
                <label className="text-xs font-semibold text-stone-700 block">
                  Foto Sampul (Otomatis dikompres sebelum diunggah ke Storage)
                </label>
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] hover:bg-[#F2ECE1] text-xs font-semibold text-stone-700 cursor-pointer">
                    <Upload className="w-4 h-4 text-[#1B4332]" />
                    <span>Pilih Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setNewsImageFile(file);
                          setNewsImagePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                  {newsImagePreview && (
                    <img
                      src={newsImagePreview}
                      alt="Preview"
                      className="w-20 h-14 object-cover rounded-lg border border-[#E6DFD3]"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E6DFD3]">
                <button
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E6DFD3] text-xs font-semibold text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#1B4332] text-white text-xs font-semibold hover:bg-[#143527] transition-colors cursor-pointer"
                >
                  {actionLoading ? 'Menyimpan & Mengunggah...' : 'Simpan Berita'}
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
                    triggerToast('SOP berhasil diperbarui!');
                  } else {
                    const { id, ...dataToSave } = editingSOP;
                    await addSOP(dataToSave);
                    triggerToast('SOP baru berhasil ditambahkan!');
                  }
                  setIsSOPModalOpen(false);
                } catch (err: any) {
                  alert('Gagal menyimpan SOP: ' + err.message);
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
                  Simpan SOP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL EDIT/TAMBAH STAF --- */}
      {isStaffModalOpen && editingStaff && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E6DFD3] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E6DFD3] pb-4">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                {editingStaff.id ? 'Edit Data Pengelola' : 'Tambah Staf Baru'}
              </h3>
              <button
                onClick={() => setIsStaffModalOpen(false)}
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
                  let uploadedUrl = editingStaff.avatarUrl;
                  if (staffImageFile) {
                    uploadedUrl = await uploadImageToStorage(staffImageFile, 'staff_avatars');
                  }

                  const payload = {
                    ...editingStaff,
                    avatarUrl: uploadedUrl,
                  };

                  if (editingStaff.id) {
                    await updateStaff(editingStaff.id, payload);
                    triggerToast('Data staf berhasil diperbarui!');
                  } else {
                    const { id, ...dataToSave } = payload;
                    await addStaff(dataToSave);
                    triggerToast('Staf baru berhasil ditambahkan!');
                  }
                  setIsStaffModalOpen(false);
                } catch (err: any) {
                  alert('Gagal menyimpan staf: ' + err.message);
                } finally {
                  setActionLoading(false);
                }
              }}
              className="space-y-4"
            >
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
                  onChange={(e) => setEditingStaff({ ...editingStaff, tasks: e.target.value.split('\n').filter(Boolean) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] text-xs sm:text-sm text-stone-900"
                />
              </div>

              {/* Upload Foto Staf dengan Kompres Otomatis */}
              <div className="space-y-2 pt-1 border-t border-[#E6DFD3]">
                <label className="text-xs font-semibold text-stone-700 block">
                  Foto / Avatar (Kompres otomatis sebelum upload)
                </label>
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] hover:bg-[#F2ECE1] text-xs font-semibold text-stone-700 cursor-pointer">
                    <Upload className="w-4 h-4 text-[#1B4332]" />
                    <span>Pilih Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setStaffImageFile(file);
                          setStaffImagePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                  {staffImagePreview && (
                    <img
                      src={staffImagePreview}
                      alt="Preview"
                      className="w-14 h-14 object-cover rounded-xl border border-[#E6DFD3]"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E6DFD3]">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E6DFD3] text-xs font-semibold text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#1B4332] text-white text-xs font-semibold hover:bg-[#143527] transition-colors cursor-pointer"
                >
                  {actionLoading ? 'Menyimpan...' : 'Simpan Data Staf'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
