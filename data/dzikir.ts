// data/dzikir.ts
// Data dzikir lengkap

export interface DzikirItem {
  id: number;
  kategori: string;
  nama: string;
  arab: string;
  latin: string;
  arti: string;
  target: number;
  keutamaan?: string;
}

export interface DzikirKategori {
  id: string;
  nama: string;
  deskripsi: string;
  icon: string;
  warna: string;
  items: DzikirItem[];
}

export const dzikirKategori: DzikirKategori[] = [
  // ============ SETELAH SHALAT ============
  {
    id: 'setelah-shalat',
    nama: 'Dzikir Setelah Shalat',
    deskripsi: 'Sesuai sunnah Rasulullah ﷺ',
    icon: 'moon',
    warna: '#7C3AED',
    items: [
      {
        id: 1,
        kategori: 'setelah-shalat',
        nama: 'Istighfar',
        arab: 'أَسْتَغْفِرُ اللهَ',
        latin: 'Astaghfirullah',
        arti: 'Aku memohon ampun kepada Allah.',
        target: 3,
        keutamaan: 'Dibaca 3x setelah salam, memohon ampun atas kekurangan shalat.',
      },
      {
        id: 2,
        kategori: 'setelah-shalat',
        nama: 'Allahumma Antas Salam',
        arab: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
        latin: 'Allahumma antas-salam wa minkas-salam, tabarakta ya dzal-jalali wal-ikram',
        arti: 'Ya Allah, Engkau Maha Sejahtera, dan dari-Mu kesejahteraan. Maha Suci Engkau, wahai Pemilik keagungan dan kemuliaan.',
        target: 1,
      },
      {
        id: 3,
        kategori: 'setelah-shalat',
        nama: 'Tahlil Pembuka',
        arab: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        latin: 'La ilaha illallah wahdahu la syarika lah, lahul-mulku wa lahul-hamdu wa huwa ala kulli syai-in qadir',
        arti: 'Tidak ada Tuhan selain Allah, Yang Maha Esa, tiada sekutu bagi-Nya. Bagi-Nya kerajaan dan pujian. Dia Mahakuasa atas segala sesuatu.',
        target: 1,
      },
      {
        id: 4,
        kategori: 'setelah-shalat',
        nama: 'Tasbih',
        arab: 'سُبْحَانَ اللهِ',
        latin: 'Subhanallah',
        arti: 'Maha Suci Allah.',
        target: 33,
        keutamaan: 'Bagian dari 100 dzikir yang menghapus dosa.',
      },
      {
        id: 5,
        kategori: 'setelah-shalat',
        nama: 'Tahmid',
        arab: 'الْحَمْدُ لِلَّهِ',
        latin: 'Alhamdulillah',
        arti: 'Segala puji bagi Allah.',
        target: 33,
        keutamaan: 'Bagian dari 100 dzikir yang menghapus dosa.',
      },
      {
        id: 6,
        kategori: 'setelah-shalat',
        nama: 'Takbir',
        arab: 'اللهُ أَكْبَرُ',
        latin: 'Allahu Akbar',
        arti: 'Allah Maha Besar.',
        target: 33,
        keutamaan: 'Bagian dari 100 dzikir yang menghapus dosa.',
      },
      {
        id: 7,
        kategori: 'setelah-shalat',
        nama: 'Tahlil Penutup',
        arab: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        latin: 'La ilaha illallah wahdahu la syarika lah, lahul-mulku wa lahul-hamdu wa huwa ala kulli syai-in qadir',
        arti: 'Tidak ada Tuhan selain Allah, Yang Maha Esa, tiada sekutu bagi-Nya. Bagi-Nya kerajaan dan pujian. Dia Mahakuasa atas segala sesuatu.',
        target: 1,
        keutamaan: 'Menyempurnakan 100 dzikir, dosa diampuni walau sebanyak buih di lautan.',
      },
      {
        id: 8,
        kategori: 'setelah-shalat',
        nama: 'Ayat Kursi',
        arab: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ',
        latin: 'Allahu la ilaha illa huwal-hayyul-qayyum, la ta\'khudzuhu sinatuw wa la naum, lahu ma fis-samawati wa ma fil-ardh',
        arti: 'Allah, tidak ada Tuhan selain Dia, Yang Mahahidup, Yang terus-menerus mengurus (makhluk-Nya). Dia tidak mengantuk dan tidak tidur.',
        target: 1,
        keutamaan: 'Yang membaca Ayat Kursi setiap selesai shalat, tidak ada yang menghalanginya masuk surga selain kematian.',
      },
    ],
  },

  // ============ DZIKIR PAGI ============
  {
    id: 'pagi',
    nama: 'Dzikir Pagi',
    deskripsi: 'Setelah Subuh hingga terbit matahari',
    icon: 'sunny',
    warna: '#F59E0B',
    items: [
      {
        id: 101,
        kategori: 'pagi',
        nama: 'Ayat Kursi',
        arab: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ',
        latin: 'Allahu la ilaha illa huwal-hayyul-qayyum...',
        arti: 'Allah, tidak ada Tuhan selain Dia, Yang Mahahidup, Yang terus-menerus mengurus (makhluk-Nya).',
        target: 1,
      },
      {
        id: 102,
        kategori: 'pagi',
        nama: 'Sayyidul Istighfar',
        arab: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ',
        latin: 'Allahumma anta rabbi la ilaha illa anta, khalaqtani wa ana abduka...',
        arti: 'Ya Allah, Engkau adalah Tuhanku, tiada Tuhan selain Engkau. Engkau yang menciptakanku dan aku adalah hamba-Mu.',
        target: 1,
        keutamaan: 'Dibaca pagi, menjadi sebab masuk surga.',
      },
      {
        id: 103,
        kategori: 'pagi',
        nama: 'Doa Pagi',
        arab: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
        latin: 'Allahumma bika ashbahna, wa bika amsaina, wa bika nahya, wa bika namutu, wa ilaikan-nusyur',
        arti: 'Ya Allah, dengan-Mu kami memasuki waktu pagi, dengan-Mu kami memasuki waktu petang.',
        target: 1,
      },
      {
        id: 104,
        kategori: 'pagi',
        nama: 'Perlindungan',
        arab: 'بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
        latin: 'Bismillahil-ladzi la yadhurru ma\'asmihi syai-un fil-ardhi wa la fis-sama\'i',
        arti: 'Dengan nama Allah, yang tidak ada sesuatu pun yang dapat memberi bahaya bersama nama-Nya.',
        target: 3,
        keutamaan: 'Dibaca 3x, tidak ada bahaya yang menimpa hingga petang.',
      },
    ],
  },

  // ============ DZIKIR PETANG ============
  {
    id: 'petang',
    nama: 'Dzikir Petang',
    deskripsi: 'Setelah Ashar hingga Maghrib',
    icon: 'partly-sunny',
    warna: '#F97316',
    items: [
      {
        id: 201,
        kategori: 'petang',
        nama: 'Ayat Kursi',
        arab: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
        latin: 'Allahu la ilaha illa huwal-hayyul-qayyum...',
        arti: 'Allah, tidak ada Tuhan selain Dia, Yang Mahahidup, Yang terus-menerus mengurus (makhluk-Nya).',
        target: 1,
      },
      {
        id: 202,
        kategori: 'petang',
        nama: 'Sayyidul Istighfar',
        arab: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ',
        latin: 'Allahumma anta rabbi la ilaha illa anta, khalaqtani wa ana abduka...',
        arti: 'Ya Allah, Engkau adalah Tuhanku, tiada Tuhan selain Engkau.',
        target: 1,
      },
      {
        id: 203,
        kategori: 'petang',
        nama: 'Doa Petang',
        arab: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
        latin: 'Allahumma bika amsaina, wa bika ashbahna, wa bika nahya, wa bika namutu, wa ilaikal-mashir',
        arti: 'Ya Allah, dengan-Mu kami memasuki waktu petang, dengan-Mu kami memasuki waktu pagi.',
        target: 1,
      },
      {
        id: 204,
        kategori: 'petang',
        nama: 'Perlindungan',
        arab: 'بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ',
        latin: 'Bismillahil-ladzi la yadhurru ma\'asmihi syai-un fil-ardhi wa la fis-sama\'i',
        arti: 'Dengan nama Allah, yang tidak ada sesuatu pun yang dapat memberi bahaya bersama nama-Nya.',
        target: 3,
      },
    ],
  },

  // ============ DZIKIR HARIAN ============
  {
    id: 'harian',
    nama: 'Dzikir Harian',
    deskripsi: 'Dzikir ringan kapan saja',
    icon: 'sparkles',
    warna: '#10B981',
    items: [
      {
        id: 301,
        kategori: 'harian',
        nama: 'Tasbih Ringan',
        arab: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ',
        latin: 'Subhanallahi wa bihamdih',
        arti: 'Maha Suci Allah, aku memuji-Nya.',
        target: 100,
        keutamaan: 'Dibaca 100x sehari, dosa dihapus walau sebanyak buih di lautan.',
      },
      {
        id: 302,
        kategori: 'harian',
        nama: 'Tasbih Berat',
        arab: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ، سُبْحَانَ اللهِ الْعَظِيمِ',
        latin: 'Subhanallahi wa bihamdih, subhanallahil-azhim',
        arti: 'Maha Suci Allah, aku memuji-Nya. Maha Suci Allah Yang Maha Agung.',
        target: 33,
        keutamaan: 'Dua kalimat ringan di lisan, berat di timbangan.',
      },
      {
        id: 303,
        kategori: 'harian',
        nama: 'Istighfar',
        arab: 'أَسْتَغْفِرُ اللهَ الْعَظِيمَ',
        latin: 'Astaghfirullahal-azhim',
        arti: 'Aku memohon ampun kepada Allah Yang Maha Agung.',
        target: 100,
      },
      {
        id: 304,
        kategori: 'harian',
        nama: 'Shalawat',
        arab: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
        latin: 'Allahumma shalli ala Muhammad wa ala ali Muhammad',
        arti: 'Ya Allah, limpahkanlah shalawat kepada Nabi Muhammad dan keluarganya.',
        target: 100,
        keutamaan: 'Yang bershalawat 1x, Allah bershalawat 10x untuknya.',
      },
      {
        id: 305,
        kategori: 'harian',
        nama: 'Tahlil',
        arab: 'لَا إِلَهَ إِلَّا اللهُ',
        latin: 'La ilaha illallah',
        arti: 'Tidak ada Tuhan selain Allah.',
        target: 100,
        keutamaan: 'Dzikir paling utama.',
      },
    ],
  },
];

export function getDzikirKategori(id: string): DzikirKategori | undefined {
  return dzikirKategori.find((k) => k.id === id);
}