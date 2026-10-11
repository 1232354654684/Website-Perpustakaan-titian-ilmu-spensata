import React from 'react';
import {
  Users,
  ShieldCheck,
  Award,
  GraduationCap,
  Briefcase,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useLibrary } from '../context/LibraryContext';
import { StaffMember } from '../types';
import { VisualFallback } from '../components/VisualFallback';

export const Organization: React.FC = () => {
  const { staffList, loading } = useLibrary();

  const kepalaSekolah = staffList.find((s) => s.role.toLowerCase().includes('kepala sekolah')) || staffList[0];
  const kepalaPerpus = staffList.find((s) => s.role.toLowerCase().includes('kepala perpustakaan')) || staffList[1];
  const otherStaff = staffList.filter((s) => s.id !== kepalaSekolah?.id && s.id !== kepalaPerpus?.id);

  if (loading && staffList.length === 0) {
    return (
      <div className="space-y-16">
        <PageHeader
          kicker="Pengelola & Tata Kelola"
          title="Struktur Organisasi Perpustakaan"
          description="Memuat data pengelola Perpustakaan Titian Ilmu SMP Negeri 1 Tambak..."
        />
        <div className="p-12 text-center text-stone-500 font-sans">
          Memuat struktur organisasi...
        </div>
      </div>
    );
  }

  if (staffList.length === 0) {
    return (
      <div className="space-y-16">
        <PageHeader
          kicker="Pengelola & Tata Kelola"
          title="Struktur Organisasi Perpustakaan"
          description="Jajaran tenaga kependidikan dan pengelola profesional yang berdedikasi menjaga denyut literasi serta mutu pelayanan Perpustakaan Titian Ilmu SMP Negeri 1 Tambak."
        />
        <div className="bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] p-12 text-center space-y-3">
          <Users className="w-10 h-10 text-[var(--color-text-muted)] mx-auto" />
          <h3 className="font-serif text-lg font-bold text-[var(--color-text)]">
            Data Pengelola Belum Ditambahkan
          </h3>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] max-w-md mx-auto">
            Struktur organisasi perpustakaan sedang dalam tahap pemutakhiran data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <PageHeader
        kicker="Pengelola & Tata Kelola"
        title="Struktur Organisasi Perpustakaan"
        description="Jajaran tenaga kependidikan dan pengelola profesional yang berdedikasi menjaga denyut literasi serta mutu pelayanan Perpustakaan Titian Ilmu SMP Negeri 1 Tambak."
      />

      {/* Skema Bagan Organisasi Sederhana & Elegan */}
      <section className="bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] p-8 sm:p-10 shadow-xs space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-widest">
            Bagan Alur Koordinasi
          </span>
          <h2 className="font-serif text-2xl font-bold text-[var(--color-text)]">
            Hierarki Pengelola Pustaka
          </h2>
          <p className="text-xs text-[var(--color-text-muted)]">
            Berdasarkan Surat Keputusan Kepala SMP Negeri 1 Tambak tentang Pengelolaan Perpustakaan Sekolah.
          </p>
        </div>

        {/* Tree Representation */}
        <div className="flex flex-col items-center space-y-6 pt-2">
          {/* Level 1: Kepala Sekolah / Pimpinan Utama */}
          {kepalaSekolah && (
            <div className="p-4 px-6 rounded-2xl bg-[var(--color-primary)] text-white text-center max-w-sm w-full shadow-sm">
              <span className="text-[10px] uppercase tracking-widest text-emerald-200 font-semibold">
                Penanggung Jawab
              </span>
              <p className="font-serif font-bold text-base mt-0.5">
                {kepalaSekolah.role}
              </p>
              <p className="text-xs text-white/90">{kepalaSekolah.name}</p>
            </div>
          )}

          {kepalaPerpus && <div className="w-0.5 h-6 bg-[var(--color-border)]" />}

          {/* Level 2: Kepala Perpustakaan */}
          {kepalaPerpus && (
            <div className="p-4 px-6 rounded-2xl bg-[var(--color-surface)] border-2 border-[var(--color-primary)] text-center max-w-sm w-full shadow-xs">
              <span className="text-[10px] uppercase tracking-widest text-[var(--color-primary)] font-semibold">
                Pimpinan Unit
              </span>
              <p className="font-serif font-bold text-base text-[var(--color-text)] mt-0.5">
                {kepalaPerpus.role}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">{kepalaPerpus.name}</p>
            </div>
          )}

          {otherStaff.length > 0 && <div className="w-0.5 h-6 bg-[var(--color-border)]" />}

          {/* Level 3: Divisi Staf */}
          {otherStaff.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
              {otherStaff.slice(0, 3).map((stf) => (
                <div key={stf.id} className="p-3.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-center">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-bold">
                    {stf.positionCategory || 'Layanan'}
                  </span>
                  <p className="font-serif font-bold text-sm text-[var(--color-text)] mt-1 line-clamp-1">
                    {stf.role}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] line-clamp-1">{stf.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Profil Lengkap Kartu Per Orang */}
      <section className="space-y-8">
        <div>
          <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-widest">
            Biodata & Tugas Pokok
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-text)] mt-1">
            Jajaran Pengelola Perpustakaan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {staffList.map((staff) => (
            <div
              key={staff.id}
              className="bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] p-6 sm:p-8 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-5">
                {/* Header card with Avatar and Identity */}
                <div className="flex items-start gap-4">
                  {staff.avatarUrl ? (
                    <img
                      src={staff.avatarUrl}
                      alt={staff.name}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-[var(--color-border)] shadow-2xs"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center font-serif text-xl font-bold shrink-0 shadow-2xs">
                      {staff.name
                        .split(' ')
                        .filter((n) => !n.includes('.') && n.length > 2)
                        .slice(0, 2)
                        .map((p) => p[0])
                        .join('') || 'TI'}
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-[var(--color-primary)] uppercase tracking-wider block">
                      {staff.role}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--color-text)] leading-snug">
                      {staff.name}
                    </h3>
                    {staff.nip && (
                      <p className="text-xs font-mono text-[var(--color-text-muted)]">
                        NIP. {staff.nip}
                      </p>
                    )}
                  </div>
                </div>

                {/* Education credential */}
                {staff.education && (
                  <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] pt-1 border-t border-[var(--color-border)]">
                    <GraduationCap className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                    <span>{staff.education}</span>
                  </div>
                )}

                {/* Bio brief */}
                <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed font-sans">
                  {staff.bio}
                </p>

                {/* Tasks list */}
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wider">
                    Uraian Tugas Pokok:
                  </p>
                  <ul className="space-y-1.5 text-xs text-[var(--color-text-muted)] font-sans">
                    {staff.tasks.map((task, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-2">
                        <span className="text-[var(--color-primary)] font-bold mt-0.5">•</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] text-[var(--color-text-muted)]">
                <span>Status: Aktif</span>
                <span>Perpustakaan Titian Ilmu SMPN 1 Tambak</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
