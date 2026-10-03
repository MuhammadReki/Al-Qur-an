// ===== TYPES =====
export interface PrayerTimes {
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export interface PrayerData {
  tanggal: string;
  hijriah: string;
  lokasi: string;
  waktu: PrayerTimes;
}

const BASE_URL = 'https://api.aladhan.com/v1';

/**
 * Ambil jadwal sholat hari ini berdasarkan koordinat GPS
 */
export async function getPrayerTimes(
  latitude: number,
  longitude: number,
  date: string = new Date().toISOString().split('T')[0]
): Promise<PrayerData> {
  try {
    // method=11 (Majlis Ugama Islam Singapura) = mirip Kemenag
    // method=20 (KEMENAG) juga bisa, tapi kadang gak tersedia
    const response = await fetch(
      `${BASE_URL}/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=11`
    );
    const data = await response.json();

    if (data.code === 200) {
      const timings = data.data.timings;
      const hijri = data.data.date.hijri;
      const meta = data.data.meta;

      return {
        tanggal: data.data.date.readable,
        hijriah: `${hijri.day} ${hijri.month.en} ${hijri.year} H`,
        lokasi: `${meta.timezone}`,
        waktu: {
          imsak: formatTime(timings.Imsak),
          subuh: formatTime(timings.Fajr),
          terbit: formatTime(timings.Sunrise),
          dhuha: formatTime(timings.Dhuhr),
          dzuhur: formatTime(timings.Dhuhr),
          ashar: formatTime(timings.Asr),
          maghrib: formatTime(timings.Maghrib),
          isya: formatTime(timings.Isha),
        },
      };
    }
    throw new Error('Gagal ambil jadwal sholat');
  } catch (error) {
    console.error('Error getPrayerTimes:', error);
    throw error;
  }
}

/**
 * Ambil jadwal sholat 30 hari ke depan (untuk kalender bulanan)
 */
export async function getMonthlyPrayerTimes(
  latitude: number,
  longitude: number,
  month: number,
  year: number
): Promise<PrayerData[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=11`
    );
    const data = await response.json();

    if (data.code === 200) {
      return data.data.map((item: any) => {
        const timings = item.timings;
        const hijri = item.date.hijri;
        return {
          tanggal: item.date.readable,
          hijriah: `${hijri.day} ${hijri.month.en} ${hijri.year} H`,
          lokasi: '',
          waktu: {
            imsak: formatTime(timings.Imsak),
            subuh: formatTime(timings.Fajr),
            terbit: formatTime(timings.Sunrise),
            dhuha: formatTime(timings.Dhuhr),
            dzuhur: formatTime(timings.Dhuhr),
            ashar: formatTime(timings.Asr),
            maghrib: formatTime(timings.Maghrib),
            isya: formatTime(timings.Isha),
          },
        };
      });
    }
    return [];
  } catch (error) {
    console.error('Error getMonthlyPrayerTimes:', error);
    return [];
  }
}

/**
 * Format "04:52 (WIB)" jadi "04:52"
 */
function formatTime(timeStr: string): string {
  return timeStr.split(' ')[0];
}

/**
 * Cari waktu sholat berikutnya dari waktu sekarang
 */
export function getNextPrayer(waktu: PrayerTimes): {
  name: string;
  time: string;
  countdown: string;
} | null {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const prayers = [
    { name: 'Subuh', time: waktu.subuh },
    { name: 'Dzuhur', time: waktu.dzuhur },
    { name: 'Ashar', time: waktu.ashar },
    { name: 'Maghrib', time: waktu.maghrib },
    { name: 'Isya', time: waktu.isya },
  ];

  for (const prayer of prayers) {
    const [h, m] = prayer.time.split(':').map(Number);
    const prayerMinutes = h * 60 + m;

    if (prayerMinutes > currentMinutes) {
      const diff = prayerMinutes - currentMinutes;
      const hours = Math.floor(diff / 60);
      const mins = diff % 60;

      let countdown = '';
      if (hours > 0) countdown = `${hours} jam ${mins} menit lagi`;
      else countdown = `${mins} menit lagi`;

      return { name: prayer.name, time: prayer.time, countdown };
    }
  }

  // Kalau semua udah lewat, berarti besok Subuh
  const [h, m] = prayers[0].time.split(':').map(Number);
  const subuhTomorrow = (24 * 60) - currentMinutes + (h * 60 + m);
  const hours = Math.floor(subuhTomorrow / 60);
  const mins = subuhTomorrow % 60;

  return {
    name: 'Subuh (besok)',
    time: prayers[0].time,
    countdown: `${hours} jam ${mins} menit lagi`,
  };
}