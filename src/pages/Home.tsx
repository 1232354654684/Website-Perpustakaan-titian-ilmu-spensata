import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Compass,
  FileText,
  MapPin,
  Sparkles,
  Users,
  CheckCircle2,
  BookmarkCheck,
  ChevronRight,
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { NewsItem } from '../types';
import { VisualFallback } from '../components/VisualFallback';

interface HomeProps {
  onNavigate: (page: string, articleId?: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { settings, operatingHours, newsList, loading } = useLibrary();
  const latestNews = newsList.slice(0, 3);
  const homeStats = settings.homeStats || [];

  const highlights = [
    {
      title: 'Koleksi Variatif & Terbuka',
      desc: 'Buku fiksi berkualitas, novel remaja, ensiklopedia sains, serta modul tematik kurikulum terbaru.',
      icon: BookOpen,
    },
    {
      title: 'Ruang Baca Asri & Tenang',
      desc: 'Area baca berpenyejuk udara, meja diskusi kelompok, serta selasar hijau lesehan di taman sekolah.',
      icon: Sparkles,
    },
    {
      title: 'Katalog Otomasi Terpadu',
      desc: 'Pencarian judul buku secara instan melalui sistem katalog digital untuk kemudahan belajar mandiri.',
      icon: Compass,
    },
    {
      title: 'Gerakan Literasi Sekolah',
      desc: 'Program Jumat Literasi, apresiasi pembaca teladan bulanan, dan komunitas duta baca.',
      icon: BookmarkCheck,
    },
  ];

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="pt-4 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                <span>{settings.schoolName}</span>
              </div>

              <div className="space-y-3">
                <h1 className="font-serif text-3xl sm:text-4.5xl lg:text-5xl font-bold text-[var(--color-text)] tracking-tight leading-[1.18] text-balance">
                  {settings.name}
                </h1>
                <p className="font-serif italic text-lg sm:text-2xl text-[var(--color-primary)] font-medium leading-relaxed">
                  "{settings.tagline}"
                </p>
              </div>

              <p className="text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed max-w-2xl font-sans">
                Selamat datang di pusat sumber belajar resmi {settings.schoolName}.
                Kami hadir menjembatani rasa ingin tahu para siswa dengan jendela
                ilmu pengetahuan melalui koleksi pustaka terkurasi, suasana yang asri,
                dan layanan yang ramah.
              </p>

              {/* CTAs */}
              <div className="pt-1 flex flex-wrap items-center gap-3.5">
                <button
                  onClick={() => onNavigate('berita')}
                  className="inline-flex items-center gap-2.5 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-[var(--color-primary)] rounded-xl hover:bg-[var(--color-primary-dark)] transition-all duration-150 shadow-xs hover:shadow-sm cursor-pointer"
                >
                  <span>Lihat Berita & Kegiatan</span>
                  <ArrowRight className="w-4 h-4 text-white/80" />
                </button>
                <button
                  onClick={() => onNavigate('profil')}
                  className="inline-flex items-center gap-2 px-4.5 py-3 text-xs sm:text-sm font-semibold text-[var(--color-text)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl hover:bg-[var(--color-muted)] transition-colors cursor-pointer"
                >
                  <span>Tentang Kami</span>
                </button>
              </div>
            </div>

            {/* Micro Trust Indicators with neutral placeholders */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-[var(--color-text-muted)] font-sans border-t border-[var(--color-border)]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)]" />
                <span>NPSN: {settings.npsn || '-'}</span>
              </div>
              <span className="text-stone-300">·</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)]" />
                <span>Akreditasi: {settings.accreditation || '-'}</span>
              </div>
              <span className="text-stone-300">·</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                <span>Kecamatan Tambak, Banyumas</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual */}
          <div className="lg:col-span-5 flex flex-col justify-stretch">
            <VisualFallback type="hero" className="w-full h-full" aspectRatio="auto" />
          </div>
        </div>
      </section>

      {/* Operational Hours Ribbon (Info Jam Layanan) */}
      <section className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[var(--color-text)]">
                Informasi Jam Layanan Pemustaka
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                {operatingHours.filter((h) => h.isOpen).map((h) => h.dayRange).join(', ') || 'Senin – Jumat'} · Sabtu, Minggu, dan libur sekolah tutup.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('sop')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors self-start md:self-auto cursor-pointer"
          >
            <span>Panduan SOP Peminjaman</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          {operatingHours.map((slot, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border transition-colors ${
                slot.isOpen
                  ? 'bg-[var(--color-bg)] border-[var(--color-border)]'
                  : 'bg-[var(--color-muted)]/40 border-[var(--color-border)]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wide">
                  {slot.dayRange}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    slot.isOpen
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {slot.isOpen ? 'Buka' : 'Tutup'}
                </span>
              </div>
              <p className="font-mono text-base font-bold text-[var(--color-text)]">
                {slot.hours}
              </p>
              {slot.breakTime && (
                <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                  {slot.breakTime}
                </p>
              )}
              {slot.notes && (
                <p className="text-[11px] text-[var(--color-text-muted)] mt-1 italic">
                  {slot.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Ringkasan Singkat Profil & Nilai Keunggulan */}
      <section className="space-y-12">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-widest mb-2">
            Mengenal Lebih Dekat
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--color-text)] tracking-tight leading-snug">
            Jembatan Literasi untuk Masa Depan Siswa
          </h2>
          <p className="mt-4 text-base text-[var(--color-text-muted)] leading-relaxed font-sans">
            {settings.about}
          </p>
        </div>

        {/* 4 Feature Points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all duration-200 shadow-2xs group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-primary)] flex items-center justify-center mb-5 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-200">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[var(--color-text)] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => onNavigate('profil')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] underline underline-offset-8 transition-colors cursor-pointer"
          >
            <span>Pelajari Sejarah Lengkap, Visi & Misi Titian Ilmu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Statistik Perpustakaan (Tabular Rigor) - Hanya tampil jika ada data */}
      {homeStats.length > 0 && (
        <section className="bg-[var(--color-bg)] border-y border-[var(--color-border)] py-12">
          <div
            className={`grid grid-cols-2 ${
              homeStats.length === 1
                ? 'lg:grid-cols-1 max-w-xs mx-auto'
                : homeStats.length === 2
                ? 'lg:grid-cols-2 max-w-xl mx-auto'
                : homeStats.length === 3
                ? 'lg:grid-cols-3 max-w-4xl mx-auto'
                : 'lg:grid-cols-4'
            } gap-8 text-center`}
          >
            {homeStats.map((s) => (
              <div key={s.id} className="space-y-1">
                <p className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-primary)] tracking-tight tabular-nums">
                  {s.value}{s.suffix || ''}
                </p>
                <p className="text-xs uppercase tracking-wider font-semibold text-[var(--color-text)]">
                  {s.label}
                </p>
                {s.unit && (
                  <p className="text-[11px] text-[var(--color-text-muted)] font-sans">
                    {s.unit}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3 Berita & Kegiatan Terbaru */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-widest mb-1">
              Kabar Terbaru
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--color-text)] tracking-tight">
              Warta & Kegiatan Literasi
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-2">
              Informasi terkini seputar dunia pustaka, karya pemustaka, dan program membaca sekolah.
            </p>
          </div>
          <button
            onClick={() => onNavigate('berita')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] self-start sm:self-auto cursor-pointer"
          >
            <span>Semua Berita</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {latestNews.length === 0 ? (
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-10 text-center space-y-2">
            <p className="font-serif font-bold text-[var(--color-text)]">Belum Ada Warta Literasi Terbaru</p>
            <p className="text-xs text-[var(--color-text-muted)]">Warta kegiatan membaca dan kabar perpustakaan akan segera dipublikasikan di sini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestNews.map((news, idx) => {
              const visualTypes: ('reading-club' | 'book-collection' | 'digital-library')[] = [
                'reading-club',
                'book-collection',
                'digital-library',
              ];
              const vType = visualTypes[idx % visualTypes.length];

              return (
                <article
                  key={news.id}
                  onClick={() => onNavigate('berita', news.id)}
                  className="group bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="p-3">
                      {news.imageUrl ? (
                        <img
                          src={news.imageUrl}
                          alt={news.title}
                          className="w-full h-44 object-cover rounded-xl"
                        />
                      ) : (
                        <VisualFallback type={vType} title={news.title} aspectRatio="video" />
                      )}
                    </div>
                    <div className="p-5 pt-2 space-y-3">
                      {/* Unboxed metadata per constitution */}
                      <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] font-sans">
                        <span className="font-semibold text-[var(--color-primary)]">{news.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 inline text-stone-400" />
                          <span>{news.date}</span>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{news.readTime}</span>
                      </div>

                      <h3 className="font-serif text-lg font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors leading-snug line-clamp-2">
                        {news.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed line-clamp-3">
                        {news.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-[var(--color-border)] text-xs">
                    <span className="text-[var(--color-text-muted)]">{news.author}</span>
                    <span className="font-semibold text-[var(--color-primary)] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      <span>Baca</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Call to Action: Kunjungan & Menjadi Pembaca Aktif */}
      <section className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white rounded-3xl p-8 sm:p-12 lg:p-14 shadow-md relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <BookOpen className="w-96 h-96 text-white" />
        </div>
        <div className="max-w-2xl relative z-10 space-y-5">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-emerald-100 text-xs font-medium uppercase tracking-wider">
            Budaya Literasi Sekolah
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
            "Buku adalah sahabat sejati yang tak pernah lelah berbagi kebijaksanaan."
          </h2>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed">
            Ayo luangkan waktu membaca setiap hari dan ikuti program Jumat Literasi. Kunjungi Perpustakaan Titian Ilmu, pinjam buku kegemaranmu, dan raih prestasi gemilang bersama kami.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('sop')}
              className="px-5 py-3 rounded-xl bg-white text-[var(--color-primary)] font-semibold text-xs sm:text-sm hover:bg-white/90 transition-colors shadow-xs cursor-pointer"
            >
              Lihat Prosedur Peminjaman
            </button>
            <button
              onClick={() => onNavigate('kontak')}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/20 transition-colors cursor-pointer"
            >
              Lokasi & Jam Buka
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
