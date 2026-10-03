// ===== IMPORTS =====
import { loadSurahData } from '../data/quran/surahIndex';

// ===== TYPES =====
export interface Ayah {
  id: number;
  surah_id: number;
  ayah: number;
  juz: number;
  arabic: string;
  latin: string;
  translation: string;
  footnotes?: string | null;
  surah: SurahInfo;
}

export interface SurahInfo {
  id: number;
  arabic: string;
  latin: string;
  transliteration: string;
  translation: string;
  num_ayah: number;
  location: string;
}

export interface SurahDetail {
  surah: SurahInfo;
  ayahs: Ayah[];
}

// ===== DAFTAR 114 SURAH (metadata) =====
export const surahList = [
  { id: 1, arabic: 'الفاتحة', latin: 'Al-Fātiḥah', transliteration: 'Al-Fatihah', translation: 'Pembuka', num_ayah: 7, location: 'Makkiyah' },
  { id: 2, arabic: 'البقرة', latin: 'Al-Baqarah', transliteration: 'Al-Baqarah', translation: 'Sapi', num_ayah: 286, location: 'Madaniyah' },
  { id: 3, arabic: 'اٰل عمران', latin: 'Āli ‘Imrān', transliteration: 'Ali Imran', translation: 'Keluarga Imran', num_ayah: 200, location: 'Madaniyah' },
  { id: 4, arabic: 'النساء', latin: 'An-Nisā’', transliteration: 'An-Nisa', translation: 'Perempuan', num_ayah: 176, location: 'Madaniyah' },
  { id: 5, arabic: 'المائدة', latin: 'Al-Mā’idah', transliteration: 'Al-Maidah', translation: 'Hidangan', num_ayah: 120, location: 'Madaniyah' },
  { id: 6, arabic: 'الأنعام', latin: 'Al-An‘ām', transliteration: 'Al-Anam', translation: 'Binatang Ternak', num_ayah: 165, location: 'Makkiyah' },
  { id: 7, arabic: 'الأعراف', latin: 'Al-A‘rāf', transliteration: 'Al-Araf', translation: 'Tempat Tertinggi', num_ayah: 206, location: 'Makkiyah' },
  { id: 8, arabic: 'الأنفال', latin: 'Al-Anfāl', transliteration: 'Al-Anfal', translation: 'Harta Rampasan', num_ayah: 75, location: 'Madaniyah' },
  { id: 9, arabic: 'التوبة', latin: 'At-Taubah', transliteration: 'At-Taubah', translation: 'Pengampunan', num_ayah: 129, location: 'Madaniyah' },
  { id: 10, arabic: 'يونس', latin: 'Yūnus', transliteration: 'Yunus', translation: 'Nabi Yunus', num_ayah: 109, location: 'Makkiyah' },
  { id: 11, arabic: 'هود', latin: 'Hūd', transliteration: 'Hud', translation: 'Nabi Hud', num_ayah: 123, location: 'Makkiyah' },
  { id: 12, arabic: 'يوسف', latin: 'Yūsuf', transliteration: 'Yusuf', translation: 'Nabi Yusuf', num_ayah: 111, location: 'Makkiyah' },
  { id: 13, arabic: 'الرعد', latin: 'Ar-Ra‘d', transliteration: 'Ar-Rad', translation: 'Guruh', num_ayah: 43, location: 'Madaniyah' },
  { id: 14, arabic: 'ابراهيم', latin: 'Ibrāhīm', transliteration: 'Ibrahim', translation: 'Nabi Ibrahim', num_ayah: 52, location: 'Makkiyah' },
  { id: 15, arabic: 'الحجر', latin: 'Al-Ḥijr', transliteration: 'Al-Hijr', translation: 'Bukit Berbatu', num_ayah: 99, location: 'Makkiyah' },
  { id: 16, arabic: 'النحل', latin: 'An-Naḥl', transliteration: 'An-Nahl', translation: 'Lebah', num_ayah: 128, location: 'Makkiyah' },
  { id: 17, arabic: 'الإسراء', latin: 'Al-Isrā’', transliteration: 'Al-Isra', translation: 'Perjalanan Malam', num_ayah: 111, location: 'Makkiyah' },
  { id: 18, arabic: 'الكهف', latin: 'Al-Kahf', transliteration: 'Al-Kahf', translation: 'Gua', num_ayah: 110, location: 'Makkiyah' },
  { id: 19, arabic: 'مريم', latin: 'Maryam', transliteration: 'Maryam', translation: 'Maryam', num_ayah: 98, location: 'Makkiyah' },
  { id: 20, arabic: 'طه', latin: 'Ṭāhā', transliteration: 'Taha', translation: 'Ta Ha', num_ayah: 135, location: 'Makkiyah' },
  { id: 21, arabic: 'الأنبياء', latin: 'Al-Anbiyā’', transliteration: 'Al-Anbiya', translation: 'Nabi-Nabi', num_ayah: 112, location: 'Makkiyah' },
  { id: 22, arabic: 'الحج', latin: 'Al-Ḥajj', transliteration: 'Al-Hajj', translation: 'Haji', num_ayah: 78, location: 'Madaniyah' },
  { id: 23, arabic: 'المؤمنون', latin: 'Al-Mu’minūn', transliteration: 'Al-Mukminun', translation: 'Orang Mukmin', num_ayah: 118, location: 'Makkiyah' },
  { id: 24, arabic: 'النور', latin: 'An-Nūr', transliteration: 'An-Nur', translation: 'Cahaya', num_ayah: 64, location: 'Madaniyah' },
  { id: 25, arabic: 'الفرقان', latin: 'Al-Furqān', transliteration: 'Al-Furqan', translation: 'Pembeda', num_ayah: 77, location: 'Makkiyah' },
  { id: 26, arabic: 'الشعراء', latin: 'Asy-Syu‘arā’', transliteration: 'Asy-Syuara', translation: 'Penyair', num_ayah: 227, location: 'Makkiyah' },
  { id: 27, arabic: 'النمل', latin: 'An-Naml', transliteration: 'An-Naml', translation: 'Semut', num_ayah: 93, location: 'Makkiyah' },
  { id: 28, arabic: 'القصص', latin: 'Al-Qaṣaṣ', transliteration: 'Al-Qasas', translation: 'Kisah-Kisah', num_ayah: 88, location: 'Makkiyah' },
  { id: 29, arabic: 'العنكبوت', latin: 'Al-‘Ankabūt', transliteration: 'Al-Ankabut', translation: 'Laba-Laba', num_ayah: 69, location: 'Makkiyah' },
  { id: 30, arabic: 'الروم', latin: 'Ar-Rūm', transliteration: 'Ar-Rum', translation: 'Bangsa Romawi', num_ayah: 60, location: 'Makkiyah' },
  { id: 31, arabic: 'لقمان', latin: 'Luqmān', transliteration: 'Luqman', translation: 'Luqman', num_ayah: 34, location: 'Makkiyah' },
  { id: 32, arabic: 'السجدة', latin: 'As-Sajdah', transliteration: 'As-Sajdah', translation: 'Sujud', num_ayah: 30, location: 'Makkiyah' },
  { id: 33, arabic: 'الأحزاب', latin: 'Al-Aḥzāb', transliteration: 'Al-Ahzab', translation: 'Golongan Bersekutu', num_ayah: 73, location: 'Madaniyah' },
  { id: 34, arabic: 'سبإ', latin: 'Saba’', transliteration: 'Saba', translation: 'Kaum Saba', num_ayah: 54, location: 'Makkiyah' },
  { id: 35, arabic: 'فاطر', latin: 'Fāṭir', transliteration: 'Fatir', translation: 'Pencipta', num_ayah: 45, location: 'Makkiyah' },
  { id: 36, arabic: 'يٰس', latin: 'Yāsīn', transliteration: 'Yasin', translation: 'Ya Sin', num_ayah: 83, location: 'Makkiyah' },
  { id: 37, arabic: 'الصافات', latin: 'Aṣ-Ṣāffāt', transliteration: 'As-Saffat', translation: 'Barisan-Barisan', num_ayah: 182, location: 'Makkiyah' },
  { id: 38, arabic: 'ص', latin: 'Ṣād', transliteration: 'Sad', translation: 'Sad', num_ayah: 88, location: 'Makkiyah' },
  { id: 39, arabic: 'الزمر', latin: 'Az-Zumar', transliteration: 'Az-Zumar', translation: 'Rombongan', num_ayah: 75, location: 'Makkiyah' },
  { id: 40, arabic: 'غافر', latin: 'Gāfir', transliteration: 'Ghafir', translation: 'Yang Mengampuni', num_ayah: 85, location: 'Makkiyah' },
  { id: 41, arabic: 'فصلت', latin: 'Fuṣṣilat', transliteration: 'Fussilat', translation: 'Yang Dijelaskan', num_ayah: 54, location: 'Makkiyah' },
  { id: 42, arabic: 'الشورى', latin: 'Asy-Syūrā', transliteration: 'Asy-Syura', translation: 'Musyawarah', num_ayah: 53, location: 'Makkiyah' },
  { id: 43, arabic: 'الزخرف', latin: 'Az-Zukhruf', transliteration: 'Az-Zukhruf', translation: 'Perhiasan', num_ayah: 89, location: 'Makkiyah' },
  { id: 44, arabic: 'الدخان', latin: 'Ad-Dukhān', transliteration: 'Ad-Dukhan', translation: 'Kabut', num_ayah: 59, location: 'Makkiyah' },
  { id: 45, arabic: 'الجاثية', latin: 'Al-Jāṡiyah', transliteration: 'Al-Jatsiyah', translation: 'Yang Berlutut', num_ayah: 37, location: 'Makkiyah' },
  { id: 46, arabic: 'الأحقاف', latin: 'Al-Aḥqāf', transliteration: 'Al-Ahqaf', translation: 'Bukit Pasir', num_ayah: 35, location: 'Makkiyah' },
  { id: 47, arabic: 'محمد', latin: 'Muḥammad', transliteration: 'Muhammad', translation: 'Nabi Muhammad', num_ayah: 38, location: 'Madaniyah' },
  { id: 48, arabic: 'الفتح', latin: 'Al-Fatḥ', transliteration: 'Al-Fath', translation: 'Kemenangan', num_ayah: 29, location: 'Madaniyah' },
  { id: 49, arabic: 'الحجرات', latin: 'Al-Ḥujurāt', transliteration: 'Al-Hujurat', translation: 'Kamar-Kamar', num_ayah: 18, location: 'Madaniyah' },
  { id: 50, arabic: 'ق', latin: 'Qāf', transliteration: 'Qaf', translation: 'Qaf', num_ayah: 45, location: 'Makkiyah' },
  { id: 51, arabic: 'الذاريات', latin: 'Aż-Żāriyāt', transliteration: 'Az-Zariyat', translation: 'Angin Menerbangkan', num_ayah: 60, location: 'Makkiyah' },
  { id: 52, arabic: 'الطور', latin: 'Aṭ-Ṭūr', transliteration: 'At-Tur', translation: 'Bukit Tursina', num_ayah: 49, location: 'Makkiyah' },
  { id: 53, arabic: 'النجم', latin: 'An-Najm', transliteration: 'An-Najm', translation: 'Bintang', num_ayah: 62, location: 'Makkiyah' },
  { id: 54, arabic: 'القمر', latin: 'Al-Qamar', transliteration: 'Al-Qamar', translation: 'Bulan', num_ayah: 55, location: 'Makkiyah' },
  { id: 55, arabic: 'الرحمن', latin: 'Ar-Raḥmān', transliteration: 'Ar-Rahman', translation: 'Yang Maha Pengasih', num_ayah: 78, location: 'Madaniyah' },
  { id: 56, arabic: 'الواقعة', latin: 'Al-Wāqi‘ah', transliteration: 'Al-Waqiah', translation: 'Hari Kiamat', num_ayah: 96, location: 'Makkiyah' },
  { id: 57, arabic: 'الحديد', latin: 'Al-Ḥadīd', transliteration: 'Al-Hadid', translation: 'Besi', num_ayah: 29, location: 'Madaniyah' },
  { id: 58, arabic: 'المجادلة', latin: 'Al-Mujādilah', transliteration: 'Al-Mujadilah', translation: 'Gugatan', num_ayah: 22, location: 'Madaniyah' },
  { id: 59, arabic: 'الحشر', latin: 'Al-Ḥasyr', transliteration: 'Al-Hasyr', translation: 'Pengusiran', num_ayah: 24, location: 'Madaniyah' },
  { id: 60, arabic: 'الممتحنة', latin: 'Al-Mumtaḥanah', transliteration: 'Al-Mumtahanah', translation: 'Yang Diuji', num_ayah: 13, location: 'Madaniyah' },
  { id: 61, arabic: 'الصف', latin: 'Aṣ-Ṣaff', transliteration: 'As-Saff', translation: 'Barisan', num_ayah: 14, location: 'Madaniyah' },
  { id: 62, arabic: 'الجمعة', latin: 'Al-Jumu‘ah', transliteration: 'Al-Jumuah', translation: 'Hari Jumat', num_ayah: 11, location: 'Madaniyah' },
  { id: 63, arabic: 'المنافقون', latin: 'Al-Munāfiqūn', transliteration: 'Al-Munafiqun', translation: 'Orang Munafik', num_ayah: 11, location: 'Madaniyah' },
  { id: 64, arabic: 'التغابن', latin: 'At-Tagābun', transliteration: 'At-Taghabun', translation: 'Hari Ditampakkan', num_ayah: 18, location: 'Madaniyah' },
  { id: 65, arabic: 'الطلاق', latin: 'Aṭ-Ṭalāq', transliteration: 'At-Talaq', translation: 'Talak', num_ayah: 12, location: 'Madaniyah' },
  { id: 66, arabic: 'التحريم', latin: 'At-Taḥrīm', transliteration: 'At-Tahrim', translation: 'Pengharaman', num_ayah: 12, location: 'Madaniyah' },
  { id: 67, arabic: 'الملك', latin: 'Al-Mulk', transliteration: 'Al-Mulk', translation: 'Kerajaan', num_ayah: 30, location: 'Makkiyah' },
  { id: 68, arabic: 'القلم', latin: 'Al-Qalam', transliteration: 'Al-Qalam', translation: 'Pena', num_ayah: 52, location: 'Makkiyah' },
  { id: 69, arabic: 'الحاقة', latin: 'Al-Ḥāqqah', transliteration: 'Al-Haqqah', translation: 'Hari Kiamat', num_ayah: 52, location: 'Makkiyah' },
  { id: 70, arabic: 'المعارج', latin: 'Al-Ma‘ārij', transliteration: 'Al-Maarij', translation: 'Tempat Naik', num_ayah: 44, location: 'Makkiyah' },
  { id: 71, arabic: 'نوح', latin: 'Nūḥ', transliteration: 'Nuh', translation: 'Nabi Nuh', num_ayah: 28, location: 'Makkiyah' },
  { id: 72, arabic: 'الجن', latin: 'Al-Jinn', transliteration: 'Al-Jinn', translation: 'Jin', num_ayah: 28, location: 'Makkiyah' },
  { id: 73, arabic: 'المزمل', latin: 'Al-Muzzammil', transliteration: 'Al-Muzzammil', translation: 'Berselimut', num_ayah: 20, location: 'Makkiyah' },
  { id: 74, arabic: 'المدثر', latin: 'Al-Muddas̄s̄ir', transliteration: 'Al-Muddatstsir', translation: 'Berkemul', num_ayah: 56, location: 'Makkiyah' },
  { id: 75, arabic: 'القيامة', latin: 'Al-Qiyāmah', transliteration: 'Al-Qiyamah', translation: 'Hari Kiamat', num_ayah: 40, location: 'Makkiyah' },
  { id: 76, arabic: 'الإنسان', latin: 'Al-Insān', transliteration: 'Al-Insan', translation: 'Manusia', num_ayah: 31, location: 'Madaniyah' },
  { id: 77, arabic: 'المرسلات', latin: 'Al-Mursalāt', transliteration: 'Al-Mursalat', translation: 'Malaikat Diutus', num_ayah: 50, location: 'Makkiyah' },
  { id: 78, arabic: 'النبأ', latin: 'An-Naba’', transliteration: 'An-Naba', translation: 'Berita Besar', num_ayah: 40, location: 'Makkiyah' },
  { id: 79, arabic: 'النازعات', latin: 'An-Nāzi‘āt', transliteration: 'An-Naziat', translation: 'Pencabut Nyawa', num_ayah: 46, location: 'Makkiyah' },
  { id: 80, arabic: 'عبس', latin: '‘Abasa', transliteration: 'Abasa', translation: 'Bermuka Masam', num_ayah: 42, location: 'Makkiyah' },
  { id: 81, arabic: 'التكوير', latin: 'At-Takwīr', transliteration: 'At-Takwir', translation: 'Menggulung', num_ayah: 29, location: 'Makkiyah' },
  { id: 82, arabic: 'الإنفطار', latin: 'Al-Infiṭār', transliteration: 'Al-Infitar', translation: 'Terbelah', num_ayah: 19, location: 'Makkiyah' },
  { id: 83, arabic: 'المطففين', latin: 'Al-Muṭaffifīn', transliteration: 'Al-Mutaffifin', translation: 'Curang', num_ayah: 36, location: 'Makkiyah' },
  { id: 84, arabic: 'الإنشقاق', latin: 'Al-Insyiqāq', transliteration: 'Al-Insyiqaq', translation: 'Terbelah', num_ayah: 25, location: 'Makkiyah' },
  { id: 85, arabic: 'البروج', latin: 'Al-Burūj', transliteration: 'Al-Buruj', translation: 'Gugusan Bintang', num_ayah: 22, location: 'Makkiyah' },
  { id: 86, arabic: 'الطارق', latin: 'Aṭ-Ṭāriq', transliteration: 'At-Tariq', translation: 'Datang Malam', num_ayah: 17, location: 'Makkiyah' },
  { id: 87, arabic: 'الأعلى', latin: 'Al-A‘lā', transliteration: 'Al-Ala', translation: 'Maha Tinggi', num_ayah: 19, location: 'Makkiyah' },
  { id: 88, arabic: 'الغاشية', latin: 'Al-Gāsyiyah', transliteration: 'Al-Ghasyiyah', translation: 'Hari Kiamat', num_ayah: 26, location: 'Makkiyah' },
  { id: 89, arabic: 'الفجر', latin: 'Al-Fajr', transliteration: 'Al-Fajr', translation: 'Fajar', num_ayah: 30, location: 'Makkiyah' },
  { id: 90, arabic: 'البلد', latin: 'Al-Balad', transliteration: 'Al-Balad', translation: 'Negeri', num_ayah: 20, location: 'Makkiyah' },
  { id: 91, arabic: 'الشمس', latin: 'Asy-Syams', transliteration: 'Asy-Syams', translation: 'Matahari', num_ayah: 15, location: 'Makkiyah' },
  { id: 92, arabic: 'الليل', latin: 'Al-Lail', transliteration: 'Al-Lail', translation: 'Malam', num_ayah: 21, location: 'Makkiyah' },
  { id: 93, arabic: 'الضحى', latin: 'Aḍ-Ḍuḥā', transliteration: 'Ad-Duha', translation: 'Waktu Dhuha', num_ayah: 11, location: 'Makkiyah' },
  { id: 94, arabic: 'الشرح', latin: 'Asy-Syarḥ', transliteration: 'Asy-Syarh', translation: 'Melapangkan', num_ayah: 8, location: 'Makkiyah' },
  { id: 95, arabic: 'التين', latin: 'At-Tīn', transliteration: 'At-Tin', translation: 'Buah Tin', num_ayah: 8, location: 'Makkiyah' },
  { id: 96, arabic: 'العلق', latin: 'Al-‘Alaq', transliteration: 'Al-Alaq', translation: 'Segumpal Darah', num_ayah: 19, location: 'Makkiyah' },
  { id: 97, arabic: 'القدر', latin: 'Al-Qadr', transliteration: 'Al-Qadr', translation: 'Kemuliaan', num_ayah: 5, location: 'Makkiyah' },
  { id: 98, arabic: 'البينة', latin: 'Al-Bayyinah', transliteration: 'Al-Bayyinah', translation: 'Bukti', num_ayah: 8, location: 'Madaniyah' },
  { id: 99, arabic: 'الزلزلة', latin: 'Az-Zalzalah', transliteration: 'Az-Zalzalah', translation: 'Kegoncangan', num_ayah: 8, location: 'Madaniyah' },
  { id: 100, arabic: 'العاديات', latin: 'Al-‘Ādiyāt', transliteration: 'Al-Adiyat', translation: 'Kuda Perang', num_ayah: 11, location: 'Makkiyah' },
  { id: 101, arabic: 'القارعة', latin: 'Al-Qāri‘ah', transliteration: 'Al-Qariah', translation: 'Hari Kiamat', num_ayah: 11, location: 'Makkiyah' },
  { id: 102, arabic: 'التكاثر', latin: 'At-Takāṡur', transliteration: 'At-Takatsur', translation: 'Berbangga', num_ayah: 8, location: 'Makkiyah' },
  { id: 103, arabic: 'العصر', latin: 'Al-‘Aṣr', transliteration: 'Al-Asr', translation: 'Masa', num_ayah: 3, location: 'Makkiyah' },
  { id: 104, arabic: 'الهمزة', latin: 'Al-Humazah', transliteration: 'Al-Humazah', translation: 'Pengumpat', num_ayah: 9, location: 'Makkiyah' },
  { id: 105, arabic: 'الفيل', latin: 'Al-Fīl', transliteration: 'Al-Fil', translation: 'Gajah', num_ayah: 5, location: 'Makkiyah' },
  { id: 106, arabic: 'قريش', latin: 'Quraisy', transliteration: 'Quraisy', translation: 'Suku Quraisy', num_ayah: 4, location: 'Makkiyah' },
  { id: 107, arabic: 'الماعون', latin: 'Al-Mā‘ūn', transliteration: 'Al-Maun', translation: 'Barang Berguna', num_ayah: 7, location: 'Makkiyah' },
  { id: 108, arabic: 'الكوثر', latin: 'Al-Kauṡar', transliteration: 'Al-Kautsar', translation: 'Nikmat Banyak', num_ayah: 3, location: 'Makkiyah' },
  { id: 109, arabic: 'الكافرون', latin: 'Al-Kāfirūn', transliteration: 'Al-Kafirun', translation: 'Orang Kafir', num_ayah: 6, location: 'Makkiyah' },
  { id: 110, arabic: 'النصر', latin: 'An-Naṣr', transliteration: 'An-Nasr', translation: 'Pertolongan', num_ayah: 3, location: 'Madaniyah' },
  { id: 111, arabic: 'اللهب', latin: 'Al-Lahab', transliteration: 'Al-Lahab', translation: 'Gejolak Api', num_ayah: 5, location: 'Makkiyah' },
  { id: 112, arabic: 'الإخلاص', latin: 'Al-Ikhlāṣ', transliteration: 'Al-Ikhlas', translation: 'Ikhlas', num_ayah: 4, location: 'Makkiyah' },
  { id: 113, arabic: 'الفلق', latin: 'Al-Falaq', transliteration: 'Al-Falaq', translation: 'Waktu Subuh', num_ayah: 5, location: 'Makkiyah' },
  { id: 114, arabic: 'الناس', latin: 'An-Nās', transliteration: 'An-Nas', translation: 'Manusia', num_ayah: 6, location: 'Makkiyah' },
];

