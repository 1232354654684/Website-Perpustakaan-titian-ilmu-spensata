import { ContactInfo, LibraryProfile, NewsItem, OperatingHours, SOPEntry, StaffMember } from '../types';

export const libraryProfileData: LibraryProfile = {
  name: 'Perpustakaan Titian Ilmu',
  shortName: 'Titian Ilmu',
  tagline: 'Gerbang Ilmu, Tumbuhkan Minat Baca',
  schoolName: 'SMP Negeri 1 Tambak',
  npsn: '-',
  accreditation: '-',
  about:
    'Perpustakaan "Titian Ilmu" SMP Negeri 1 Tambak merupakan pusat sumber belajar, sarana literasi informasi, dan wahana rekreasi edukatif bagi seluruh warga sekolah. Berkomitmen mewujudkan generasi pembelajar yang cerdas, berkarakter luhur, dan berwawasan luas melalui penyediaan koleksi pustaka berkualitas serta pelayanan prima berorientasi pemustaka.',
  history:
    'Didirikan seiring dengan berdirinya SMP Negeri 1 Tambak untuk mendukung kegiatan belajar mengajar. Nama "Titian Ilmu" dipilih sebagai simbol jembatan yang kokoh bagi para peserta didik dalam melangkah meraih cita-cita dan wawasan semesta. Dari sebuah ruang baca sederhana, Perpustakaan Titian Ilmu bertransformasi menjadi ruang belajar kolaboratif modern yang nyaman, ramah anak, dan mengintegrasikan otomasi perpustakaan guna mempermudah akses informasi di era digital.',
  vision:
    'Terwujudnya perpustakaan sekolah yang unggul, inspiratif, dan berdaya guna dalam membentuk insan berkarakter, literat, dan berbudaya baca tinggi.',
  missions: [
    'Menyediakan dan mengembangkan koleksi bahan pustaka yang relevan dengan kurikulum dan pengembangan potensi peserta didik.',
    'Memberikan pelayanan sirkulasi dan referensi yang ramah, cepat, tepat, dan menyenangkan.',
    'Menciptakan ruang baca yang asri, tenang, bersih, dan berwawasan lingkungan agar pemustaka betah berkunjung.',
    'Menyelenggarakan program-program literasi kreatif seperti Gerakan Literasi Sekolah (GLS), pemilihan Duta Baca, dan bedah buku berkala.',
    'Memanfaatkan teknologi informasi dalam sistem katalogisasi dan otomasi perpustakaan demi efisiensi layanan.'
  ],
  goals: [
    'Meningkatkan angka kunjungan dan minat baca warga sekolah sebesar minimal 25% setiap tahun ajaran.',
    'Memperkaya ragam koleksi fiksi bermutu dan non-fiksi ilmiah populer yang terbarukan.',
    'Mengintegrasikan kegiatan literasi perpustakaan dengan pembelajaran berbasis proyek di kelas.'
  ],
  stats: {
    totalBooks: 8450,
    totalTitles: 2980,
    activeMembers: 780,
    monthlyVisitors: 1420
  },
  logoUrl: ''
};

