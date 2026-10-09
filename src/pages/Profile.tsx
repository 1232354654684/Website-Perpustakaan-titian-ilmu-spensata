import React from 'react';
import {
  BookOpen,
  Target,
  Compass,
  CheckCircle2,
  Building,
  Sparkles,
  Users2,
  Award,
  BookMarked,
  HeartHandshake,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useLibrary } from '../context/LibraryContext';

export const Profile: React.FC = () => {
  const { settings, loading } = useLibrary();
  const facilities = [
    {
      title: 'Ruang Baca Utama Ber-AC',
      desc: 'Ruangan tenang dengan meja-meja baca individual dan kelompok, dilengkapi pencahayaan natural yang nyaman untuk mata.',
    },
    {
      title: 'Selasar Lesehan Hijau (Outdoor)',
      desc: 'Area baca santai berlantai kayu dan rumput sintetis di samping taman sekolah, favorit siswa saat jam istirahat.',
    },
    {
      title: 'Terminal Katalog Digital (OPAC)',
      desc: 'Perangkat komputer khusus bagi pemustaka untuk menelusuri nomor panggil rak dan status ketersediaan buku.',
    },
    {
      title: 'Pojok Karya Literasi Siswa',
      desc: 'Etalase khusus yang memajang antologi puisi, majalah dinding, cerpen, serta resensi karya siswa dan guru SMPN 1 Tambak.',
    },
    {
      title: 'Area Koleksi Referensi & Ensiklopedia',
      desc: 'Koleksi kamus besar, ensiklopedia tematik, atlas geografi, dan bahan pustaka rujukan riset sekolah.',
    },
    {
      title: 'Loker Penitipan & Meja Selamat Datang',
      desc: 'Fasilitas loker tas yang aman serta barcode scanner presensi kehadiran mandiri di pintu masuk.',
    },
  ];

  const coreValues = [
    {
      name: 'Terbuka & Inklusif',
      detail: 'Menyambut seluruh warga sekolah tanpa diskriminasi dengan koleksi ramah usia anak.',
    },
    {
      name: 'Integritas & Ketertiban',
      detail: 'Menjaga kelestarian buku dan keakuratan sistem pendataan peminjaman.',
    },
    {
      name: 'Inovasi Literasi',
      detail: 'Terus memadukan media cetak dan digital demi menumbuhkan kecintaan membaca sepanjang hayat.',
    },
    {
      name: 'Pelayanan Sepenuh Hati',
      detail: 'Staf pustakawan yang siap mendampingi riset tugas sekolah dengan ramah dan sabar.',
    },
  ];

  return (
    <div className="space-y-16">
      <PageHeader
        kicker="Profil Lembaga"
        title="Tentang Perpustakaan Titian Ilmu"
        description="Mengenal lebih dalam sejarah, landasan visi misi, sarana prasarana, serta komitmen kami dalam mendampingi perjalanan belajar warga SMP Negeri 1 Tambak."
      />

      {/* Identitas Ringkas & Akreditasi */}
      <section className="bg-white rounded-2xl border border-[#E6DFD3] p-8 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 space-y-4">
            <span className="text-xs font-semibold text-[#1B4332] uppercase tracking-widest">
              Identitas Resmi
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              {settings.name} — {settings.schoolName}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-sans">
              {settings.about}
            </p>
          </div>
          <div className="bg-[#FAF8F5] border border-[#E6DFD3] p-6 rounded-xl space-y-4">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
                Status Akreditasi
              </p>
              <p className="font-serif text-lg font-bold text-stone-700">
                {settings.accreditation || '-'}
              </p>
            </div>
            <div className="pt-2 border-t border-[#E6DFD3]">
              <p className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
                Nomor Pokok Sekolah Nasional (NPSN)
              </p>
              <p className="font-mono text-base font-bold text-stone-700">
                {settings.npsn || '-'}
              </p>
            </div>
            <div className="pt-2 border-t border-[#E6DFD3]">
              <p className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
                Motto / Semboyan
              </p>
              <p className="font-serif italic text-sm text-stone-700">
                "{settings.tagline}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sejarah Singkat */}
      <section className="space-y-6">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold text-[#1B4332] uppercase tracking-widest mb-1">
            Napak Tilas
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Sejarah Singkat
          </h2>
        </div>
        <div className="bg-white rounded-2xl border border-[#E6DFD3] p-8 sm:p-10 shadow-xs prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-4">
          <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-[#1B4332] first-letter:float-left first-letter:mr-3 first-letter:mt-1">
            {settings.history}
          </p>
          <p>
            Perkembangan pesat dirasakan dalam lima tahun terakhir, di mana koleksi tidak hanya terfokus pada buku teks pelajaran wajib, namun diperkaya dengan ragam sastra remaja bermutu, literatur sains populer, buku motivasi, serta fasilitas otomasi terpadu. Nama <em>"Titian Ilmu"</em> terus dijunjung tinggi sebagai pengingat bahwa setiap buku yang dibuka adalah seuntai jembatan menuju peradaban yang lebih bermartabat.
          </p>
        </div>
      </section>

      {/* Visi dan Misi */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Visi */}
        <div className="lg:col-span-5 bg-[#1B4332] text-white rounded-2xl p-8 sm:p-10 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 text-emerald-200 flex items-center justify-center">
              <Target className="w-6 h-6 text-emerald-300" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-200 block">
              Visi Perpustakaan
            </span>
            <blockquote className="font-serif text-xl sm:text-2xl font-medium leading-relaxed italic text-white pt-2">
              "{settings.vision}"
            </blockquote>
          </div>
          <div className="pt-8 border-t border-emerald-800/80 text-xs text-emerald-200/90">
            Ditetapkan sebagai pedoman arah pengembangan jangka panjang Perpustakaan Titian Ilmu.
          </div>
        </div>

        {/* Misi */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E6DFD3] p-8 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E6DFD3] text-[#1B4332] flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#1B4332] uppercase tracking-widest">
                Misi Lembaga
              </span>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Langkah Nyata Mewujudkan Visi
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            {(settings.missions || []).map((mission, index) => (
              <div key={index} className="flex items-start gap-4">
                <span className="w-6 h-6 rounded-full bg-[#1B4332]/10 text-[#1B4332] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-sans">
                  {mission}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nilai Utama Perpustakaan */}
      <section className="space-y-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold text-[#1B4332] uppercase tracking-widest mb-1">
            Budaya Organisasi
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Prinsip Pelayanan Pustaka
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((v, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-[#E6DFD3] space-y-2 shadow-2xs"
            >
              <span className="font-mono text-xs font-bold text-[#1B4332]">
                0{i + 1}.
              </span>
              <h3 className="font-serif text-base font-bold text-stone-900">
                {v.name}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {v.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Sarana & Fasilitas Perpustakaan */}
      <section className="space-y-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold text-[#1B4332] uppercase tracking-widest mb-1">
            Sarana & Prasarana
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Fasilitas Penunjang Pemustaka
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Dirancang dengan tata ruang ramah anak demi menghadirkan kenyamanan maksimal selama berada di perpustakaan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((fac, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-[#E6DFD3] hover:border-[#1B4332]/50 transition-colors shadow-2xs space-y-3"
            >
              <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E6DFD3] text-[#1B4332] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-[#1B4332]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {fac.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {fac.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
