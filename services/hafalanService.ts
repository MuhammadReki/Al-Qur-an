// services/hafalanService.ts
// Service untuk CRUD hafalan + streak + progress
// Pakai AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSurahMeta } from '../data/surahMeta';

const STORAGE_KEY = '@hafizku/hafalan';
const STREAK_KEY = '@hafizku/streak';
const MURAJAAH_KEY = '@hafizku/murajaah';

// ============================================
// TYPES
// ============================================

export interface HafalanItem {
  surahId: number;
  ayatHafal: number;      // berapa ayat yang udah dihafal
  totalAyat: number;      // total ayat surah
  status: 'belum' | 'proses' | 'hafal';
  lastUpdate: string;     // ISO date
  createdAt: string;      // ISO date
}

export interface StreakData {
  current: number;        // streak sekarang
  longest: number;        // streak terpanjang
  lastDate: string;       // tanggal terakhir murajaah (YYYY-MM-DD)
  history: string[];      // list tanggal murajaah (buat heatmap mingguan)
}

export interface MurajaahItem {
  surahId: number;
  target: number;         // target ulang berapa kali
  done: number;           // udah berapa kali
  checked: boolean;       // udah selesai atau belum
  date: string;           // YYYY-MM-DD
}

// ============================================
// HELPER
// ============================================

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function daysBetween(a: string, b: string): number {
  const d1 = new Date(a).getTime();
  const d2 = new Date(b).getTime();
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
}

// ============================================
// CRUD HAFALAN
// ============================================

// 👇 CREATE / UPDATE — tambah atau update hafalan
export async function saveHafalan(surahId: number, ayatHafal: number): Promise<HafalanItem | null> {
  try {
    const meta = getSurahMeta(surahId);
    if (!meta) return null;

    const all = await getAllHafalan();
    const existing = all.find((h) => h.surahId === surahId);
    const now = new Date().toISOString();

    let status: HafalanItem['status'] = 'belum';
    if (ayatHafal >= meta.totalAyat) status = 'hafal';
    else if (ayatHafal > 0) status = 'proses';

    const newItem: HafalanItem = {
      surahId,
      ayatHafal: Math.min(ayatHafal, meta.totalAyat),
      totalAyat: meta.totalAyat,
      status,
      lastUpdate: now,
      createdAt: existing?.createdAt || now,
    };

    const updated = existing
      ? all.map((h) => (h.surahId === surahId ? newItem : h))
      : [...all, newItem];

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newItem;
  } catch (error) {
    console.error('Gagal save hafalan:', error);
    return null;
  }
}

// 👇 READ — ambil semua hafalan
export async function getAllHafalan(): Promise<HafalanItem[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('Gagal get hafalan:', error);
    return [];
  }
}

// 👇 READ — ambil hafalan per surah
export async function getHafalanBySurah(surahId: number): Promise<HafalanItem | null> {
  const all = await getAllHafalan();
  return all.find((h) => h.surahId === surahId) || null;
}

// 👇 DELETE — hapus hafalan 1 surah
export async function deleteHafalan(surahId: number): Promise<boolean> {
  try {
    const all = await getAllHafalan();
    const filtered = all.filter((h) => h.surahId !== surahId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Gagal delete hafalan:', error);
    return false;
  }
}

// 👇 DELETE ALL — reset semua hafalan
export async function resetAllHafalan(): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Gagal reset hafalan:', error);
    return false;
  }
}

// ============================================
// STATISTIK
// ============================================

export interface HafalanStats {
  totalSurah: number;      // berapa surah yang udah dihafal (minimal 1 ayat)
  surahHafal: number;      // surah yang statusnya 'hafal'
  totalAyatHafal: number;  // total ayat yang udah dihafal
  totalAyatSemua: number;  // total ayat dari surah yang ada di list
  persen: number;          // persentase
  targetHarian: number;    // target ayat hari ini
  selesaiHarian: number;   // ayat yang selesai hari ini
}

export async function getStats(): Promise<HafalanStats> {
  const all = await getAllHafalan();
  const today = todayStr();

  const totalAyatHafal = all.reduce((s, h) => s + h.ayatHafal, 0);
  const totalAyatSemua = all.reduce((s, h) => s + h.totalAyat, 0);
  const surahHafal = all.filter((h) => h.status === 'hafal').length;
  const persen = totalAyatSemua > 0 ? Math.round((totalAyatHafal / totalAyatSemua) * 100) : 0;

  // Target harian: 3 ayat default, atau 10% dari total ayat yang belum hafal
  const targetHarian = Math.max(3, Math.ceil((totalAyatSemua - totalAyatHafal) * 0.1));

  // Selesai hari ini: total ayat yang lastUpdate-nya hari ini
  const selesaiHarian = all
    .filter((h) => h.lastUpdate.startsWith(today))
    .reduce((s, h) => s + h.ayatHafal, 0);

  return {
    totalSurah: all.length,
    surahHafal,
    totalAyatHafal,
    totalAyatSemua,
    persen,
    targetHarian,
    selesaiHarian,
  };
}

