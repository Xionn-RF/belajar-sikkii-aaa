import { Subject, EducationLevel } from '../types';

export const SUBJECTS: Subject[] = [
  {
    id: 'matematika',
    name: 'Matematika',
    icon: '📐',
    category: 'mipa',
    description: 'Konsep bilangan, aljabar, geometri, persamaan linear, statistika, dan peluang SMP/MTs.',
    gradient: 'from-blue-500 to-indigo-600',
    badgeBg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    textColor: 'text-blue-600 dark:text-blue-400',
    popularTopics: ['Aljabar & Persamaan Linear', 'Teorema Pythagoras', 'Persamaan Kuadrat', 'Bangun Ruang Sisi Datar', 'Statistika & Peluang'],
    popularTopicsByLevel: {
      'Kelas 7': [
        'Bilangan Bulat & Pecahan',
        'Bentuk Aljabar & Operasi Aljabar',
        'Persamaan & Pertidaksamaan Linear Satu Variabel (PLSV/PtLSV)',
        'Aritmetika Sosial (Untung, Rugi, Diskon, Bunga)',
        'Garis & Sudut',
        'Bangun Datar (Segitiga & Segiempat)',
        'Penyajian Data & Diagram'
      ],
      'Kelas 8': [
        'Pola Bilangan & Barisan Bilangan',
        'Sistem Koordinat Kartesius',
        'Relasi & Fungsi',
        'Persamaan Garis Lurus (PGL)',
        'Sistem Persamaan Linear Dua Variabel (SPLDV)',
        'Teorema Pythagoras & Segitiga Istimewa',
        'Lingkaran (Sudut Pusat, Busur & Luas)',
        'Bangun Ruang Sisi Datar (Kubus, Balok, Prisma, Limas)',
        'Statistika & Peluang'
      ],
      'Kelas 9': [
        'Bilangan Berpangkat & Bentuk Akar',
        'Persamaan Kuadrat & Fungsi Kuadrat',
        'Transformasi Geometri (Translasi, Refleksi, Rotasi, Dilatasi)',
        'Kesebangunan & Kekongruenan Segitiga',
        'Bangun Ruang Sisi Lengkung (Tabung, Kerucut, Bola)',
        'Pengolahan & Penyajian Data Lanjutan'
      ],
      'SMP/MTs': [
        'Aljabar & Persamaan Linear',
        'Sistem Persamaan Linear Dua Variabel (SPLDV)',
        'Teorema Pythagoras & Geometri',
        'Persamaan & Fungsi Kuadrat',
        'Bangun Ruang Sisi Datar & Lengkung',
        'Statistika & Peluang'
      ]
    },
  },
  {
    id: 'ipa',
    name: 'IPA',
    icon: '🔬',
    category: 'mipa',
    description: 'Ilmu Pengetahuan Alam terpadu SMP/MTs: Fisika, Biologi, Kimia, dan Kebumian.',
    gradient: 'from-emerald-500 to-teal-600',
    badgeBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    popularTopics: ['Sistem Organ Manusia', 'Gaya & Hukum Newton', 'Zat, Wujud & Perubahannya', 'Sistem Tata Surya', 'Listrik Statis & Dinamis'],
    popularTopicsByLevel: {
      'Kelas 7': [
        'Hakikat Sains & Pengukuran',
        'Zat, Wujud Benda & Perubahannya',
        'Suhu, Kalor & Pemuaian',
        'Gaya & Gerak Lurus (GLB/GLBB)',
        'Klasifikasi Makhluk Hidup & Mitos/Fakta',
        'Ekosistem & Interaksi Makhluk Hidup',
        'Bumi, Lapisan Bumi & Tata Surya'
      ],
      'Kelas 8': [
        'Struktur & Fungsi Tubuh Manusia (Pencernaan & Peredaran Darah)',
        'Sistem Pernapasan & Ekskresi Manusia',
        'Usaha & Pesawat Sederhana',
        'Unsur, Senyawa & Campuran',
        'Struktur & Fungsi Tumbuhan (Fotosintesis)',
        'Getaran, Gelombang & Bunyi',
        'Cahaya & Alat Optik'
      ],
      'Kelas 9': [
        'Sistem Reproduksi Manusia & Kesehatan',
        'Perkembangbiakan Tumbuhan & Hewan',
        'Pewarisan Sifat & Hukum Mendel',
        'Listrik Statis & Muatan Listrik',
        'Listrik Dinamis, Hukum Ohm & Kirchhoff',
        'Kemagnetan & Induksi Elektromagnetik',
        'Bioteknologi Konvensional & Modern',
        'Tanah & Keberlangsungannya'
      ],
      'SMP/MTs': [
        'Hakikat Sains & Pengukuran',
        'Zat, Suhu, Kalor & Pemuaian',
        'Gaya, Gerak & Hukum Newton',
        'Sistem Organ Manusia',
        'Listrik Statis, Dinamis & Kemagnetan',
        'Pewarisan Sifat & Bioteknologi'
      ]
    },
  },
  {
    id: 'ips',
    name: 'IPS',
    icon: '🌏',
    category: 'sosial',
    description: 'Ilmu Pengetahuan Sosial terpadu SMP/MTs: Geografi, Ekonomi, Sosiologi, dan Sejarah.',
    gradient: 'from-amber-500 to-orange-600',
    badgeBg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    textColor: 'text-amber-600 dark:text-amber-400',
    popularTopics: ['Keberagaman Alam Indonesia', 'Interaksi Sosial', 'Kerajaan Nusantara', 'Perubahan Sosial Budaya', 'Perdagangan Internasional'],
    popularTopicsByLevel: {
      'Kelas 7': [
        'Keberagaman Alam Indonesia & Letak Astronomis',
        'Sosialisasi & Interaksi Sosial',
        'Awal Kehidupan Manusia Praaksara',
        'Keberagaman Lingkungan Sekitar',
        'Kegiatan Ekonomi Dasar & Kebutuhan'
      ],
      'Kelas 8': [
        'Keragaman Alam & Pembangunan Wilayah ASEAN',
        'Pluralitas & Mobilitas Sosial Masyarakat',
        'Konflik & Integrasi Sosial',
        'Kerajaan Hindu-Buddha & Islam di Nusantara',
        'Masa Penjajahan Bangsa Barat & Perlawanan Daerah'
      ],
      'Kelas 9': [
        'Perubahan Sosial Budaya & Modernisasi',
        'Perdagangan Internasional & Pasar Bebas',
        'Perang Dunia II & Pendudukan Jepang',
        'Proklamasi Kemerdekaan & Perjuangan Fisik/Diplomasi',
        'Kerjasama Internasional & Globalisasi'
      ],
      'SMP/MTs': [
        'Interaksi Antarruang Negara ASEAN',
        'Kegiatan Ekonomi & Pasar',
        'Pluralitas & Interaksi Sosial',
        'Perubahan Sosial Budaya & Modernisasi',
        'Kerajaan Nusantara & Kemerdekaan RI'
      ]
    },
  },
  {
    id: 'bahasa-indonesia',
    name: 'Bahasa Indonesia',
    icon: '🇮🇩',
    category: 'bahasa',
    description: 'Literasi, tata bahasa, jenis teks (Deskripsi, LHO, Eksplanasi, Diskusi), apresiasi sastra, dan EYD V.',
    gradient: 'from-red-500 to-rose-600',
    badgeBg: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    textColor: 'text-red-600 dark:text-red-400',
    popularTopics: ['Teks Laporan Hasil Observasi', 'Teks Eksplanasi', 'Teks Puisi & Pantun', 'Surat Pribadi & Dinas', 'Teks Diskusi & Argumentasi'],
    popularTopicsByLevel: {
      'Kelas 7': [
        'Teks Deskripsi (Keindahan Alam & Objek)',
        'Teks Cerita Fantasi & Narasi',
        'Teks Prosedur (Panduan Membuat/Melakukan)',
        'Teks Laporan Hasil Observasi (LHO)',
        'Puisi Rakyat (Pantun, Gurindam, Syair)',
        'Surat Pribadi & Surat Dinas'
      ],
      'Kelas 8': [
        'Teks Laporan Hasil Observasi (LHO) Lanjutan',
        'Teks Iklan, Slogan & Poster',
        'Teks Eksposisi & Artikel Ilmiah Populer',
        'Teks Puisi Modern',
        'Teks Eksplanasi Fenomena Alam & Sosial',
        'Teks Ulasan Buku & Karya Seni'
      ],
      'Kelas 9': [
        'Teks Laporan Percobaan Sains',
        'Teks Pidato Persuasif',
        'Teks Cerita Pendek (Cerpen)',
        'Teks Tanggapan Kritis',
        'Teks Diskusi (Pro & Kontra)',
        'Teks Cerita Inspiratif'
      ],
      'SMP/MTs': [
        'Teks Laporan Hasil Observasi (LHO)',
        'Teks Deskripsi & Cerpen',
        'Teks Prosedur & Eksplanasi',
        'Teks Iklan, Slogan & Poster',
        'Teks Tanggapan, Diskusi & Argumentasi'
      ]
    },
  },
  {
    id: 'bahasa-inggris',
    name: 'Bahasa Inggris',
    icon: '🇬🇧',
    category: 'bahasa',
    description: 'Grammar, vocabulary, reading comprehension, text genres, and everyday conversation for SMP/MTs.',
    gradient: 'from-cyan-500 to-blue-600',
    badgeBg: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    popularTopics: ['Simple Present & Past Tense', 'Descriptive & Recount Text', 'Asking & Giving Opinion', 'Degrees of Comparison', 'Procedure & Narrative Text'],
    popularTopicsByLevel: {
      'Kelas 7': [
        'Self-Introduction, Greetings & Farewells',
        'Family Members, Hobbies & Daily Routines',
        'Descriptive Text (People, Animals, Objects)',
        'Telling Time, Days, Months & Dates',
        'Expressing Gratitude & Apology',
        'Classroom Commands & Instructions'
      ],
      'Kelas 8': [
        'Recount Text (Personal Experience & Holiday)',
        'Procedure Text (Recipes & User Guides)',
        'Expressing Ability & Willingness (Can, Will)',
        'Asking & Giving Permission / Opinion',
        'Notice, Caution & Warning Signs',
        'Greeting Cards & Invitations'
      ],
      'Kelas 9': [
        'Narrative Text (Fables, Myths & Folktales)',
        'Information Report Text',
        'Passive Voice in Context',
        'Conditional Sentences Type 1',
        'Expressing Hopes, Wishes & Congratulating',
        'Present Perfect Tense & Continuous Tenses'
      ],
      'SMP/MTs': [
        'Descriptive Text (People & Places)',
        'Recount & Procedure Text',
        'Narrative Text & Passive Voice',
        'Simple Present, Past & Future Tenses',
        'Expressing Agreement & Opinion'
      ]
    },
  },
  {
    id: 'pendidikan-agama',
    name: 'Pendidikan Agama (PAI)',
    icon: '🕌',
    category: 'umum',
    description: 'Nilai-nilai spiritual, akhlak mulia, fikih, sejarah peradaban Islam, dan toleransi SMP/MTs.',
    gradient: 'from-teal-500 to-emerald-700',
    badgeBg: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    textColor: 'text-teal-600 dark:text-teal-400',
    popularTopics: ['Akhlak Terpuji', 'Sejarah Peradaban Islam', 'Zakat, Infak & Sedekah', 'Toleransi & Moderasi Beragama', 'Kitab-Kitab Allah'],
    popularTopicsByLevel: {
      'Kelas 7': [
        'Al-Qur\'an & Hadis: Toleransi & Menuntut Ilmu',
        'Aqidah: Asmaul Husna & Iman kepada Allah',
        'Fikih Thaharah (Bersuci dari Hadas & Najis)',
        'Fikih Salat Fardhu & Salat Berjamaah',
        'Sejarah Perjuangan Nabi Muhammad SAW Periode Makkah'
      ],
      'Kelas 8': [
        'Al-Qur\'an: Rendah Hati, Hemat & Sederhana',
        'Aqidah: Iman kepada Kitab-Kitab Allah',
        'Akhlak Terpuji (Jujur, Menepati Janji, Cerdas)',
        'Fikih Salat Sunnah, Sujud Syukur & Tilawah',
        'Fikih Puasa & Zakat',
        'Sejarah Kejayaan Peradaban Islam Daulah Abbasiyah'
      ],
      'Kelas 9': [
        'Al-Qur\'an: Optimis, Ikhtiar & Tawakal',
        'Aqidah: Iman kepada Hari Akhir & Qada/Qadar',
        'Akhlak Mulia (Santun, Malu, Menghormati Guru)',
        'Fikih Zakat Fitrah/Mal, Haji & Umrah',
        'Penyembelihan Hewan Qurban & Aqiqah',
        'Sejarah Islam di Nusantara & Peran Wali Songo'
      ],
      'SMP/MTs': [
        'Aqidah: Iman kepada Allah, Kitab & Hari Akhir',
        'Akhlak Terpuji (Jujur, Amanah, Istiqamah)',
        'Fikih Thaharah, Salat & Zakat',
        'Sejarah Peradaban Islam & Wali Songo',
        'Toleransi & Moderasi Beragama'
      ]
    },
  },
  {
    id: 'informatika',
    name: 'Informatika',
    icon: '💻',
    category: 'mipa',
    description: 'Berpikir komputasional, algoritma & flowchart, pemrograman Scratch/Python, jaringan, dan analisis data SMP/MTs.',
    gradient: 'from-violet-500 to-purple-600',
    badgeBg: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    textColor: 'text-violet-600 dark:text-violet-400',
    popularTopics: ['Berpikir Komputasional & Flowchart', 'Pemrograman Scratch & Python', 'Jaringan Komputer & Internet', 'Analisis Data Spreadsheet', 'Etika & Dampak Sosial'],
    popularTopicsByLevel: {
      'Kelas 7': [
        'Berpikir Komputasional & Algoritma Sederhana',
        'Teknologi Informasi & Komunikasi (Hardware & Software)',
        'Sistem Komputer & Landasan Informatika',
        'Pemrograman Visual Scratch',
        'Analisis Data Spreadsheet Dasar',
        'Etika & Dampak Sosial Informatika'
      ],
      'Kelas 8': [
        'Berpikir Komputasional (Dekomposisi & Abstraksi)',
        'Jaringan Komputer & Internet (LAN, Wi-Fi, IP)',
        'Analisis Data (Fungsi Logika & Lookup Excel)',
        'Pemrograman Blok Lanjutan',
        'Keamanan Informasi & Etika Digital'
      ],
      'Kelas 9': [
        'Berpikir Komputasional (Algoritma Kompleks & Pattern Recognition)',
        'Pemrograman Teks Dasar (Python / HTML & CSS)',
        'Struktur Data & Basis Data Sederhana',
        'Keamanan Siber & Proteksi Data Pribadi',
        'Praktik Lintas Bidang (Projek Digital)'
      ],
      'SMP/MTs': [
        'Berpikir Komputasional & Flowchart',
        'Algoritma & Pemrograman Block/Python',
        'Jaringan Komputer & Internet',
        'Analisis Data Spreadsheet',
        'Keamanan Siber & Dampak Sosial'
      ]
    },
  },
  {
    id: 'sejarah',
    name: 'Sejarah',
    icon: '📜',
    category: 'sosial',
    description: 'Masa praaksara, kerajaan Nusantara, kolonialisme, pergerakan nasional, dan kemerdekaan RI.',
    gradient: 'from-amber-700 to-yellow-800',
    badgeBg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
    textColor: 'text-yellow-700 dark:text-yellow-400',
    popularTopics: ['Kerajaan Hindu-Buddha & Islam', 'Kolonialisme & Penjajahan Barat', 'Kebangkitan Nasional & Sumpah Pemuda', 'Pendudukan Jepang', 'Proklamasi Kemerdekaan 1945'],
    popularTopicsByLevel: {
      'Kelas 7': [
        'Masa Praaksara & Kehidupan Manusia Purba',
        'Asal-Usul Nenek Moyang Bangsa Indonesia',
        'Kebudayaan Megalitikum & Dongson di Nusantara'
      ],
      'Kelas 8': [
        'Kerajaan-Kerajaan Hindu-Buddha (Kutai, Sriwijaya, Majapahit)',
        'Kerajaan-Kerajaan Islam (Samudera Pasai, Demak, Mataram)',
        'Masa Penjajahan Bangsa Barat & Perlawanan Daerah'
      ],
      'Kelas 9': [
        'Kebangkitan Nasional 1908 & Sumpah Pemuda 1928',
        'Pendudukan Jepang & Pembentukan BPUPKI/PPKI',
        'Proklamasi Kemerdekaan 17 Agustus 1945',
        'Perjuangan Fisik & Diplomasi Mempertahankan NKRI'
      ],
      'SMP/MTs': [
        'Masa Praaksara & Nenek Moyang',
        'Kerajaan Hindu-Buddha & Islam',
        'Kolonialisme & Perlawanan Daerah',
        'Kebangkitan Nasional & Sumpah Pemuda',
        'Proklamasi Kemerdekaan 1945'
      ]
    },
  },
  {
    id: 'geografi',
    name: 'Geografi',
    icon: '🌍',
    category: 'sosial',
    description: 'Peta, kondisi fisik kebumian, dinamika penduduk, sumber daya alam, dan mitigasi bencana.',
    gradient: 'from-sky-500 to-indigo-600',
    badgeBg: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
    textColor: 'text-sky-600 dark:text-sky-400',
    popularTopics: ['Peta & Pemetaan Dasar', 'Kondisi Alam & Iklim Indonesia', 'Dinamika Penduduk & Migrasi', 'Sumber Daya Alam', 'Mitigasi Bencana Alam'],
    popularTopicsByLevel: {
      'Kelas 7': [
        'Konsep Ruang & Keberagaman Alam Indonesia',
        'Peta, Peta Tematik, Atlas & Globe',
        'Kondisi Iklim & Musim di Indonesia'
      ],
      'Kelas 8': [
        'Kondisi Fisik & Geologis Negara-Negara ASEAN',
        'Pengelolaan Sumber Daya Alam (SDA) Berkelanjutan',
        'Bencana Alam (Gempa, Tsunami, Erupsi) & Mitigasi'
      ],
      'Kelas 9': [
        'Dinamika Penduduk & Angka Kelahiran/Kematian',
        'Interaksi Spasial Antarwilayah & Perubahan Lahan',
        'Karakteristik Benua-Benua di Dunia'
      ],
      'SMP/MTs': [
        'Peta & Kondisi Alam Indonesia',
        'Kondisi Fisik Negara ASEAN',
        'Dinamika Penduduk & Migrasi',
        'Pengelolaan SDA & Mitigasi Bencana'
      ]
    },
  },
  {
    id: 'kimia',
    name: 'Kimia',
    icon: '🧪',
    category: 'mipa',
    description: 'Materi, unsur, senyawa, campuran, asam-basa, larutan, dan reaksi kimia sederhana SMP/MTs.',
    gradient: 'from-fuchsia-500 to-pink-600',
    badgeBg: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300',
    textColor: 'text-fuchsia-600 dark:text-fuchsia-400',
    popularTopics: ['Unsur, Senyawa & Campuran', 'Asam, Basa & Garam', 'Pemisahan Campuran', 'Atom, Molekul & Ion', 'Reaksi Kimia Sederhana'],
    popularTopicsByLevel: {
      'Kelas 7': [
        'Klasifikasi Materi: Unsur, Senyawa & Campuran',
        'Perubahan Fisika vs Perubahan Kimia',
        'Sifat Larutan Asam, Basa & Garam'
      ],
      'Kelas 8': [
        'Pemisahan Campuran (Filtrasi, Distilasi, Kromatografi)',
        'Atom, Molekul & Partikel Subatom',
        'Zat Aditif & Adiktif dalam Makanan'
      ],
      'Kelas 9': [
        'Reaksi Kimia Sederhana & Persamaan Reaksi',
        'Sifat Bahan & Penggunaannya dalam Kehidupan',
        'Proses Kimia Ramah Lingkungan (Green Chemistry)'
      ],
      'SMP/MTs': [
        'Unsur, Senyawa & Campuran',
        'Asam, Basa, Garam & Indikator pH',
        'Pemisahan Campuran & Pemurnian',
        'Atom, Molekul & Ion'
      ]
    },
  },
  {
    id: 'fisika',
    name: 'Fisika',
    icon: '⚛️',
    category: 'mipa',
    description: 'Pengukuran, gerak, gaya, suhu, kalor, tekanan, gelombang, cahaya, dan kelistrikan SMP/MTs.',
    gradient: 'from-blue-600 to-cyan-600',
    badgeBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    popularTopics: ['Suhu, Kalor & Pemuaian', 'Gaya & Hukum Newton', 'Tekanan Zat & Hidrostatis', 'Gelombang, Bunyi & Optik', 'Hukum Ohm & Rangkaian Listrik'],
    popularTopicsByLevel: {
      'Kelas 7': [
        'Pengukuran, Besaran & Satuan SI',
        'Suhu, Skala Termometer & Pemuaian',
        'Kalor & Perpindahan Kalor',
        'Gaya, Gerak Lurus (GLB & GLBB) & Hukum Newton'
      ],
      'Kelas 8': [
        'Usaha, Energi Mekanik & Pesawat Sederhana',
        'Tekanan Zat Padat, Cair (Hidrostatis, Archimedes) & Gas',
        'Getaran, Gelombang & Bunyi',
        'Cahaya, Cermin, Lensa & Alat Optik'
      ],
      'Kelas 9': [
        'Listrik Statis & Hukum Coulomb',
        'Listrik Dinamis (Hukum Ohm, Rangkaian Seri/Paralel)',
        'Kemagnetan, Benda Magnetik & Elektromagnetik',
        'Induksi Elektromagnetik & Transformator'
      ],
      'SMP/MTs': [
        'Besaran, Pengukuran & Suhu',
        'Gaya, Gerak & Hukum Newton',
        'Tekanan Zat & Pesawat Sederhana',
        'Gelombang, Bunyi & Optik',
        'Listrik Statis, Dinamis & Magnet'
      ]
    },
  },
  {
    id: 'biologi',
    name: 'Biologi',
    icon: '🧬',
    category: 'mipa',
    description: 'Organisasi kehidupan, sistem organ manusia, jaringan tumbuhan, ekosistem, dan genetika SMP/MTs.',
    gradient: 'from-green-500 to-emerald-600',
    badgeBg: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    textColor: 'text-green-600 dark:text-green-400',
    popularTopics: ['Sistem Organ Manusia', 'Fotosintesis & Respirasi Tumbuhan', 'Ekosistem & Bioma', 'Pewarisan Sifat (Hukum Mendel)', 'Bioteknologi Pangan'],
    popularTopicsByLevel: {
      'Kelas 7': [
        'Organisasi Kehidupan: Sel, Jaringan, Organ & Sistem Organ',
        'Klasifikasi Makhluk Hidup (Kingdom)',
        'Ekosistem, Rantai Makanan & Pencemaran Lingkungan'
      ],
      'Kelas 8': [
        'Struktur & Fungsi Jaringan Tumbuhan serta Fotosintesis',
        'Sistem Pencernaan & Peredaran Darah Manusia',
        'Sistem Pernapasan & Ekskresi Manusia',
        'Sistem Gerak pada Manusia & Tumbuhan'
      ],
      'Kelas 9': [
        'Sistem Reproduksi Manusia & Penyakit Menular',
        'Perkembangbiakan Vegetatif & Generatif Tumbuhan/Hewan',
        'Pewarisan Sifat, Gen, Kromosom & Hukum Mendel',
        'Bioteknologi Pangan (Tempe, Yoghurt, Tapai)'
      ],
      'SMP/MTs': [
        'Sel, Jaringan & Klasifikasi Makhluk Hidup',
        'Sistem Organ Manusia',
        'Jaringan Tumbuhan & Fotosintesis',
        'Ekosistem & Interaksi Lingkungan',
        'Pewarisan Sifat & Bioteknologi'
      ]
    },
  },
  {
    id: 'ekonomi',
    name: 'Ekonomi',
    icon: '💹',
    category: 'sosial',
    description: 'Kebutuhan & skala prioritas, kegiatan ekonomi, mekanisme pasar, uang & bank, kewirausahaan SMP/MTs.',
    gradient: 'from-emerald-600 to-teal-700',
    badgeBg: 'bg-lime-100 text-lime-800 dark:bg-lime-900/40 dark:text-lime-300',
    textColor: 'text-lime-700 dark:text-lime-400',
    popularTopics: ['Kelangkaan & Skala Prioritas', 'Kegiatan Ekonomi & Pasar', 'Permintaan, Penawaran & Harga', 'Uang & Lembaga Keuangan', 'Kewirausahaan & Ekonomi Kreatif'],
    popularTopicsByLevel: {
      'Kelas 7': [
        'Kebutuhan Manusia, Kelangkaan & Skala Prioritas',
        'Kegiatan Ekonomi: Produksi, Distribusi & Konsumsi',
        'Pasar & Pembentukan Harga Keseimbangan'
      ],
      'Kelas 8': [
        'Peran Uang, Lembaga Keuangan Bank & Non-Bank',
        'Permintaan, Penawaran & Pasar Dalam Negeri',
        'Kewirausahaan & Ekonomi Kreatif'
      ],
      'Kelas 9': [
        'Perdagangan Internasional, Ekspor & Impor',
        'Pasar Bebas & Kerjasama Ekonomi Antarnegara',
        'Uang Digital, Fintech & Transaksi Modern'
      ],
      'SMP/MTs': [
        'Kebutuhan, Kelangkaan & Skala Prioritas',
        'Kegiatan Ekonomi: Produksi, Distribusi & Konsumsi',
        'Pasar, Uang & Lembaga Keuangan',
        'Perdagangan Internasional & Kewirausahaan'
      ]
    },
  },
  {
    id: 'ppkn',
    name: 'PPKn',
    icon: '📖',
    category: 'umum',
    description: 'Pancasila, UUD NRI 1945, norma & hukum, Bhinneka Tunggal Ika, Kebangkitan Nasional, otonomi daerah SMP/MTs.',
    gradient: 'from-red-600 to-amber-600',
    badgeBg: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    textColor: 'text-rose-600 dark:text-rose-400',
    popularTopics: ['Pancasila sebagai Dasar Negara', 'UUD NRI 1945 & Perundang-undangan', 'Norma & Kebijakan Hukum', 'Bhinneka Tunggal Ika', 'Kebangkitan Nasional & Sumpah Pemuda'],
    popularTopicsByLevel: {
      'Kelas 7': [
        'Perumusan & Penetapan Pancasila sebagai Dasar Negara',
        'Norma & Keadilan dalam Masyarakat',
        'Perumusan UUD NRI Tahun 1945',
        'Keberagaman Suku, Agama, Ras & Antargolongan (SARA)'
      ],
      'Kelas 8': [
        'Kedudukan & Fungsi Pancasila bagi Bangsa',
        'Menumbuhkan Kesadaran terhadap UUD NRI 1945',
        'Tata Urutan Peraturan Perundang-undangan',
        'Sumpah Pemuda 1928 & Kebangkitan Nasional'
      ],
      'Kelas 9': [
        'Dinamika Perwujudan Pancasila sebagai Dasar Negara',
        'Pokok-Pokok Pikiran Pembukaan UUD NRI 1945',
        'Kedaulatan Rakyat dalam Sistem Pemerintahan Indonesia',
        'Harmoni Keberagaman Masyarakat & Kebinekaan'
      ],
      'SMP/MTs': [
        'Pancasila sebagai Dasar Negara',
        'UUD NRI Tahun 1945 & Perundang-undangan',
        'Norma & Keadilan Masyarakat',
        'Bhinneka Tunggal Ika & Sumpah Pemuda',
        'Kedaulatan Rakyat & Kebinekaan'
      ]
    },
  },
];

