import React, { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  ChevronDown,
  ChevronUp,
  Download,
  BookOpen,
  Info,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useLibrary } from '../context/LibraryContext';
import { SOPEntry } from '../types';

export const SOP: React.FC = () => {
  const { sopList, loading } = useLibrary();
  const [activeTab, setActiveTab] = useState<string>('');

  const effectiveActiveTab = activeTab || (sopList[0]?.id ?? '');
  const selectedSop = sopList.find((item) => item.id === effectiveActiveTab) || sopList[0];

  if (loading && sopList.length === 0) {
    return (
      <div className="space-y-12">
        <PageHeader
          kicker="Standar Operasional Prosedur"
          title="SOP Pelayanan Perpustakaan"
          description="Memuat pedoman alur layanan resmi Perpustakaan Titian Ilmu SMP Negeri 1 Tambak..."
        />
        <div className="p-12 text-center text-stone-500 font-sans">
          Memuat data SOP layanan...
        </div>
      </div>
    );
  }

  if (sopList.length === 0) {
    return (
      <div className="space-y-12">
        <PageHeader
          kicker="Standar Operasional Prosedur"
          title="SOP Pelayanan Perpustakaan"
          description="Pedoman alur layanan resmi Perpustakaan Titian Ilmu SMP Negeri 1 Tambak guna menjamin kepastian, ketertiban, dan transparansi pelayanan bagi seluruh pemustaka."
        />
        <div className="bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-[var(--color-text-muted)] mx-auto" />
          <h3 className="font-serif text-lg font-bold text-[var(--color-text)]">
            Dokumen SOP Belum Tersedia
          </h3>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] max-w-md mx-auto">
            Prosedur operasional standar sedang dalam tahap pemutakhiran oleh pengelola perpustakaan.
          </p>
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

      {/* Navigation tabs between SOPs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[var(--color-border)]">
        {sopList.map((sop) => {
          const isActive = effectiveActiveTab === sop.id;
          return (
            <button
              key={sop.id}
              onClick={() => setActiveTab(sop.id)}
              className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[var(--color-primary)] text-white shadow-2xs'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)]'
              }`}
            >
              {sop.title}
            </button>
          );
        })}
      </div>

      {/* Selected SOP Detail Card */}
      <div className="bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] p-6 sm:p-10 lg:p-12 shadow-xs space-y-10">
        {/* SOP Title & Overview Banner */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-8 border-b border-[var(--color-border)]">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              {selectedSop.category}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-text)]">
              {selectedSop.title}
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed font-sans">
              {selectedSop.description}
            </p>
          </div>

          <div className="bg-[var(--color-bg)] p-5 rounded-2xl border border-[var(--color-border)] space-y-3 shrink-0 min-w-[240px]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Sasaran Pemustaka
              </p>
              <p className="text-xs font-semibold text-[var(--color-text)]">
                {selectedSop.targetAudience}
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--color-border)]">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Estimasi Waktu Layanan
              </p>
              <p className="text-xs font-bold text-[var(--color-primary)] flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{selectedSop.processingTime}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Persyaratan & Dokumen yang Diperlukan */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[var(--color-primary)]" />
            <span>Persyaratan & Ketentuan Layanan</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {selectedSop.requirements.map((req, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </div>
                <p className="text-xs sm:text-sm text-[var(--color-text)] leading-relaxed">
                  {req}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Alur Tahapan / Langkah-Langkah (Step-by-Step) */}
        <div className="space-y-6">
          <h3 className="font-serif text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[var(--color-primary)]" />
            <span>Alur & Langkah Pelaksanaan</span>
          </h3>

          <div className="space-y-4 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-[var(--color-border)] before:hidden sm:before:block">
            {selectedSop.steps.map((step) => (
              <div
                key={step.stepNumber}
                className="relative sm:pl-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-colors"
              >
                {/* Step Circle for Desktop */}
                <div className="sm:absolute sm:left-2 sm:top-1/2 sm:-translate-y-1/2 w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-mono font-bold text-xs shadow-2xs">
                  {step.stepNumber}
                </div>

                <div className="space-y-1">
                  <h4 className="font-serif text-base sm:text-lg font-bold text-[var(--color-text)]">
                    Langkah {step.stepNumber}: {step.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed font-sans">
                    {step.description}
                  </p>
                </div>

                {step.duration && (
                  <div className="shrink-0 self-start sm:self-center px-3 py-1 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[11px] font-mono text-[var(--color-text-muted)]">
                    ⏱ {step.duration}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Catatan Khusus / Ketentuan Tambahan */}
        {selectedSop.notes && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-stone-800 flex items-start gap-3.5">
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed">
              <span className="font-bold text-amber-900">Catatan Penting: </span>
              <span>{selectedSop.notes}</span>
            </div>
          </div>
        )}
      </div>

      {/* Card Info Bantuan Konsultasi */}
      <div className="bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border)] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-serif text-lg font-bold text-[var(--color-text)]">
            Perlu Bantuan atau Mengalami Kendala Layanan?
          </h4>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">
            Petugas meja sirkulasi Titian Ilmu siap membantu penelusuran buku dan administrasi perpustakaan Anda setiap jam kerja.
          </p>
        </div>
        <a
          href="https://wa.me/6281234567890?text=Halo%20Admin%20Perpustakaan%20Titian%20Ilmu%20SMPN%201%20Tambak,%20saya%20ingin%20bertanya%20mengenai%20layanan"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-xs font-semibold hover:bg-[var(--color-primary-dark)] transition-colors shrink-0 shadow-xs"
        >
          Hubungi Petugas Piket
        </a>
      </div>
    </div>
  );
};