// ===== GET ALL SURAH =====
export function getAllSurah() {
  return surahList;
}

// ===== CACHE =====
// Surah yang udah pernah dibuka, gak load ulang
const surahCache: Record<number, SurahDetail> = {};

// ===== GET SURAH DETAIL — LAZY LOAD + CACHE =====
export function getSurahDetail(surahNumber: number): SurahDetail {
  // 1. Cek cache dulu — INSTANT, no lag
  if (surahCache[surahNumber]) {
    return surahCache[surahNumber];
  }

  // 2. Kalau belum ada, load cuma 1 file (bukan semua)
  try {
    const ayahs = loadSurahData(surahNumber);

    if (!ayahs || !ayahs[0]) {
      throw new Error(`Surah ${surahNumber} kosong`);
    }

    const surahInfo: SurahInfo = {
      id: ayahs[0].surah.id,
      arabic: ayahs[0].surah.arabic,
      latin: ayahs[0].surah.latin,
      transliteration: ayahs[0].surah.transliteration,
      translation: ayahs[0].surah.translation,
      num_ayah: ayahs[0].surah.num_ayah,
      location: ayahs[0].surah.location,
    };

    const detail: SurahDetail = {
      surah: surahInfo,
      ayahs: ayahs,
    };

    // 3. Simpan ke cache
    surahCache[surahNumber] = detail;

    return detail;
  } catch (error) {
    console.error(`Error loading surah ${surahNumber}:`, error);
    throw error;
  }
}