export function getSubjectTopics(subject: Subject, level: EducationLevel): string[] {
  if (!subject.popularTopicsByLevel) return subject.popularTopics;

  const lvlStr = String(level).trim();

  // Direct exact match
  if (subject.popularTopicsByLevel[lvlStr]) {
    return subject.popularTopicsByLevel[lvlStr]!;
  }

  const upper = lvlStr.toUpperCase();

  // Match Kelas 7
  if (upper.includes('7') || upper.includes('VII')) {
    return (
      subject.popularTopicsByLevel['Kelas 7'] ||
      subject.popularTopicsByLevel['Kelas 7 (SMP/MTs)'] ||
      subject.popularTopicsByLevel['SMP/MTs'] ||
      subject.popularTopicsByLevel.SMP ||
      subject.popularTopics
    );
  }

  // Match Kelas 8
  if (upper.includes('8') || upper.includes('VIII')) {
    return (
      subject.popularTopicsByLevel['Kelas 8'] ||
      subject.popularTopicsByLevel['Kelas 8 (SMP/MTs)'] ||
      subject.popularTopicsByLevel['SMP/MTs'] ||
      subject.popularTopicsByLevel.SMP ||
      subject.popularTopics
    );
  }

  // Match Kelas 9
  if (upper.includes('9') || upper.includes('IX')) {
    return (
      subject.popularTopicsByLevel['Kelas 9'] ||
      subject.popularTopicsByLevel['Kelas 9 (SMP/MTs)'] ||
      subject.popularTopicsByLevel['SMP/MTs'] ||
      subject.popularTopicsByLevel.SMP ||
      subject.popularTopics
    );
  }

  return (
    subject.popularTopicsByLevel['SMP/MTs'] ||
    subject.popularTopicsByLevel.SMP ||
    subject.popularTopics
  );
}
