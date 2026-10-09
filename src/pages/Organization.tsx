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
import { staffData, libraryProfileData } from '../data/libraryData';
import { StaffMember } from '../types';
import { VisualFallback } from '../components/VisualFallback';

export const Organization: React.FC = () => {
  const leadership = staffData.filter((s) => s.positionCategory === 'Pimpinan');
  const staffTeam = staffData.filter((s) => s.positionCategory !== 'Pimpinan');

  return (
    <div className="space-y-16">
      <PageHeader
        kicker="Pengelola & Tata Kelola"
        title="Struktur Organisasi Perpustakaan"
        description="Jajaran tenaga kependidikan dan pengelola profesional yang berdedikasi menjaga denyut literasi serta mutu pelayanan Perpustakaan Titian Ilmu SMP Negeri 1 Tambak."
      />

      {/* Skema Bagan Organisasi Sederhana & Elegan */}
      <section className="bg-white rounded-3xl border border-[#E6DFD3] p-8 sm:p-10 shadow-xs space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-[#1B4332] uppercase tracking-widest">
            Bagan Alur Koordinasi
          </span>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Hierarki Pengelola Pustaka
          </h2>
          <p className="text-xs text-stone-500">
            Berdasarkan Surat Keputusan Kepala SMP Negeri 1 Tambak tentang Pengelolaan Perpustakaan Sekolah.
          </p>
        </div>

        {/* Tree Representation */}
        <div className="flex flex-col items-center space-y-6 pt-2">
          {/* Level 1: Kepala Sekolah */}
          <div className="p-4 px-6 rounded-2xl bg-[#1B4332] text-white text-center max-w-sm w-full shadow-sm">
            <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-semibold">
              Penanggung Jawab
            </span>
            <p className="font-serif font-bold text-base mt-0.5">
              Kepala SMP Negeri 1 Tambak
            </p>
            <p className="text-xs text-emerald-100/80">Drs. H. Sugiyanto, M.Pd.</p>
          </div>

          <div className="w-0.5 h-6 bg-[#E6DFD3]" />

          {/* Level 2: Kepala Perpustakaan */}
          <div className="p-4 px-6 rounded-2xl bg-white border-2 border-[#1B4332] text-center max-w-sm w-full shadow-xs">
            <span className="text-[10px] uppercase tracking-widest text-[#1B4332] font-semibold">
              Pimpinan Unit
            </span>
            <p className="font-serif font-bold text-base text-stone-900 mt-0.5">
              Kepala Perpustakaan
            </p>
            <p className="text-xs text-stone-600">Dra. Sri Wahyuni, M.Pd.</p>
          </div>

          <div className="w-0.5 h-6 bg-[#E6DFD3]" />

          {/* Level 3: Tiga Divisi Staf */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6DFD3] text-center">
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">
                Layanan Teknis
              </span>
              <p className="font-serif font-bold text-sm text-stone-900 mt-1">
                Pengolahan Bahan Pustaka
              </p>
              <p className="text-xs text-stone-600">Siti Rohimah, S.Pd.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6DFD3] text-center">
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">
                Layanan Pemustaka
              </span>
              <p className="font-serif font-bold text-sm text-stone-900 mt-1">
                Sirkulasi & Ruang Baca
              </p>
              <p className="text-xs text-stone-600">Bambang Triyono, S.Sos.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6DFD3] text-center">
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">
                Teknologi Informasi
              </span>
              <p className="font-serif font-bold text-sm text-stone-900 mt-1">
                Otomasi & Sistem OPAC
              </p>
              <p className="text-xs text-stone-600">Rian Pratama, S.Kom.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Profil Lengkap Kartu Per Orang */}
      <section className="space-y-8">
        <div>
          <span className="text-xs font-semibold text-[#1B4332] uppercase tracking-widest">
            Biodata & Tugas Pokok
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Jajaran Pengelola Perpustakaan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {staffData.map((staff) => (
            <div
              key={staff.id}
              className="bg-white rounded-3xl border border-[#E6DFD3] p-6 sm:p-8 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-5">
                {/* Header card with Avatar and Identity */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center font-serif text-xl font-bold shrink-0 shadow-2xs">
                    {staff.name
                      .split(' ')
                      .filter((n) => !n.includes('.') && n.length > 2)
                      .slice(0, 2)
                      .map((p) => p[0])
                      .join('') || 'TI'}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-[#1B4332] uppercase tracking-wider block">
                      {staff.role}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                      {staff.name}
                    </h3>
                    {staff.nip && (
                      <p className="text-xs font-mono text-stone-500">
                        NIP. {staff.nip}
                      </p>
                    )}
                  </div>
                </div>

                {/* Education credential */}
                {staff.education && (
                  <div className="flex items-center gap-2 text-xs text-stone-600 pt-1 border-t border-[#F2ECE1]">
                    <GraduationCap className="w-3.5 h-3.5 text-[#1B4332] shrink-0" />
                    <span>{staff.education}</span>
                  </div>
                )}

                {/* Bio brief */}
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                  {staff.bio}
                </p>

                {/* Tasks list */}
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                    Uraian Tugas Pokok:
                  </p>
                  <ul className="space-y-1.5 text-xs text-stone-600 font-sans">
                    {staff.tasks.map((task, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-2">
                        <span className="text-[#1B4332] font-bold mt-0.5">•</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F2ECE1] flex items-center justify-between text-[11px] text-stone-500">
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
