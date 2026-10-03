export interface Doa {
  id: number;
  kategori: string;
  judul: string;
  arab: string;
  latin: string;
  arti: string;
}

export const doaList: Doa[] = [
  { id: 1, kategori: 'Bangun Tidur', judul: 'Doa Bangun Tidur', arab: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', latin: 'Alhamdulillahil ladzi ahyana ba\'da ma amatana wa ilaihin nusyur', arti: 'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan kepada-Nya kami dibangkitkan.' },
  { id: 2, kategori: 'Sebelum Tidur', judul: 'Doa Sebelum Tidur', arab: 'بِسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', latin: 'Bismika Allahumma amutu wa ahya', arti: 'Dengan nama-Mu ya Allah aku mati dan aku hidup.' },
  { id: 3, kategori: 'Sebelum Makan', judul: 'Doa Sebelum Makan', arab: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', latin: 'Bismillahirrahmanirrahim', arti: 'Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang.' },
  { id: 4, kategori: 'Setelah Makan', judul: 'Doa Setelah Makan', arab: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ', latin: 'Alhamdulillahil ladzi ath\'amana wa saqana wa ja\'alana muslimin', arti: 'Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami muslim.' },
  { id: 5, kategori: 'Keluar Rumah', judul: 'Doa Keluar Rumah', arab: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', latin: 'Bismillahi tawakkaltu \'alallah, wa la haula wa la quwwata illa billah', arti: 'Dengan nama Allah aku bertawakal kepada Allah, tiada daya dan kekuatan kecuali dengan pertolongan Allah.' },
  { id: 6, kategori: 'Masuk Rumah', judul: 'Doa Masuk Rumah', arab: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلَجِ وَخَيْرَ الْمَخْرَجِ', latin: 'Allahumma inni as\'aluka khairal maulaji wa khairal makhraji', arti: 'Ya Allah, aku memohon kepada-Mu sebaik-baik tempat masuk dan sebaik-baik tempat keluar.' },
  { id: 7, kategori: 'Perjalanan', judul: 'Doa Naik Kendaraan', arab: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ', latin: 'Subhanal ladzi sakhkhara lana hadza wa ma kunna lahu muqrinin', arti: 'Maha Suci Allah yang telah menundukkan kendaraan ini untuk kami, padahal kami sebelumnya tidak mampu menguasainya.' },
  { id: 8, kategori: 'Masuk Masjid', judul: 'Doa Masuk Masjid', arab: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ', latin: 'Allahummaftah li abwaba rahmatik', arti: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.' },
  { id: 9, kategori: 'Keluar Masjid', judul: 'Doa Keluar Masjid', arab: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ', latin: 'Allahumma inni as\'aluka min fadhlik', arti: 'Ya Allah, aku memohon kepada-Mu dari karunia-Mu.' },
  { id: 10, kategori: 'Kesehatan', judul: 'Doa Memohon Kesehatan', arab: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي', latin: 'Allahumma \'afini fi badani', arti: 'Ya Allah, sehatkanlah badanku.' },
];