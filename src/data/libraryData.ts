import { ContactInfo, LibraryProfile, NewsItem, OperatingHours, SOPEntry, StaffMember, HomeStatItem } from '../types';
import { DEFAULT_THEME } from '../lib/theme';

export const defaultHomeStatsData: HomeStatItem[] = [
  { id: 'stat-1', label: 'Total Koleksi Buku', value: '8.450', suffix: '+', unit: 'Eksemplar' },
  { id: 'stat-2', label: 'Judul Bahan Pustaka', value: '2.980', suffix: '+', unit: 'Judul' },
  { id: 'stat-3', label: 'Anggota Aktif', value: '780', suffix: '+', unit: 'Siswa & Guru' },
  { id: 'stat-4', label: 'Status Akreditasi', value: 'A', suffix: '', unit: 'Perpustakaan Sekolah' },
];

export const defaultClassSchedules = [
  { id: 'sch-1', day: 'Senin', borrowClass: 'Kelas IX', returnClass: '-', notes: 'Layanan peminjaman terjadwal' },
  { id: 'sch-2', day: 'Selasa', borrowClass: 'Kelas VIII', returnClass: '-', notes: 'Layanan peminjaman terjadwal' },
  { id: 'sch-3', day: 'Rabu', borrowClass: 'Kelas VII', returnClass: 'Kelas IX', notes: 'Peminjaman Kelas VII & Pengembalian Kelas IX' },
  { id: 'sch-4', day: 'Kamis', borrowClass: '-', returnClass: 'Kelas VIII', notes: 'Layanan pengembalian terjadwal' },
  { id: 'sch-5', day: 'Jumat', borrowClass: '-', returnClass: 'Kelas VII', notes: 'Layanan pengembalian terjadwal' },
];

export const defaultMultimediaInfo = {
  name: 'Ruang Multimedia',
  schedule: 'Senin–Kamis: 07.30–14.30 WIB, Jumat: 07.30–10.55 WIB',
  facilities: ['Perangkat Komputer', 'Koneksi Internet Edukasi', 'Akses Koleksi E-Book'],
  durationLimit: 'Maksimal 1 jam per murid (dapat diperpanjang jika perangkat tersedia)',
  rules: 'Digunakan semua mata pelajaran sesuai jadwal masing-masing.'
};

export const libraryProfileData: LibraryProfile = {
  name: 'Perpustakaan Titian Ilmu',
  shortName: 'Titian Ilmu',
  tagline: 'Gerbang Ilmu, Tumbuhkan Minat Baca',
  schoolName: 'SMP Negeri 1 Tambak',
  npsn: '-',
  accreditation: '-',
  npp: '',
  about:
    'Perpustakaan "Titian Ilmu" SMP Negeri 1 Tambak merupakan pusat sumber belajar, sarana literasi informasi, dan wahana rekreasi edukatif bagi seluruh warga sekolah. Berkomitmen mewujudkan generasi pembelajar yang cerdas, berkarakter luhur, dan berwawasan luas melalui penyediaan koleksi pustaka berkualitas serta pelayanan prima berorientasi pemustaka.',
  history:
    'Didirikan seiring dengan berdirinya SMP Negeri 1 Tambak untuk mendukung kegiatan belajar mengajar. Nama "Titian Ilmu" dipilih sebagai simbol jembatan yang kokoh bagi para peserta didik dalam melangkah meraih cita-cita dan wawasan semesta. Dari sebuah ruang baca sederhana, Perpustakaan Titian Ilmu bertransformasi menjadi ruang belajar kolaboratif modern yang nyaman, ramah anak, dan mengintegrasikan otomasi perpustakaan guna mempermudah akses informasi di era digital.',
  vision: 'Terwujudnya Budaya Baca di Sekolah',
  missions: [
    'Menumbuhkan kebiasaan membaca di kalangan siswa.',
    'Menumbuhkan minat baca dan belajar di kalangan siswa.',
    'Menumbuhkan pribadi yang cerdas, berbudaya, terampil, dan mandiri.',
    'Mewujudkan pengelolaan dan pemanfaatan perpustakaan secara optimal.',
    'Meningkatkan peran perpustakaan menjadi tempat belajar bagi siswa untuk meningkatkan kecerdasan.'
  ],
  goals: [
    'Menyediakan sumber belajar yang lengkap, relevan, dan mutakhir.',
    'Mendorong kebiasaan membaca dan budaya literasi.',
    'Memberikan layanan berbasis digital agar akses informasi lebih cepat dan mudah.',
    'Membantu murid dan guru dalam belajar, penelitian, dan pengembangan diri.',
    'Menciptakan suasana belajar yang kondusif, tertib, dan menyenangkan.'
  ],
  stats: {
    totalBooks: 8450,
    totalTitles: 2980,
    activeMembers: 780,
    monthlyVisitors: 1420
  },
  logoUrl: '',
  homeStats: defaultHomeStatsData,
  heroVisualDescription: 'Menyediakan ragam bahan pustaka terkurasi, ruang baca berpenyejuk udara, otomasi katalog pencarian judul, serta selasar hijau ramah anak.',
  colorTheme: DEFAULT_THEME,
  classSchedules: defaultClassSchedules,
  multimediaInfo: defaultMultimediaInfo
};

