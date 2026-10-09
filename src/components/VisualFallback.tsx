import React from 'react';
import { BookOpen, Users, Compass, Laptop, Award, ShieldCheck, Sparkles } from 'lucide-react';

interface VisualFallbackProps {
  type: 'hero' | 'reading-club' | 'book-collection' | 'digital-library' | 'staff' | 'general';
  title?: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'portrait' | 'auto';
}

export const VisualFallback: React.FC<VisualFallbackProps> = ({
  type,
  title,
  className = '',
  aspectRatio = 'video',
}) => {
  const aspectClass =
    aspectRatio === 'video'
      ? 'aspect-16/9'
      : aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'portrait'
      ? 'aspect-3/4'
      : '';

  if (type === 'hero') {
    return (
      <div
        className={`relative w-full min-h-[380px] sm:min-h-[420px] h-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#1B4332] via-[#22573F] to-[#143527] text-white p-6 sm:p-8 lg:p-9 flex flex-col justify-between shadow-md ${className}`}
      >
        {/* Subtle decorative geometry (clean, architectural) */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -right-12 -bottom-12 w-72 h-72 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -top-12 w-72 h-72 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        {/* Top Bar: Clean Badge and Location, wraps gracefully on narrow viewports */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-emerald-100">
            <BookOpen className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span>Pusat Literasi Siswa</span>
          </div>
          <span className="text-[11px] font-sans tracking-wide text-emerald-200/90 font-medium">
            Kec. Tambak, Banyumas
          </span>
        </div>

        {/* Middle Content: Ample vertical space, no truncation */}
        <div className="relative z-10 my-4 sm:my-6 space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold leading-snug text-white">
            Ruang Teduh untuk Menjelajah Dunia Lewat Buku
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-sans max-w-md">
            Menyediakan lebih dari 8.000 bahan pustaka terkurasi, ruang baca berpenyejuk udara, otomasi katalog pencarian judul, serta selasar hijau ramah anak.
          </p>
        </div>

        {/* Bottom Bar: Resilient 3-item grid that wraps seamlessly */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/15 text-xs text-emerald-200/90">
          <div className="space-y-0.5">
            <span className="block font-bold text-white tabular-nums text-sm sm:text-base">
              8.450+
            </span>
            <span className="text-[11px] text-emerald-200/80">Koleksi Buku</span>
          </div>
          <div className="space-y-0.5">
            <span className="block font-bold text-white tabular-nums text-sm sm:text-base">
              780+
            </span>
            <span className="text-[11px] text-emerald-200/80">Anggota Aktif</span>
          </div>
          <div className="col-span-2 sm:col-span-1 space-y-0.5">
            <span className="block font-bold text-white text-sm sm:text-base">
              Senin – Sabtu
            </span>
            <span className="text-[11px] text-emerald-200/80">Jam Layanan</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'staff') {
    return (
      <div
        className={`relative w-full ${aspectClass} overflow-hidden rounded-xl bg-[#EDE7DC] flex flex-col items-center justify-center p-6 border border-[#E0D8CA] ${className}`}
      >
        <div className="w-20 h-20 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xl font-serif font-bold shadow-xs mb-3">
          {title ? title.split(' ').map((n) => n[0]).slice(0, 2).join('') : 'TP'}
        </div>
        <span className="text-xs font-medium text-stone-600 text-center line-clamp-1">
          {title || 'Pengelola Perpustakaan'}
        </span>
      </div>
    );
  }

  // News and features fallbacks
  let Icon = BookOpen;
  let bgGradient = 'from-[#F5EFE6] to-[#EAE0D2]';
  let accentColor = 'text-[#1B4332]';
  let badgeLabel = 'Literasi Titian Ilmu';

  if (type === 'reading-club') {
    Icon = Users;
    bgGradient = 'from-[#EAF2ED] to-[#DDEAE1]';
    accentColor = 'text-[#1B4332]';
    badgeLabel = 'Kegiatan Literasi';
  } else if (type === 'book-collection') {
    Icon = BookOpen;
    bgGradient = 'from-[#FDF8EC] to-[#F3EAD5]';
    accentColor = 'text-amber-900';
    badgeLabel = 'Koleksi Pustaka';
  } else if (type === 'digital-library') {
    Icon = Laptop;
    bgGradient = 'from-[#EDF4F8] to-[#DCEAF3]';
    accentColor = 'text-teal-900';
    badgeLabel = 'Layanan Digital';
  }

  return (
    <div
      className={`relative w-full ${aspectClass} overflow-hidden rounded-xl bg-gradient-to-br ${bgGradient} border border-stone-200/80 p-6 flex flex-col justify-between group-hover:scale-[1.01] transition-transform duration-200 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-lg bg-white/90 shadow-2xs flex items-center justify-center">
          <Icon className={`w-4 h-4 ${accentColor}`} />
        </div>
        <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
          {badgeLabel}
        </span>
      </div>

      <div className="my-auto py-4">
        {title && (
          <p className="font-serif font-semibold text-stone-800 text-sm line-clamp-2">
            {title}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-stone-500 pt-3 border-t border-stone-300/40">
        <span>Perpustakaan Titian Ilmu</span>
        <span>SMPN 1 Tambak</span>
      </div>
    </div>
  );
};
