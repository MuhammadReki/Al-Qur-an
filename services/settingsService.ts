// services/settingsService.ts
// Service untuk simpan/ambil pengaturan aplikasi

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@hafizku/settings';

// ============================================
// TYPES
// ============================================

export interface AppSettings {
  // Tampilan
  fontSize: 'kecil' | 'sedang' | 'besar';   // ukuran font Arab
  theme: 'light' | 'dark';                  // tema
  showLatin: boolean;                       // tampilkan latin
  showTranslation: boolean;                 // tampilkan terjemahan

  // Ibadah
  locationMode: 'auto' | 'manual';          // auto GPS atau manual
  manualCity: string;                       // nama kota manual
  manualLat: number;                        // latitude manual
  manualLng: number;                        // longitude manual
  prayerMethod: number;                     // metode perhitungan (Kemenag=11)
  prayerReminder: boolean;                  // notif sebelum adzan

  // Notifikasi
  adzanNotif: boolean;                      // notif adzan
  hafalanReminder: boolean;                 // pengingat hafalan
  reminderHour: number;                     // jam pengingat (0-23)
  reminderMinute: number;                   // menit pengingat (0-59)

  // App info
  installedAt: string;                      // tanggal install
}

const DEFAULT_SETTINGS: AppSettings = {
  fontSize: 'sedang',
  theme: 'light',
  showLatin: true,
  showTranslation: true,

  locationMode: 'auto',
  manualCity: '',
  manualLat: -0.2345555,
  manualLng: 100.640474,
  prayerMethod: 11,
  prayerReminder: true,

  adzanNotif: true,
  hafalanReminder: true,
  reminderHour: 19,
  reminderMinute: 0,

  installedAt: new Date().toISOString(),
};

// ============================================
// CRUD
// ============================================

// 👇 Ambil semua setting
export async function getSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) {
      // Kalau belum ada, simpan default & return
      await AsyncStorage.setItem(KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    // Merge dengan default (biar aman kalau ada setting baru)
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (error) {
    console.error('Gagal get settings:', error);
    return DEFAULT_SETTINGS;
  }
}

// 👇 Update 1 atau lebih setting (partial)
export async function updateSettings(patch: Partial<AppSettings>): Promise<AppSettings> {
  try {
    const current = await getSettings();
    const updated = { ...current, ...patch };
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Gagal update settings:', error);
    return getSettings();
  }
}

// 👇 Reset semua setting ke default
export async function resetSettings(): Promise<AppSettings> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Gagal reset settings:', error);
    return DEFAULT_SETTINGS;
  }
}

// 👇 Helper: konversi setting font ke ukuran pixel
export function getFontSize(size: AppSettings['fontSize']): number {
  switch (size) {
    case 'kecil': return 22;
    case 'besar': return 34;
    default: return 28;
  }
}