export const operatingHoursData: OperatingHours[] = [
  {
    dayRange: 'Senin – Kamis',
    hours: '07.30 – 14.30 WIB',
    breakTime: '-',
    isOpen: true,
    notes: 'Layanan sirkulasi dan ruang baca'
  },
  {
    dayRange: 'Jumat',
    hours: '07.30 – 10.55 WIB',
    breakTime: '-',
    isOpen: true,
    notes: 'Layanan sirkulasi dan baca pagi'
  },
  {
    dayRange: 'Sabtu, Minggu & Libur Sekolah',
    hours: 'Tutup',
    breakTime: '-',
    isOpen: false,
    notes: 'Pelayanan tatap muka tutup'
  },
  {
    dayRange: 'Ruang Multimedia',
    hours: 'Senin–Kamis 07.30–14.30, Jumat 07.30–10.55',
    breakTime: 'Maks. 1 jam per murid (dapat diperpanjang jika tersedia)',
    isOpen: true,
    notes: 'Komputer, internet, akses e-book. Digunakan semua mapel sesuai jadwal.'
  }
];

export const newsData: NewsItem[] = [
  {
    id: 'berita-1',
    slug: 'pekan-literasi-dan-pemilihan-duta-baca-2026',
    title: 'Pekan Literasi 2026 dan Penobatan Duta Baca Baru SMPN 1 Tambak',
    category: 'Kegiatan',
    date: '18 Februari 2026',
    author: 'Admin Pustaka',
    authorRole: 'Pengelola Perpustakaan',
    readTime: '3 menit baca',
    featured: true,
    excerpt:
      'Perpustakaan Titian Ilmu menggelar rangkaian Pekan Literasi Tahunan yang dimeriahkan dengan lomba resensi, bazar buku mini, serta penobatan Duta Baca Siswa Periode 2026/2027.',
    content: [
      'Guna membangkitkan gairah membaca di kalangan peserta didik, Perpustakaan Titian Ilmu SMP Negeri 1 Tambak sukses menyelenggarakan "Pekan Literasi Sekolah" yang berlangsung selama lima hari penuh.',
      'Kegiatan dibuka secara resmi oleh Kepala Sekolah didampingi Kepala Perpustakaan di aula terbuka sekolah. Rangkaian acara meliputi lomba cipta puisi, kompetisi resensi buku fiksi, pameran mading literasi kelas, hingga bincang santai kiat menulis bagi pemula.',
      'Puncak acara ditandai dengan penobatan Duta Baca Pelajar 2026 yang diraih oleh perwakilan siswa kelas VIII atas rekor peminjaman buku terbanyak dan keaktifan memandu pojok baca kelas. Melalui kegiatan ini, diharapkan budaya literasi bukan sekadar kewajiban akademis, melainkan kebiasaan menyenangkan yang terus bertumbuh.'
    ],
    imageUrl: ''
  },
  {
    id: 'berita-2',
    slug: 'penambahan-600-koleksi-buku-bacaan-terbaru',
    title: 'Perpustakaan Tambah 600 Judul Buku Baru untuk Pengayaan Siswa',
    category: 'Pengumuman',
    date: '02 Februari 2026',
    author: 'Siti Rohimah, S.Pd.',
    authorRole: 'Staf Pengolahan Bahan Pustaka',
    readTime: '2 menit baca',
    featured: true,
    excerpt:
      'Koleksi buku fiksi remaja, ensiklopedia sains bergambar, serta buku referensi persiapan asesmen telah selesai diolah dan siap dipinjam oleh seluruh siswa dan guru.',
    content: [
      'Kabar gembira bagi para pemustaka setia Titian Ilmu. Sebanyak 600 eksemplar buku baru resmi dimasukkan ke dalam daftar inventaris dan rak sirkulasi setelah melewati proses klasifikasi nomor Dewey Decimal (DDC) serta penempelan barcode.',
      'Koleksi baru ini didominasi oleh novel edukatif, komik sains terjemahan bermutu, ensiklopedia flora dan fauna Nusantara, serta buku panduan keterampilan hidup (life skills) untuk jenjang SMP.',
      'Siswa dipersilakan memeriksa ketersediaan judul melalui terminal katalog komputer di meja layanan sirkulasi atau bertanya langsung kepada petugas piket perpustakaan.'
    ],
    imageUrl: ''
  },
  {
    id: 'berita-3',
    slug: 'revitalisasi-pojok-baca-lesehan-outdoor',
    title: 'Wajah Baru Pojok Baca Teduh di Selasar Perpustakaan Titian Ilmu',
    category: 'Literasi',
    date: '15 Januari 2026',
    author: 'Tim Kreatif Pustaka',
    authorRole: 'Koordinator Fasilitas',
    readTime: '3 menit baca',
    featured: true,
    excerpt:
      'Fasilitas area baca lesehan luar ruangan kini dilengkapi dengan bantalan duduk ergonomis, rak kayu estetik, dan pencahayaan alami yang sejuk untuk kenyamanan membaca.',
    content: [
      'Membaca buku tidak lagi membosankan di dalam ruangan tertutup. Tim Perpustakaan Titian Ilmu kini menghadirkan konsep "Selasar Pustaka Hijau", sebuah area membaca santai semi-terbuka yang terhubung langsung dengan taman sekolah.',
      'Dilengkapi dengan meja rendah berbahan kayu jati belanda, karpet rumput sintetis, serta naungan pohon rindang, area ini menjadi magnet favorit peserta didik saat jam istirahat pertama maupun jam luang sehabis olahraga.',
      'Diharapkan inovasi tata ruang ini mampu mengikis anggapan bahwa perpustakaan adalah tempat kaku, sekaligus menjadikannya rumah kedua yang menenangkan bagi pecinta buku.'
    ],
    imageUrl: ''
  },
  {
    id: 'berita-4',
    slug: 'sosialisasi-etika-dan-pemanfaatan-sumber-digital',
    title: 'Sosialisasi Penelusuran Informasi Digital dan Pencegahan Plagiarisme',
    category: 'Kegiatan',
    date: '20 Desember 2025',
    author: 'Admin Pustaka',
    authorRole: 'Layanan TIK',
    readTime: '4 menit baca',
    featured: false,
    excerpt:
      'Workshop literasi digital bagi pengurus OSIS dan perwakilan kelas guna membekali cara memvalidasi rujukan internet yang terpercaya untuk tugas sekolah.',
    content: [
      'Menanggapi melimpahnya informasi digital, Perpustakaan Titian Ilmu menyelenggarakan workshop ringkas mengenai teknik pencarian rujukan ilmiah yang kredibel dan etika mengutip karya orang lain.',
      'Peserta dilatih mengenali ciri-ciri berita hoaks, mengakses repositori jurnal ramah siswa, serta mencantumkan daftar pustaka yang santun pada tugas makalah kelompok.',
      'Kegiatan ini menjadi bagian integral dari peran perpustakaan sebagai laboratorium riset awal bagi generasi muda.'
    ],
    imageUrl: ''
  }
];

