# 📖 MyQur'an — Teman Setia Hafalanmu

<div align="center">

**Aplikasi Al-Qur'an digital lengkap untuk menemani perjalanan tilawah dan hafalanmu.**

[![Platform](https://img.shields.io/badge/platform-Android-green.svg)](https://www.android.com/)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2057-black.svg)](https://expo.dev/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

</div>

---

## 📖 Tentang Aplikasi

**MyQur'an** adalah aplikasi Al-Qur'an digital yang dirancang untuk membantu pengguna dalam tilawah, hafalan, dan ibadah harian. Aplikasi ini dibangun dengan **React Native & Expo**, dengan fokus pada:

- 🎨 **Desain islami modern** — nuansa hijau emas yang elegan
- 🚀 **Performa cepat** — ringan dan responsif
- 📖 **Fitur lengkap** — dari baca surah hingga kompas kiblat
- 🤍 **Gratis selamanya** — tanpa iklan, tanpa biaya

---

## ✨ Fitur Unggulan

| Fitur | Deskripsi |
|-------|-----------|
| 📚 **Al-Qur'an 114 Surah** | Teks Arab, latin, terjemahan, dan catatan kaki (Sumber: Kemenag RI) |
| 📌 **Bookmark Ayat** | Tandai ayat favorit dengan tekan lama |
| 📊 **Statistik Tilawah** | Heatmap progress harian seperti GitHub |
| 🧭 **Arah Kiblat** | Kompas real-time menggunakan sensor HP |
| 🕌 **Jadwal Sholat** | Waktu sholat real-time sesuai lokasi |
| 🏆 **Hafalan Tracker** | Catat progress hafalan & target harian |
| 📿 **Doa & Dzikir** | 227 doa pilihan + dzikir lengkap |
| 🎨 **Desain Islami Modern** | Nuansa hijau emas yang elegan |
| 🔍 **Pencarian** | Cari surah, doa, atau ayat dengan cepat |
| 🌙 **Mode Terang & Gelap** | Nyaman dibaca siang & malam |

---

## 📸 Screenshots

<div align="center">

### 🌙 Splash Screen

<img src="./screenshots/Splash-Screen.jpeg" width="300" alt="Splash Screen" />

### 🏠 Tampilan Utama

<table>
  <tr>
    <td align="center"><b>Beranda</b></td>
    <td align="center"><b>Quran</b></td>
    <td align="center"><b>Doa</b></td>
  </tr>
  <tr>
    <td><img src="./screenshots/Beranda.jpeg" width="220" alt="Beranda" /></td>
    <td><img src="./screenshots/Quran.jpeg" width="220" alt="Quran" /></td>
    <td><img src="./screenshots/Doa.jpeg" width="220" alt="Doa" /></td>
  </tr>
</table>

<table>
  <tr>
    <td align="center"><b>Hafalan</b></td>
    <td align="center"><b>Statistik Tilawah</b></td>
    <td align="center"><b>Arah Kiblat</b></td>
  </tr>
  <tr>
    <td><img src="./screenshots/Hafalan.jpeg" width="220" alt="Hafalan" /></td>
    <td><img src="./screenshots/Statistik-Tilawah.jpeg" width="220" alt="Statistik Tilawah" /></td>
    <td><img src="./screenshots/ArahKiblat.jpeg" width="220" alt="Arah Kiblat" /></td>
  </tr>
</table>

### 👤 Profil

<img src="./screenshots/Profile.jpeg" width="300" alt="Profil" />

</div>

---

## 🚀 Cara Install

### 📱 Untuk Pengguna

1. **Download APK** dari [Releases](https://github.com/MuhammadReki/alquran/releases)
2. **Aktifkan** "Install from unknown sources" di HP
3. **Install APK** → buka app
4. **Selesai!** 🎉

### 💻 Untuk Developer

```bash
# 1. Clone repository
git clone https://github.com/MuhammadReki/alquran.git
cd alquran

# 2. Install dependencies
npm install

# 3. Jalankan development server
npx expo start

# 4. Build untuk Android
npx expo run:android

# 5. Atau build APK via EAS
eas build --platform android --profile production