export const operatingHoursData: OperatingHours[] = [
  {
    dayRange: 'Senin – Kamis',
    hours: '07.00 – 14.30 WIB',
    breakTime: 'Istirahat: 11.45 – 12.30 WIB',
    isOpen: true,
    notes: 'Layanan sirkulasi dan ruang baca terbuka penuh'
  },
  {
    dayRange: 'Jumat',
    hours: '07.00 – 11.15 WIB',
    breakTime: 'Sholat Jumat & Bersih Lingkungan',
    isOpen: true,
    notes: 'Layanan peminjaman dan pengembalian pagi'
  },
  {
    dayRange: 'Sabtu',
    hours: 'Tutup',
    breakTime: '-',
    isOpen: false,
    notes: 'Pelayanan tatap muka tutup'
  },
  {
    dayRange: 'Minggu & Hari Libur Nasional',
    hours: 'Tutup',
    breakTime: '-',
    isOpen: false,
    notes: 'Pelayanan tatap muka libur'
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
    id: 'sop-peminjaman',
    title: 'SOP Peminjaman Buku Sirkulasi',
    category: 'Layanan Sirkulasi',
    description:
      'Prosedur standar bagi anggota perpustakaan untuk meminjam koleksi buku umum maupun fiksi yang diizinkan dibawa pulang.',
    targetAudience: 'Siswa, Guru, dan Karyawan SMPN 1 Tambak',
    processingTime: '± 2–3 menit per transaksi',
    requirements: [
      'Memiliki Kartu Anggota Perpustakaan yang masih aktif (berbarcode).',
      'Tidak memiliki tanggungan keterlambatan atau denda buku sebelumnya.',
      'Maksimal peminjaman 2 (dua) eksemplar buku untuk siswa, dan 4 (empat) untuk guru.',
      'Jangka waktu pinjam adalah 7 (tujuh) hari kalender.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Penelusuran & Pemilihan Buku',
        description:
          'Pemustaka mencari buku di rak koleksi atau memanfaatkan komputer katalog (OPAC). Pastikan buku dalam kondisi baik.',
        duration: '5 - 10 menit'
      },
      {
        stepNumber: 2,
        title: 'Penyerahan ke Meja Sirkulasi',
        description:
          'Membawa buku yang dipilih beserta Kartu Anggota Perpustakaan ke meja petugas sirkulasi.',
        duration: '1 menit'
      },
      {
        stepNumber: 3,
        title: 'Pemindaian Barcode & Pencatatan Sistem',
        description:
          'Petugas memindai nomor anggota dan barcode buku ke dalam sistem otomasi perpustakaan, lalu mencatat tanggal batas kembali.',
        duration: '1 menit'
      },
      {
        stepNumber: 4,
        title: 'Pemberian Cap Tanggal Kembali (Slip Bukti)',
        description:
          'Petugas membubuhkan cap tanggal jatuh tempo pada slip pengembalian di bagian belakang buku.',
        duration: '30 detik'
      },
      {
        stepNumber: 5,
        title: 'Penerimaan Buku oleh Pemustaka',
        description:
          'Buku dan kartu anggota diserahkan kembali kepada peminjam. Peminjam berkewajiban merawat buku dengan baik.',
        duration: 'Selesai'
      }
    ],
    notes:
      'Koleksi referensi bertanda label merah (seperti kamus tebal, ensiklopedia induk, dan buku induk arsip) hanya dapat dibaca di tempat.'
  },
  {
    id: 'sop-pengembalian',
    title: 'SOP Pengembalian & Perpanjangan Buku',
    category: 'Layanan Sirkulasi',
    description:
      'Prosedur pengembalian buku yang telah dipinjam tepat waktu, verifikasi keutuhan fisik buku, serta perpanjangan masa pinjam.',
    targetAudience: 'Seluruh Peminjam Aktif',
    processingTime: '± 1–2 menit',
    requirements: [
      'Membawa buku yang hendak dikembalikan dalam keadaan utuh, bersih, dan tidak robek.',
      'Membawa Kartu Anggota Perpustakaan.',
      'Perpanjangan dapat dilakukan 1 (satu) kali berturut-turut selama buku tidak sedang dipesan oleh pemustaka lain.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Penyerahan Buku ke Petugas',
        description:
          'Pemustaka menyerahkan buku yang dipinjam beserta kartu anggota kepada petugas di meja sirkulasi sebelum tanggal jatuh tempo.',
        duration: '1 menit'
      },
      {
        stepNumber: 2,
        title: 'Pemeriksaan Fisik Bahan Pustaka',
        description:
          'Petugas memeriksa kondisi fisik buku (halaman, sampul, barcode) untuk memastikan tidak terjadi kerusakan atau coretan.',
        duration: '1 menit'
      },
      {
        stepNumber: 3,
        title: 'Pembaruan Data Transaksi di Sistem',
        description:
          'Petugas memindai barcode buku untuk menutup status pinjaman di sistem otomasi perpustakaan.',
        duration: '30 detik'
      },
      {
        stepNumber: 4,
        title: 'Opsi Perpanjangan (Jika Diperlukan)',
        description:
          'Bila pemustaka ingin memperpanjang, petugas memperbarui tanggal jatuh tempo baru (maksimal perpanjangan 7 hari tambahan).',
        duration: '1 menit'
      },
      {
        stepNumber: 5,
        title: 'Pengembalian Buku ke Rak Transit',
        description:
          'Petugas meletakkan buku yang selesai diperiksa di troli/rak transit untuk selanjutnya disortir kembali ke rak asalnya.',
        duration: 'Selesai'
      }
    ],
    notes:
      'Keterlambatan pengembalian dikenakan sanksi edukatif (meresensi 1 buku cerita atau merapikan rak baca) untuk menanamkan kedisiplinan.'
  },
  {
    id: 'sop-keanggotaan',
    title: 'SOP Pembuatan & Aktivasi Kartu Anggota',
    category: 'Layanan Keanggotaan',
    description:
      'Tata cara pendaftaran peserta didik baru, guru, dan tenaga kependidikan sebagai anggota sah Perpustakaan Titian Ilmu.',
    targetAudience: 'Peserta Didik Kelas VII & PTK Baru',
    processingTime: 'Kolektif saat Masa Pengenalan Lingkungan Sekolah (MPLS) atau 1 hari kerja',
    requirements: [
      'Terdaftar aktif sebagai siswa atau PTK di SMP Negeri 1 Tambak.',
      'Mengisi formulir biodata anggota (atau import data Dapodik sekolah).',
      'Menyerahkan pasfoto ukuran 2x3 atau foto langsung di stan perpustakaan.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Pengisian Formulir Pendaftaran',
        description:
          'Calon anggota mengisi formulir digital/cetak yang berisi nama lengkap, NIS/NISN, kelas, dan kontak yang dapat dihubungi.',
        duration: '5 menit'
      },
      {
        stepNumber: 2,
        title: 'Verifikasi Data Siswa',
        description:
          'Petugas mencocokkan data formulir dengan database siswa resmi SMPN 1 Tambak.',
        duration: '2 menit'
      },
      {
        stepNumber: 3,
        title: 'Pencetakan Kartu Berbarcode',
        description:
          'Petugas mencetak kartu anggota berisikan identitas dan barcode unik sistem otomasi.',
        duration: '3 menit'
      },
      {
        stepNumber: 4,
        title: 'Orientasi Singkat Layanan',
        description:
          'Petugas memberikan penjelasan singkat mengenai tata letak buku, aturan pinjam, dan fasilitas yang dapat diakses.',
        duration: '5 menit'
      }
    ]
  },
  {
    id: 'sop-tata-tertib',
    title: 'SOP Tata Tertib & Kunjungan Ruang Baca',
    category: 'Ketertiban & Fasilitas',
    description:
      'Peraturan umum yang wajib dipatuhi pemustaka demi menjaga kenyamanan, ketenangan, dan kelestarian koleksi di ruang baca.',
    targetAudience: 'Seluruh Pengunjung Perpustakaan',
    processingTime: 'Berlaku selama berada di area perpustakaan',
    requirements: [
      'Berpakaian seragam sekolah rapi dan sopan sesuai jadwal hari tersebut.',
      'Menjaga sikap saling menghormati dan tidak membuat kegaduhan.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Menitipkan Tas dan Jaket di Loker',
        description:
          'Pengunjung meletakkan tas, ransel, jaket, makanan, dan minuman manis di lemari loker yang telah disediakan di depan pintu masuk.',
        duration: 'Saat masuk'
      },
      {
        stepNumber: 2,
        title: 'Mengisi Buku Pengunjung Elektronik',
        description:
          'Memindai kartu barcode anggota pada scanner presensi di meja selamat datang atau menulis di buku tamu fisik.',
        duration: '15 detik'
      },
      {
        stepNumber: 3,
        title: 'Menjaga Ketenangan (Silent Zone)',
        description:
          'Berbicara dengan suara perlahan, menyetel nada dering ponsel pada mode hening (silent), dan tidak berlari-lari di dalam ruangan.',
        duration: 'Selama berkunjung'
      },
      {
        stepNumber: 4,
        title: 'Penanganan Buku Setelah Dibaca',
        description:
          'Buku yang selesai dibaca TIDAK perlu dikembalikan ke rak sembarangan; letakkan di atas meja khusus atau rak pengembalian agar tidak salah susun.',
        duration: 'Saat selesai'
      }
    ],
    notes:
      'Dilarang merusak, melipat, menggunting lembaran buku, atau mencoret-coret perabotan perpustakaan.'
  },
  {
    id: 'sop-bebas-pustaka',
    title: 'SOP Penerbitan Surat Keterangan Bebas Pustaka',
    category: 'Layanan Administrasi',
    description:
      'Prosedur penerbitan surat bukti bahwa siswa kelas IX tidak lagi memiliki pinjaman buku sebagai syarat kelulusan dan pengambilan ijazah.',
    targetAudience: 'Siswa Kelas IX Menjelang Kelulusan / Siswa Mutasi Pindah',
    processingTime: '5 – 10 menit',
    requirements: [
      'Menunjukkan Kartu Tanda Siswa/Anggota Perpustakaan.',
      'Telah mengembalikan seluruh buku paket pelajaran dan buku sirkulasi yang pernah dipinjam.',
      'Sumbangan 1 buku bacaan layak baca (sukarela sesuai program wakaf buku alumni).'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Pengecekan Riwayat Peminjaman',
        description:
          'Petugas memeriksa catatan historis transaksi peminjaman siswa di pangkalan data perpustakaan.',
        duration: '2 menit'
      },
      {
        stepNumber: 2,
        title: 'Pengembalian Koleksi Terakhir',
        description:
          'Bila masih ada buku paket yang tertinggal, siswa wajib mengembalikannya sebelum surat diproses.',
        duration: 'Sesuai kondisi'
      },
      {
        stepNumber: 3,
        title: 'Penerbitan & Penandatanganan Surat',
        description:
          'Kepala Perpustakaan menandatangani Surat Keterangan Bebas Pustaka resmi berstempel basah.',
        duration: '3 menit'
      }
    ]
  }
];

