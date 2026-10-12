import React, { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Info,
  ExternalLink,
  Search,
  Calendar,
  Monitor,
  ShieldAlert,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useLibrary } from '../context/LibraryContext';
import { SOPEntry } from '../types';

export const SOP: React.FC = () => {
  const { sopList, settings, operatingHours, loading } = useLibrary();

  // Accordion state: simpan array ID SOP yang sedang terbuka. Defaultnya buka SOP 1 & 3 atau semua
  const [openAccordionIds, setOpenAccordionIds] = useState<string[]>(() => {
    return sopList.length > 0 ? [sopList[0].id] : ['sop-1-tata-tertib'];
  });

  const toggleAccordion = (id: string) => {
    setOpenAccordionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExpandAll = () => {
    setOpenAccordionIds(sopList.map((s) => s.id));
  };

  const handleCollapseAll = () => {
    setOpenAccordionIds([]);
  };

  const classSchedules = settings.classSchedules && settings.classSchedules.length > 0
    ? settings.classSchedules
    : [
        { id: 'sch-1', day: 'Senin', borrowClass: 'Kelas IX', returnClass: '-', notes: 'Layanan peminjaman terjadwal' },
        { id: 'sch-2', day: 'Selasa', borrowClass: 'Kelas VIII', returnClass: '-', notes: 'Layanan peminjaman terjadwal' },
        { id: 'sch-3', day: 'Rabu', borrowClass: 'Kelas VII', returnClass: 'Kelas IX', notes: 'Peminjaman Kelas VII & Pengembalian Kelas IX' },
        { id: 'sch-4', day: 'Kamis', borrowClass: '-', returnClass: 'Kelas VIII', notes: 'Layanan pengembalian terjadwal' },
        { id: 'sch-5', day: 'Jumat', borrowClass: '-', returnClass: 'Kelas VII', notes: 'Layanan pengembalian terjadwal' },
      ];

  const multimedia = settings.multimediaInfo || {
    name: 'Ruang Multimedia',
    schedule: 'Senin–Kamis 07.30–14.30, Jumat 07.30–10.55',
    facilities: ['Komputer', 'Internet', 'Akses E-Book'],
    durationLimit: 'Maksimal 1 jam per murid (dapat diperpanjang jika perangkat tersedia)',
    rules: 'Digunakan semua mata pelajaran sesuai jadwal masing-masing.'
  };

  if (loading && sopList.length === 0) {
    return (
      <div className="space-y-12">
        <PageHeader
          kicker="Standar Operasional Prosedur"
          title="SOP Pelayanan Perpustakaan"
          description="Memuat pedoman alur layanan resmi Perpustakaan Titian Ilmu SMP Negeri 1 Tambak..."
        />
        <div className="p-12 text-center text-[var(--color-text-muted)] font-sans">
          Memuat data SOP layanan...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <PageHeader
        kicker="Standar Operasional Prosedur"
        title="SOP Pelayanan Perpustakaan"
        description="Pedoman alur layanan resmi Perpustakaan Titian Ilmu SMP Negeri 1 Tambak guna menjamin kepastian, ketertiban, dan transparansi pelayanan bagi seluruh pemustaka."
      />

      {/* Hero Banner: Tombol OPAC Katalog Online & Quick Summary */}
      <section className="bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] p-6 sm:p-8 lg:p-10 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center lg:text-left max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] text-xs font-semibold">
            <Search className="w-3.5 h-3.5" />
            <span>Katalog Otomasi Inlislite V3</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-text)]">
            Cari & Reservasi Buku Secara Mandiri
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed font-sans">
            Temukan judul buku, pengarang, nomor rak, serta ketersediaan stok bahan pustaka secara real-time melalui sistem OPAC Perpustakaan Titian Ilmu.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
          <a
            href="https://inlislite.spensata.sch.id/inlislite3/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[var(--color-primary)] text-white text-xs sm:text-sm font-bold hover:bg-[var(--color-primary-dark)] transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Cari Buku di Katalog Online (OPAC)</span>
            <ExternalLink className="w-4 h-4 ml-0.5 opacity-80" />
          </a>
        </div>
      </section>

      {/* Bagian: JADWAL PEMINJAMAN DAN PENGEMBALIAN PER KELAS */}
      <section className="bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] p-6 sm:p-8 lg:p-10 shadow-xs space-y-6">
        <div className="pb-4 border-b border-[var(--color-border)]">
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            Jadwal Sirkulasi Terstruktur
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--color-text)] mt-1 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
            <span>Jadwal Peminjaman & Pengembalian per Kelas</span>
          </h3>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1 font-sans">
            Pengaturan jadwal sirkulasi kolektif per jenjang kelas guna mencegah antrean padat dan menjaga ketertiban layanan sirkulasi harian.
          </p>
        </div>

        {/* Tabel Jadwal Per Kelas */}
        <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-left text-xs sm:text-sm font-sans border-collapse">
            <thead>
              <tr className="bg-[var(--color-bg)] text-[var(--color-text)] font-semibold border-b border-[var(--color-border)]">
                <th className="py-3.5 px-4 sm:px-6 w-32">Hari</th>
                <th className="py-3.5 px-4 sm:px-6">Layanan Peminjaman</th>
                <th className="py-3.5 px-4 sm:px-6">Layanan Pengembalian</th>
                <th className="py-3.5 px-4 sm:px-6">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {classSchedules.map((item, idx) => (
                <tr
                  key={item.id || idx}
                  className="hover:bg-[var(--color-bg)]/50 transition-colors"
                >
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-[var(--color-text)] whitespace-nowrap">
                    {item.day}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6">
                    {item.borrowClass && item.borrowClass !== '-' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-semibold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Peminjaman {item.borrowClass}</span>
                      </span>
                    ) : (
                      <span className="text-[var(--color-text-muted)] font-mono">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6">
                    {item.returnClass && item.returnClass !== '-' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/70 font-semibold text-xs">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Pengembalian {item.returnClass}</span>
                      </span>
                    ) : (
                      <span className="text-[var(--color-text-muted)] font-mono">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-xs text-[var(--color-text-muted)]">
                    {item.notes || 'Sesuai jadwal'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bagian: SOP PELAYANAN (ACCORDION BISA DIBUKA-TUTUP) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Dokumen Resmi Pelayanan
            </span>
            <h3 className="font-serif text-2xl font-bold text-[var(--color-text)] mt-1">
              Standar Operasional Prosedur (SOP)
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1 font-sans">
              Klik pada setiap bagian untuk membuka atau menutup rincian pedoman layanan.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleExpandAll}
              className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-bg)] text-xs font-semibold transition-colors cursor-pointer"
            >
              Buka Semua
            </button>
            <button
              onClick={handleCollapseAll}
              className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)] text-xs font-semibold transition-colors cursor-pointer"
            >
              Tutup Semua
            </button>
          </div>
        </div>

        {/* Daftar Accordion */}
        <div className="space-y-4">
          {sopList.map((sop, idx) => {
            const isOpen = openAccordionIds.includes(sop.id);
            const isSanctionSop =
              sop.id === 'sop-5-pelanggaran-sanksi' ||
              sop.title.toLowerCase().includes('sanksi') ||
              Boolean(sop.sanctions && sop.sanctions.length > 0);

            return (
              <div
                key={sop.id || idx}
                className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-2xs transition-all"
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(sop.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-start sm:items-center justify-between gap-4 hover:bg-[var(--color-bg)]/40 transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 font-mono font-bold text-xs sm:text-sm transition-colors ${
                        isOpen
                          ? 'bg-[var(--color-primary)] text-white shadow-xs'
                          : 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <span className="text-[10px] sm:text-[11px] font-semibold text-[var(--color-primary)] uppercase tracking-wider block">
                        {sop.category}
                      </span>
                      <h4 className="font-serif text-base sm:text-lg font-bold text-[var(--color-text)]">
                        {sop.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden md:inline-block text-[11px] text-[var(--color-text-muted)] font-mono">
                      {sop.processingTime}
                    </span>
                    <div className="p-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] bg-[var(--color-bg)]">
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[var(--color-primary)]" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Accordion Body */}
                {isOpen && (
                  <div className="p-5 sm:p-6 lg:p-8 border-t border-[var(--color-border)] bg-[var(--color-surface)] space-y-6 animate-in fade-in duration-200">
                    {/* Ringkasan & Sasaran */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)]">
                      <p className="text-xs sm:text-sm text-[var(--color-text)] leading-relaxed font-sans">
                        {sop.description}
                      </p>
                      <div className="text-xs shrink-0 flex items-center gap-2 text-[var(--color-text-muted)]">
                        <Users className="w-4 h-4 text-[var(--color-primary)]" />
                        <span>Sasaran: <strong className="text-[var(--color-text)]">{sop.targetAudience}</strong></span>
                      </div>
                    </div>

                    {/* Jika SOP nomor 5 (Pelanggaran dan Sanksi) memiliki tabel sanksi */}
                    {isSanctionSop && sop.sanctions && sop.sanctions.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-rose-600" />
                          <h5 className="font-serif font-bold text-sm sm:text-base text-[var(--color-text)]">
                            Tabel Ketentuan Pelanggaran dan Sanksi Resmi
                          </h5>
                        </div>
                        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
                          <table className="w-full text-left text-xs sm:text-sm border-collapse">
                            <thead>
                              <tr className="bg-[var(--color-bg)] text-[var(--color-text)] font-semibold border-b border-[var(--color-border)]">
                                <th className="py-3 px-4 w-12 text-center">No</th>
                                <th className="py-3 px-4 sm:w-1/2">Jenis Pelanggaran</th>
                                <th className="py-3 px-4">Ketentuan Sanksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)]">
                              {sop.sanctions.map((s, sIdx) => (
                                <tr key={sIdx} className="hover:bg-[var(--color-bg)]/40 transition-colors">
                                  <td className="py-3 px-4 text-center font-mono text-[var(--color-text-muted)]">
                                    {sIdx + 1}
                                  </td>
                                  <td className="py-3 px-4 font-medium text-[var(--color-text)]">
                                    {s.violation}
                                  </td>
                                  <td className="py-3 px-4 font-semibold text-rose-700 bg-rose-50/50">
                                    {s.sanction}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Ketentuan / Butir Persyaratan (Jika bukan sanksi) */}
                    {sop.requirements && sop.requirements.length > 0 && (
                      <div className="space-y-3">
                        <h5 className="font-serif font-bold text-sm sm:text-base text-[var(--color-text)] flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)]" />
                          <span>Butir Ketentuan & Tata Tertib:</span>
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {sop.requirements.map((req, rIdx) => (
                            <div
                              key={rIdx}
                              className="p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] flex items-start gap-2.5 text-xs sm:text-sm text-[var(--color-text)]"
                            >
                              <span className="w-5 h-5 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                                ✓
                              </span>
                              <span className="leading-relaxed">{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Alur Langkah-Langkah (Step by Step) */}
                    {sop.steps && sop.steps.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <h5 className="font-serif font-bold text-sm sm:text-base text-[var(--color-text)] flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
                          <span>Tahapan Pelaksanaan:</span>
                        </h5>
                        <div className="space-y-2.5">
                          {sop.steps.map((st) => (
                            <div
                              key={st.stepNumber}
                              className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                            >
                              <div className="flex items-start sm:items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                                  {st.stepNumber}
                                </span>
                                <div>
                                  <h6 className="font-bold text-xs sm:text-sm text-[var(--color-text)]">
                                    {st.title}
                                  </h6>
                                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5 font-sans leading-relaxed">
                                    {st.description}
                                  </p>
                                </div>
                              </div>
                              {st.duration && (
                                <span className="text-[11px] font-mono text-[var(--color-text-muted)] px-2.5 py-1 rounded-md bg-[var(--color-bg)] border border-[var(--color-border)] shrink-0 self-start sm:self-center">
                                  ⏱ {st.duration}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tombol khusus di SOP Peminjaman (OPAC CTA) */}
                    {(sop.id === 'sop-3-tata-cara-peminjaman' || sop.title.toLowerCase().includes('peminjaman')) && (
                      <div className="p-4 rounded-xl bg-[var(--color-primary-soft)] border border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="text-center sm:text-left">
                          <p className="text-xs font-bold text-[var(--color-primary)]">
                            Ingin mencari buku sebelum datang ke perpustakaan?
                          </p>
                          <p className="text-[11px] text-[var(--color-text-muted)]">
                            Gunakan katalog digital OPAC Inlislite untuk mengecek nomor panggil & ketersediaan stok.
                          </p>
                        </div>
                        <a
                          href="https://inlislite.spensata.sch.id/inlislite3/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-xs font-bold hover:bg-[var(--color-primary-dark)] transition-colors inline-flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
                        >
                          <Search className="w-3.5 h-3.5" />
                          <span>Cari di OPAC Inlislite</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {/* Catatan Penting */}
                    {sop.notes && (
                      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-stone-800 text-xs flex items-start gap-2.5">
                        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                          <strong className="text-amber-900">Catatan Khusus: </strong>
                          {sop.notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bagian: JAM LAYANAN & RUANG MULTIMEDIA (Satu Sumber Data dengan Beranda, Kontak, dan Footer) */}
      <section className="bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] p-6 sm:p-8 lg:p-10 shadow-xs space-y-6">
        <div className="border-b border-[var(--color-border)] pb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            Waktu Pelayanan Terintegrasi
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--color-text)] mt-1 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--color-primary)]" />
            <span>Jam Layanan Pustaka & Fasilitas Ruang Multimedia</span>
          </h3>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1 font-sans">
            Data jam layanan ini bersumber dari basis data yang sama dengan beranda, halaman kontak, dan footer website.
          </p>
        </div>

        {/* Grid Jam Layanan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {operatingHours.map((slot, sIdx) => (
            <div
              key={sIdx}
              className={`p-4 rounded-2xl border transition-all ${
                slot.isOpen
                  ? 'bg-[var(--color-bg)] border-[var(--color-border)]'
                  : 'bg-[var(--color-muted)]/30 border-[var(--color-border)]'
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
              {slot.notes && (
                <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5 leading-snug">
                  {slot.notes}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Detail Ruang Multimedia */}
        <div className="p-5 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[var(--color-primary)]">
              <Monitor className="w-4 h-4" />
              <h4 className="font-serif font-bold text-sm sm:text-base text-[var(--color-text)]">
                {multimedia.name}
              </h4>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] font-sans">
              <strong>Jadwal:</strong> {multimedia.schedule} · <strong>Fasilitas:</strong> {multimedia.facilities.join(', ')}.
            </p>
            <p className="text-[11px] text-[var(--color-text-muted)] font-sans">
              {multimedia.durationLimit} · {multimedia.rules}
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text)] self-start md:self-auto shrink-0">
            Terbuka untuk Semua Mapel
          </span>
        </div>
      </section>
    </div>
  );
};
