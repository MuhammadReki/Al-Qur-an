// services/profileService.ts
// Service untuk simpan/ambil profil user

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@hafizku/profile';

export interface UserProfile {
  name: string;
  username: string;
  bio: string;
  avatar: string | null;  // URI foto dari galeri
  updatedAt: string;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Muhammad Reki',
  username: 'HafizKu User',
  bio: 'Sedang berjuang menghafal Al-Quran 📖',
  avatar: null,
  updatedAt: new Date().toISOString(),
};

// 👇 Ambil profil
export async function getProfile(): Promise<UserProfile> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch (error) {
    console.error('Gagal get profile:', error);
    return DEFAULT_PROFILE;
  }
}

// 👇 Update profil
export async function updateProfile(patch: Partial<UserProfile>): Promise<UserProfile> {
  try {
    const current = await getProfile();
    const updated: UserProfile = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Gagal update profile:', error);
    return getProfile();
  }
}

// 👇 Reset profil
export async function resetProfile(): Promise<UserProfile> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(DEFAULT_PROFILE));
    return DEFAULT_PROFILE;
  } catch (error) {
    return DEFAULT_PROFILE;
  }
}