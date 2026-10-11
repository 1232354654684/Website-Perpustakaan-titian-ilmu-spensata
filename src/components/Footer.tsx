import React from 'react';
import { BookOpen, MapPin, Mail, Phone, ExternalLink, Heart, Shield } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings, contactInfo, operatingHours } = useLibrary();

  const handleNav = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[var(--color-primary-dark)] text-stone-300 border-t border-[var(--color-primary)] pt-16 pb-12 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          {/* Column 1: Identity & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt="Logo Perpustakaan"
                  className="w-10 h-10 rounded-xl object-contain bg-white/10 p-1 border border-emerald-600/30"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-emerald-600/30 text-white flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-emerald-300" />
                </div>
              )}
              <div>
                <h3 className="font-serif text-lg font-bold text-white tracking-tight">
                  {settings.name}
                </h3>
                <p className="text-xs text-stone-400">
                  {settings.schoolName}
                </p>
              </div>
            </div>
            <p className="font-serif italic text-sm text-emerald-200/90 leading-relaxed pt-1">
              "{settings.tagline}"
            </p>
            <p className="text-xs text-stone-400 leading-relaxed">
              Pusat sumber belajar, literasi informasi, dan inovasi pendidikan bagi generasi pembelajar abad ke-21.
            </p>
            <div className="pt-2 text-xs text-stone-400">
              <span className="font-semibold text-emerald-300">NPSN:</span> {settings.npsn || '-'} · <span className="font-semibold text-emerald-300">Akreditasi:</span> {settings.accreditation || '-'}
            </div>
          </div>

          {/* Column 2: Navigasi Cepat */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-widest border-b border-emerald-900/60 pb-2">
              Jelajahi Pustaka
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleNav('beranda')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('profil')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Profil & Visi Misi
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('berita')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Warta & Kegiatan Literasi
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('sop')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  SOP Pelayanan Sirkulasi
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('struktur')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Struktur Organisasi
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('kontak')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Kontak & Lokasi
                </button>
              </li>
              <li className="pt-2 border-t border-emerald-900/40">
                <button
                  onClick={() => handleNav('admin')}
                  className="text-emerald-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 text-xs font-medium"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Portal Administrator</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Jam Layanan Pustaka */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-widest border-b border-emerald-900/60 pb-2">
              Jam Operasional
            </h4>
            <div className="space-y-2.5 text-xs text-stone-300">
              {operatingHours.slice(0, 4).map((h, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-white">{h.dayRange}</p>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                        h.isOpen ? 'text-emerald-300 bg-emerald-950/60' : 'text-rose-300 bg-rose-950/60'
                      }`}
                    >
                      {h.isOpen ? 'Buka' : 'Tutup'}
                    </span>
                  </div>
                  <p className="text-stone-400 font-mono text-[11px]">{h.hours}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Alamat & Kontak */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-widest border-b border-emerald-900/60 pb-2">
              Sekretariat Pustaka
            </h4>
            <div className="space-y-2.5 text-xs text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{contactInfo.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{contactInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{contactInfo.email}</span>
              </div>
              <div className="pt-2">
                <a
                  href={`https://wa.me/${contactInfo.whatsapp}?text=Halo%20Perpustakaan%20Titian%20Ilmu%20SMPN%201%20Tambak`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-300 hover:text-emerald-200 underline underline-offset-4 transition-colors"
                >
                  <span>Chat WhatsApp Layanan</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Hairline Bottom Bar */}
        <div className="pt-8 border-t border-emerald-950/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>
            © {new Date().getFullYear()} {settings.name} — {settings.schoolName}. Hak cipta dilindungi.
          </p>
          <p className="flex items-center gap-1.5 text-stone-400">
            <span>Dikelola dengan semangat literasi</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 inline" />
            <span>untuk anak bangsa</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
