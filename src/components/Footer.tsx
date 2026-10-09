import React from 'react';
import { BookOpen, MapPin, Mail, Phone, ExternalLink, Heart } from 'lucide-react';
import { libraryProfileData, contactInfoData } from '../data/libraryData';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#122D21] text-stone-300 border-t border-[#1B4332] pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          {/* Column 1: Identity & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-emerald-600/30 text-white flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white tracking-tight">
                  {libraryProfileData.name}
                </h3>
                <p className="text-xs text-stone-400">
                  {libraryProfileData.schoolName}
                </p>
              </div>
            </div>
            <p className="font-serif italic text-sm text-emerald-200/90 leading-relaxed pt-1">
              "{libraryProfileData.tagline}"
            </p>
            <p className="text-xs text-stone-400 leading-relaxed">
              Pusat sumber belajar, literasi informasi, dan inovasi pendidikan bagi generasi pembelajar abad ke-21.
            </p>
            <div className="pt-2 text-xs text-stone-400">
              <span className="font-semibold text-emerald-300">NPSN:</span> {libraryProfileData.npsn} · <span className="font-semibold text-emerald-300">{libraryProfileData.accreditation}</span>
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
            </ul>
          </div>

          {/* Column 3: Jam Layanan Pustaka */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-widest border-b border-emerald-900/60 pb-2">
              Jam Operasional
            </h4>
            <div className="space-y-2.5 text-xs text-stone-300">
              <div>
                <p className="font-medium text-white">Senin – Kamis</p>
                <p className="text-stone-400">07.00 – 14.30 WIB</p>
              </div>
              <div>
                <p className="font-medium text-white">Jumat</p>
                <p className="text-stone-400">07.00 – 11.15 WIB</p>
              </div>
              <div>
                <p className="font-medium text-white">Sabtu</p>
                <p className="text-stone-400">07.30 – 13.00 WIB (Klub Literasi)</p>
              </div>
              <div>
                <p className="font-medium text-stone-400">Minggu & Hari Libur</p>
                <p className="text-amber-200/80">Tutup</p>
              </div>
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
                <span>{contactInfoData.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{contactInfoData.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{contactInfoData.email}</span>
              </div>
              <div className="pt-2">
                <a
                  href={`https://wa.me/${contactInfoData.whatsapp}?text=Halo%20Perpustakaan%20Titian%20Ilmu%20SMPN%201%20Tambak`}
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
            © {new Date().getFullYear()} {libraryProfileData.name} — {libraryProfileData.schoolName}. Hak cipta dilindungi.
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