// ============================================
// STREAK
// ============================================

export async function getStreak(): Promise<StreakData> {
  try {
    const raw = await AsyncStorage.getItem(STREAK_KEY);
    if (!raw) {
      return { current: 0, longest: 0, lastDate: '', history: [] };
    }
    return JSON.parse(raw);
  } catch {
    return { current: 0, longest: 0, lastDate: '', history: [] };
  }
}

// 👇 Tandai hari ini udah murajaah (update streak)
export async function markMurajaahToday(): Promise<StreakData> {
  const streak = await getStreak();
  const today = todayStr();

  // Kalau udah ditandai hari ini, return aja
  if (streak.lastDate === today) return streak;

  // Hitung streak baru
  let newCurrent = 1;
  if (streak.lastDate) {
    const diff = daysBetween(streak.lastDate, today);
    if (diff === 1) newCurrent = streak.current + 1;  // lanjut streak
    else if (diff > 1) newCurrent = 1;                 // putus, mulai dari 1
  }

  const newStreak: StreakData = {
    current: newCurrent,
    longest: Math.max(streak.longest, newCurrent),
    lastDate: today,
    history: [...streak.history.slice(-30), today], // simpan 30 hari terakhir
  };

  await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(newStreak));
  return newStreak;
}

// ============================================
// MURAJAAH CHECKLIST
// ============================================

export async function getMurajaahToday(): Promise<MurajaahItem[]> {
  try {
    const raw = await AsyncStorage.getItem(MURAJAAH_KEY);
    if (!raw) return [];
    const all: MurajaahItem[] = JSON.parse(raw);
    const today = todayStr();
    return all.filter((m) => m.date === today);
  } catch {
    return [];
  }
}

// 👇 Generate murajaah hari ini dari surah yang udah dihafal
export async function generateMurajaahToday(): Promise<MurajaahItem[]> {
  const hafalan = await getAllHafalan();
  const today = todayStr();
  const existing = await getMurajaahToday();

  // Kalau udah ada, return existing
  if (existing.length > 0) return existing;

  // Generate dari surah yang punya hafalan
  const items: MurajaahItem[] = hafalan
    .filter((h) => h.ayatHafal > 0)
    .slice(0, 5)
    .map((h) => ({
      surahId: h.surahId,
      target: h.status === 'hafal' ? 2 : 3,
      done: 0,
      checked: false,
      date: today,
    }));

  await AsyncStorage.setItem(MURAJAAH_KEY, JSON.stringify(items));
  return items;
}

// 👇 Toggle checklist murajaah
export async function toggleMurajaah(surahId: number): Promise<MurajaahItem[]> {
  const all = await getMurajaahToday();
  const today = todayStr();

  const updated = all.map((m) =>
    m.surahId === surahId ? { ...m, checked: !m.checked, done: !m.checked ? m.target : 0 } : m
  );

  // Simpan semua (gabung dengan tanggal lain)
  const raw = await AsyncStorage.getItem(MURAJAAH_KEY);
  const allData: MurajaahItem[] = raw ? JSON.parse(raw) : [];
  const otherDays = allData.filter((m) => m.date !== today);
  await AsyncStorage.setItem(MURAJAAH_KEY, JSON.stringify([...otherDays, ...updated]));

  // Update streak kalau semua checked
  if (updated.length > 0 && updated.every((m) => m.checked)) {
    await markMurajaahToday();
  }

  return updated;
}

// ============================================
// ACHIEVEMENT
// ============================================

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  unlocked: boolean;
}

export async function getAchievements(): Promise<Achievement[]> {
  const stats = await getStats();
  const streak = await getStreak();

  return [
    {
      id: 'first_hafal',
      title: 'Langkah Pertama',
      desc: 'Hafal 1 ayat pertama',
      icon: '🥇',
      unlocked: stats.totalAyatHafal >= 1,
    },
    {
      id: 'juz30',
      title: 'Juz 30 Master',
      desc: 'Hafal 5 surah Juz 30',
      icon: '🏆',
      unlocked: stats.surahHafal >= 5,
    },
    {
      id: 'streak7',
      title: 'Konsisten',
      desc: '7 hari streak murajaah',
      icon: '🔥',
      unlocked: streak.longest >= 7,
    },
    {
      id: 'streak30',
      title: 'Pejuang Hafalan',
      desc: '30 hari streak murajaah',
      icon: '💎',
      unlocked: streak.longest >= 30,
    },
    {
      id: 'hafal100',
      title: '100 Ayat',
      desc: 'Hafal total 100 ayat',
      icon: '⭐',
      unlocked: stats.totalAyatHafal >= 100,
    },
    {
      id: 'hafal500',
      title: '500 Ayat',
      desc: 'Hafal total 500 ayat',
      icon: '👑',
      unlocked: stats.totalAyatHafal >= 500,
    },
  ];
}