import React, { useState } from 'react';
import { BookOpen, Menu, X, Clock, ArrowRight, Shield } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate }) => {
  const { settings, operatingHours, isAdmin } = useLibrary();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showHoursModal, setShowHoursModal] = useState(false);

  const navLinks = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'profil', label: 'Profil' },
    { id: 'berita', label: 'Berita' },
    { id: 'sop', label: 'SOP Pelayanan' },
    { id: 'struktur', label: 'Struktur Organisasi' },
    { id: 'kontak', label: 'Kontak' },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    setShowHoursModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-border)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Zone 1: Brand Wordmark (Single line, display face) */}
          <button
            onClick={() => handleNavClick('beranda')}
            className="flex items-center gap-3 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-lg p-1 shrink-0 cursor-pointer"
          >
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt="Logo Perpustakaan Titian Ilmu"
                className="w-10 h-10 rounded-xl object-contain shadow-xs transition-transform duration-200 group-hover:scale-105"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105">
                <BookOpen className="w-5 h-5 text-white/90" strokeWidth={2} />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold text-[var(--color-text)] tracking-tight leading-tight group-hover:text-[var(--color-primary)] transition-colors whitespace-nowrap">
                {settings.shortName || 'Titian Ilmu'}
              </span>
              <span className="text-[11px] font-sans font-medium text-[var(--color-text-muted)] tracking-wider uppercase whitespace-nowrap">
                {settings.schoolName || 'SMP Negeri 1 Tambak'}
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-[14px] font-medium text-[var(--color-text-muted)]">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-2 whitespace-nowrap transition-colors duration-150 cursor-pointer ${
                    isActive
                      ? 'text-[var(--color-primary)] font-semibold'
                      : 'hover:text-[var(--color-text)]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--color-primary)] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Admin Button */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleNavClick('admin')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                activePage === 'admin'
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                  : 'border-[var(--color-border)] text-[var(--color-text)] bg-[var(--color-surface)] hover:bg-[var(--color-muted)]'
              }`}
              title="Portal Admin"
            >
              <Shield className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>{isAdmin ? 'Dashboard' : 'Admin'}</span>
            </button>

            <button
              onClick={() => setShowHoursModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wide text-white bg-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-dark)] transition-all duration-150 shadow-xs hover:shadow-sm whitespace-nowrap cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-white/80" />
              <span>Jam Layanan</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-[var(--color-text)] hover:bg-[var(--color-muted)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              aria-expanded={mobileMenuOpen}
              aria-label="Buka menu navigasi"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--color-border)] bg-[var(--color-bg)] px-4 pt-3 pb-6 space-y-1 shadow-lg">
          <div className="mb-2 px-3 py-1.5 text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest">
            Navigasi Halaman
          </div>
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--color-primary)] text-white font-semibold'
                    : 'text-[var(--color-text)] hover:bg-[var(--color-muted)]'
                }`}
              >
                <span>{link.label}</span>
                {isActive && <ArrowRight className="w-4 h-4 text-white/80" />}
              </button>
            );
          })}
          <div className="pt-3 border-t border-[var(--color-border)] mt-2 space-y-2">
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[var(--color-text)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-muted)] transition-colors"
            >
              <Shield className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Portal Administrator</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setShowHoursModal(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              <Clock className="w-4 h-4 text-white/80" />
              <span>Cek Jam Layanan (Sabtu & Minggu Tutup)</span>
            </button>
          </div>
        </div>
      )}

      {/* Popup Modal Jam Layanan */}
      {showHoursModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white/90" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[var(--color-text)]">
                    Jadwal Jam Layanan Pemustaka
                  </h3>
                  <p className="text-[11px] text-[var(--color-text-muted)] font-sans">
                    {settings.name} — {settings.schoolName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHoursModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {operatingHours.map((slot, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    slot.isOpen
                      ? 'bg-[var(--color-bg)] border-[var(--color-border)]'
                      : 'bg-[var(--color-muted)]/50 border-[var(--color-border)] text-[var(--color-text-muted)]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[var(--color-text)]">{slot.dayRange}</p>
                    {slot.breakTime && (
                      <p className="text-[11px] text-[var(--color-text-muted)] font-sans">{slot.breakTime}</p>
                    )}
                    {slot.notes && (
                      <p className="text-[10px] text-[var(--color-text-muted)] italic font-sans">{slot.notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1 ${
                        slot.isOpen
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {slot.isOpen ? 'Buka' : 'Tutup'}
                    </span>
                    <p className="font-mono text-xs font-bold text-[var(--color-text)]">{slot.hours}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between">
              <span className="text-[11px] text-[var(--color-text-muted)]">
                Sabtu dan Minggu pelayanan tatap muka tutup.
              </span>
              <button
                type="button"
                onClick={() => handleNavClick('kontak')}
                className="text-xs font-semibold text-[var(--color-primary)] hover:underline cursor-pointer"
              >
                Halaman Kontak & Peta →
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