export const staffData: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Drs. H. Sugiyanto, M.Pd.',
    role: 'Penanggung Jawab / Kepala Sekolah',
    positionCategory: 'Pimpinan',
    nip: '-',
    education: 'S2 Manajemen Pendidikan',
    bio:
      'Memberikan arahan kebijakan umum, alokasi anggaran, dan pembinaan strategis dalam peningkatan mutu perpustakaan sebagai jantung keunggulan akademik SMPN 1 Tambak.',
    tasks: [
      'Menetapkan kebijakan strategis pengembangan perpustakaan sekolah.',
      'Mengalokasikan anggaran sarana prasarana dan pengadaan koleksi pustaka.',
      'Mendorong integrasi gerakan literasi dalam kultur harian sekolah.'
    ],
    avatarUrl: ''
  },
  {
    id: 'staff-2',
    name: 'Dra. Sri Wahyuni, M.Pd.',
    role: 'Kepala Perpustakaan',
    positionCategory: 'Pimpinan',
    nip: '-',
    education: 'S2 Pendidikan Bahasa Indonesia & Sertifikasi Pengelola Perpustakaan',
    bio:
      'Bertanggung jawab merencanakan program kerja tahunan, memimpin operasional pelayanan, menjalin kemitraan literasi, serta membimbing duta baca sekolah.',
    tasks: [
      'Menyusun rencana kerja dan anggaran tahunan perpustakaan.',
      'Memimpin dan mengkoordinasikan kegiatan seluruh staf perpustakaan.',
      'Menggagas inovasi program literasi dan pembinaan minat baca siswa.',
      'Menjalin kerja sama dengan Dinas Kearsipan dan Perpustakaan Daerah Banyumas.'
    ],
    avatarUrl: ''
  },
  {
    id: 'staff-3',
    name: 'Siti Rohimah, S.Pd.',
    role: 'Staf Pengolahan Bahan Pustaka',
    positionCategory: 'Teknis',
    nip: '-',
    education: 'S1 Kependidikan & Diklat Klasifikasi DDC',
    bio:
      'Menangani alur teknis inventarisasi buku baru, pengatalogan, klasifikasi kode DDC, pelabelan punggung buku, hingga penataan susunan di rak koleksi.',
    tasks: [
      'Melakukan inventarisasi dan registrasi bahan pustaka masuk.',
      'Mengklasifikasikan bahan pustaka berdasarkan sistem Dewey Decimal (DDC).',
      'Membuat barcode, label call number, dan kantong buku.',
      'Merawat dan melakukan perbaikan (preservasi) bahan pustaka yang rusak.'
    ],
    avatarUrl: ''
  },
  {
    id: 'staff-4',
    name: 'Bambang Triyono, S.Sos.',
    role: 'Staf Pelayanan Pemustaka & Sirkulasi',
    positionCategory: 'Layanan',
    nip: '-',
    education: 'S1 Ilmu Komunikasi',
    bio:
      'Melayani transaksi sirkulasi peminjaman dan pengembalian dengan ramah, memandu penelusuran bahan referensi, serta menjaga ketertiban ruang baca.',
    tasks: [
      'Melayani transaksi peminjaman dan pengembalian koleksi secara terkomputerisasi.',
      'Membantu siswa menemukan buku referensi dan rujukan tugas.',
      'Mengelola pendaftaran anggota baru dan pembuatan kartu perpustakaan.',
      'Menyelenggarakan ketertiban, kebersihan, dan kenyamanan ruang baca.'
    ],
    avatarUrl: ''
  },
  {
    id: 'staff-5',
    name: 'Rian Pratama, S.Kom.',
    role: 'Staf Teknologi Informasi & Otomasi',
    positionCategory: 'Teknis',
    nip: '-',
    education: 'S1 Sistem Informasi',
    bio:
      'Mengelola sistem otomasi perpustakaan (katalog OPAC, database anggota, jaringan lokal perpustakaan), serta pemeliharaan komputer pemustaka.',
    tasks: [
      'Memelihara server database otomasi perpustakaan dan jaringan WiFi ruang baca.',
      'Mengembangkan fitur katalog pencarian digital (OPAC).',
      'Mengelola konten media informasi dan publikasi kegiatan perpustakaan.',
      'Melakukan pencadangan (backup) data transaksi secara berkala.'
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
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15822.476483471018!2d109.4002!3d-7.6162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e654eb61f000001%3A0x8cf5796a5b78!2sTambak%2C%20Banyumas%20Regency%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid',
  mapsDirectUrl: 'https://maps.google.com/?q=SMP+Negeri+1+Tambak+Banyumas'
};