export const sopData: SOPEntry[] = [
  {
    id: 'sop-1-tata-tertib',
    title: '1. Tata Tertib Pengunjung',
    category: 'Ketertiban & Kunjungan',
    description:
      'Tata tertib dan norma kepatutan yang wajib dipatuhi oleh seluruh pemustaka demi menjaga kenyamanan, ketertiban, dan kebersihan ruang perpustakaan.',
    targetAudience: 'Seluruh Siswa, Guru, dan Warga Sekolah',
    processingTime: 'Berlaku selama berada di perpustakaan',
    requirements: [
      'Mengisi daftar hadir sebelum masuk',
      'Masuk dengan tenang, tidak berlari, dan bersikap sopan',
      'Tas, jaket, dan barang bawaan diletakkan di tempat yang disediakan',
      'Dilarang membawa makanan, minuman, dan benda yang dapat merusak buku',
      'Menjaga kebersihan dan ketertiban lingkungan ruang baca',
      'Tidak tidur dan tidak bermain di perpustakaan',
      'Tidak mengganggu pengunjung lain',
      'Mengembalikan buku ke tempat semula setelah dibaca',
      'Tidak merusak, mencoret, atau melipat buku'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Presensi Pengunjung',
        description: 'Mengisi daftar hadir sebelum masuk perpustakaan.',
        duration: '1 menit'
      },
      {
        stepNumber: 2,
        title: 'Penitipan Barang Bawaan',
        description: 'Tas, jaket, dan barang bawaan diletakkan di tempat yang telah disediakan secara tertib.',
        duration: '1 menit'
      },
      {
        stepNumber: 3,
        title: 'Masuk dengan Tenang & Sopan',
        description: 'Masuk dengan tenang, tidak berlari, dan menjaga sikap sopan di dalam ruang baca.',
        duration: 'Selama berkunjung'
      },
      {
        stepNumber: 4,
        title: 'Menjaga Ketertiban & Fasilitas',
        description: 'Dilarang membawa makanan/minuman, tidak tidur/bermain, tidak mengganggu pengunjung lain, dan tidak merusak atau mencoret buku.',
        duration: 'Selama berkunjung'
      },
      {
        stepNumber: 5,
        title: 'Merapikan Koleksi',
        description: 'Mengembalikan buku ke tempat semula setelah selesai dibaca.',
        duration: 'Saat selesai'
      }
    ],
    notes: 'Kepatuhan terhadap tata tertib menjamin kenyamanan belajar bersama.',
    orderIndex: 0
  },
  {
    id: 'sop-2-ketentuan-peminjaman',
    title: '2. Ketentuan Peminjaman',
    category: 'Layanan Sirkulasi',
    description:
      'Syarat, batas kuota, dan masa peminjaman bahan pustaka bagi seluruh anggota perpustakaan yang sah.',
    targetAudience: 'Siswa dan Anggota Terdaftar Perpustakaan',
    processingTime: 'Masa pinjam 7 hari kalender',
    requirements: [
      'Wajib terdaftar sebagai anggota dengan kartu anggota (sekaligus kartu peminjaman)',
      'Maksimal 3 buku selama 7 hari',
      'Perpanjangan maksimal 1 kali',
      'Buku referensi (kamus, ensiklopedia, atlas, dll.) hanya dibaca di tempat',
      'Buku rusak atau hilang wajib diganti dengan buku sejenis atau sesuai harga'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Pemeriksaan Kartu Anggota',
        description: 'Wajib terdaftar sebagai anggota dengan kartu anggota (sekaligus kartu peminjaman).',
        duration: '1 menit'
      },
      {
        stepNumber: 2,
        title: 'Batas Kuota Pinjam',
        description: 'Maksimal peminjaman 3 (tiga) buku selama 7 (tujuh) hari.',
        duration: '7 hari masa pinjam'
      },
      {
        stepNumber: 3,
        title: 'Hak Perpanjangan',
        description: 'Perpanjangan maksimal 1 kali sebelum masa pinjam jatuh tempo.',
        duration: '1 kali perpanjangan'
      },
      {
        stepNumber: 4,
        title: 'Aturan Khusus Koleksi Referensi',
        description: 'Buku referensi (kamus, ensiklopedia, atlas, dll.) hanya dibaca di tempat.',
        duration: 'Baca di tempat'
      },
      {
        stepNumber: 5,
        title: 'Kewajiban Penggantian',
        description: 'Buku rusak atau hilang wajib diganti dengan buku sejenis atau sesuai harga buku.',
        duration: 'Sesuai ketentuan'
      }
    ],
    notes: 'Rawat dan jaga buku pinjaman dengan baik agar tetap bermanfaat bagi pemustaka lain.',
    orderIndex: 1
  },
  {
    id: 'sop-3-tata-cara-peminjaman',
    title: '3. Tata Cara Peminjaman',
    category: 'Layanan Sirkulasi & Otomasi',
    description:
      'Alur lengkap peminjaman buku melalui aplikasi katalog online OPAC Inlislite maupun pelayanan langsung di meja sirkulasi.',
    targetAudience: 'Seluruh Pemustaka Terdaftar',
    processingTime: '± 2–3 menit per transaksi',
    requirements: [
      'Terdaftar sebagai anggota dan telah memiliki ID anggota (kartu/barcode) dari petugas',
      'Akun login Inlislite (ID anggota dan kata sandi) atau hadir di meja sirkulasi'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Pendaftaran & Registrasi ID Anggota',
        description: 'Terdaftar sebagai anggota dan mendapat ID anggota (kartu/barcode) dari petugas perpustakaan.',
        duration: '1 kali di awal'
      },
      {
        stepNumber: 2,
        title: 'Login & Pencarian Katalog OPAC Inlislite',
        description: 'Login ke aplikasi Inlislite dengan ID anggota dan password untuk mencari buku lewat OPAC (judul, pengarang, subjek/kata kunci, nomor klasifikasi/rak).',
        duration: '2 - 3 menit'
      },
      {
        stepNumber: 3,
        title: 'Cek Ketersediaan & Reservasi Mandiri',
        description: 'Cek ketersediaan buku pada sistem. Klik "Booking/Reservasi" jika buku berstatus tersedia.',
        duration: '1 menit'
      },
      {
        stepNumber: 4,
        title: 'Pemindaian di Meja Sirkulasi',
        description: 'Atau datang langsung ke meja sirkulasi membawa kartu anggota, petugas memindai barcode buku dan ID anggota.',
        duration: '1 menit'
      },
      {
        stepNumber: 5,
        title: 'Pencatatan Otomatis & Opsi Perpanjangan',
        description: 'Sistem mencatat peminjaman secara otomatis. Perpanjangan 1 kali dapat dilakukan lewat aplikasi atau petugas sebelum jatuh tempo.',
        duration: 'Selesai'
      }
    ],
    notes: 'Katalog online (OPAC Inlislite) dapat diakses melalui link resmi perpustakaan untuk penelusuran mandiri.',
    orderIndex: 2
  },
  {
    id: 'sop-4-tata-cara-pengembalian',
    title: '4. Tata Cara Pengembalian',
    category: 'Layanan Sirkulasi',
    description:
      'Prosedur pengembalian buku pinjaman di meja sirkulasi, verifikasi status di sistem Inlislite, dan tindak lanjut pengembalian.',
    targetAudience: 'Peminjam Buku Aktif',
    processingTime: '± 1–2 menit',
    requirements: [
      'Pastikan buku dalam kondisi baik, bersih, dan tidak rusak',
      'Membawa kartu anggota perpustakaan'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Pengecekan Fisik Buku',
        description: 'Pastikan buku dalam kondisi baik, tidak dicoret, tidak sobek, dan barcode utuh.',
        duration: '1 menit'
      },
      {
        stepNumber: 2,
        title: 'Penyerahan ke Meja Sirkulasi',
        description: 'Bawa buku yang hendak dikembalikan ke meja sirkulasi bersama dengan kartu anggota.',
        duration: '1 menit'
      },
      {
        stepNumber: 3,
        title: 'Pemindaian Barcode & Pembaruan Sistem',
        description: 'Petugas memindai barcode buku dan ID anggota; sistem otomatis mencatat status "dikembalikan".',
        duration: '30 detik'
      },
      {
        stepNumber: 4,
        title: 'Pencatatan Sanksi & Cek Riwayat di Aplikasi',
        description: 'Jika terlambat, sistem mencatat sanksi secara otomatis. Status riwayat peminjaman buku dapat dilihat langsung di aplikasi.',
        duration: 'Selesai'
      }
    ],
    notes: 'Kembalikan buku sebelum tanggal jatuh tempo agar riwayat keanggotaan Anda tetap bersih.',
    orderIndex: 3
  },
  {
    id: 'sop-5-pelanggaran-sanksi',
    title: '5. Pelanggaran dan Sanksi',
    category: 'Ketertiban & Kedisiplinan',
    description:
      'Tabel ketentuan sanksi atas pelanggaran tata tertib, peminjaman, dan fasilitas di lingkungan Perpustakaan Titian Ilmu.',
    targetAudience: 'Seluruh Siswa dan Pemustaka',
    processingTime: 'Penetapan sanksi saat pelanggaran terjadi',
    requirements: [
      'Berlaku mutlak untuk seluruh pemustaka di SMP Negeri 1 Tambak guna menumbuhkan tanggung jawab dan disiplin'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Pencatatan Pelanggaran',
        description: 'Petugas mencatat jenis pelanggaran ke dalam buku ketertiban atau sistem otomasi perpustakaan.',
        duration: 'Saat kejadian'
      },
      {
        stepNumber: 2,
        title: 'Pemberlakuan Sanksi Resmi',
        description: 'Pelanggar menerima konsekuensi sanksi sesuai ketentuan pada tabel pelanggaran dan sanksi resmi.',
        duration: 'Sesuai jenis sanksi'
      }
    ],
    sanctions: [
      {
        violation: 'Terlambat mengembalikan buku',
        sanction: 'Teguran dan membuat pernyataan tidak mengulangi'
      },
      {
        violation: 'Merusak, mencoret-coret, atau menghilangkan buku',
        sanction: 'Wajib mengganti dengan buku sejenis'
      },
      {
        violation: 'Melanggar tata tertib berulang kali',
        sanction: 'Hak peminjaman ditangguhkan 1 minggu'
      },
      {
        violation: 'Tindakan yang merugikan fasilitas perpustakaan',
        sanction: 'Tidak boleh masuk perpustakaan untuk jangka waktu tertentu'
      },
      {
        violation: 'Membawa makanan/minuman; tidur; mengganggu pengunjung lain; bermain di perpustakaan',
        sanction: 'Teguran dan membuat pernyataan tidak mengulangi'
      },
      {
        violation: 'Menyalin konten digital tanpa izin',
        sanction: '1 minggu tidak boleh memakai sarana digital perpustakaan'
      }
    ],
    notes: 'Sanksi bersifat edukatif dan disipliner untuk menjaga kelestarian koleksi dan kenyamanan bersama.',
    orderIndex: 4
  }
];

export const staffData: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Sad Diana Puji Hartono, S.Pd., M.Pd.',
    role: 'Kepala Sekolah',
    positionCategory: 'Pimpinan',
    nip: '',
    education: 'Magister Pendidikan (M.Pd.)',
    bio:
      'Penanggung jawab utama kebijakan, sarana prasarana, dan pengembangan mutu Perpustakaan Titian Ilmu sebagai pusat keunggulan akademik SMP Negeri 1 Tambak.',
    tasks: [
      'Menetapkan kebijakan strategis pengembangan perpustakaan sekolah.',
      'Mengalokasikan anggaran sarana prasarana dan pengadaan koleksi pustaka.',
      'Mendorong integrasi gerakan literasi sekolah dalam proses pembelajaran.'
    ],
    avatarUrl: ''
  },
  {
    id: 'staff-2',
    name: 'Yuliarti Puji Astuti, S.Pd.',
    role: 'Kepala Perpustakaan',
    positionCategory: 'Pengelola',
    nip: '',
    education: 'Sarjana Pendidikan (S.Pd.) & Sertifikasi Pengelola Perpustakaan',
    bio:
      'Memimpin dan mengkoordinasikan operasional pelayanan perpustakaan, pengolahan bahan pustaka, otomasi katalog Inlislite, serta pembinaan minat baca siswa.',
    tasks: [
      'Menyusun rencana kerja dan program tahunan perpustakaan.',
      'Mengelola pelayanan sirkulasi, referensi, dan bimbingan pemustaka.',
      'Mengkoordinasikan Gerakan Literasi Sekolah dan otomasi perpustakaan Inlislite.'
    ],
    avatarUrl: ''
  }
];

export const contactInfoData: ContactInfo = {
  address: 'Jl. Raya Tambak No. 12, Kamulyan, Kec. Tambak, Kab. Banyumas',
  subdistrict: 'Kecamatan Tambak',
  district: 'Kabupaten Banyumas',
  province: 'Jawa Tengah',
  postalCode: '53196',
  phone: '(0287) 472145',
  whatsapp: '6281234567890',
  email: 'perpustakaan@smpn1tambak.sch.id',
  instagram: 'https://instagram.com/smpn1tambak_official',
  youtube: 'https://youtube.com/@smpn1tambak',
  mapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.2755866768393!2d109.42851427499694!3d-7.652193892364024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e656ed611f71585%3A0x8544d6a1b24f5a3!2sSMP%20NEGERI%201%20TAMBAK!5e0!3m2!1sid!2sid!4v1718000000000!5m2!1sid!2sid',
  mapsDirectUrl:
    'https://www.google.com/maps/place/SMP+NEGERI+1+TAMBAK/@-7.6521992,109.4310892,17z/data=!3m1!4b1!4m6!3m5!1s0x2e656ed611f71585:0x8544d6a1b24f5a3!8m2!3d-7.6521992!4d109.4310892!16s%2Fg%2F11b6_c2c1w'
};
