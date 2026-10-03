import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TilawahStore = {
  dailyAyat: Record<string, number>; // { '2026-10-03': 12 }
  dailyMinutes: Record<string, number>; // { '2026-10-03': 5 }
  targetHarian: number;
  logAyat: (count: number, minutes?: number) => void;
  setTargetHarian: (target: number) => void;
  getStreak: () => number;
  getTotalAyat: () => number;
  getTodayAyat: () => number;
  resetAll: () => void;
};

const todayKey = () => new Date().toISOString().split('T')[0];

export const useTilawahStore = create<TilawahStore>()(
  persist(
    (set, get) => ({
      dailyAyat: {},
      dailyMinutes: {},
      targetHarian: 10,

      logAyat: (count, minutes = 0) => {
        const key = todayKey();
        const prevAyat = get().dailyAyat[key] || 0;
        const prevMin = get().dailyMinutes[key] || 0;
        set({
          dailyAyat: { ...get().dailyAyat, [key]: prevAyat + count },
          dailyMinutes: { ...get().dailyMinutes, [key]: prevMin + minutes },
        });
      },

      setTargetHarian: (target) => set({ targetHarian: target }),

      getStreak: () => {
        const data = get().dailyAyat;
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 365; i++) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const key = d.toISOString().split('T')[0];
          if (data[key] && data[key] > 0) {
            streak++;
          } else if (i > 0) {
            break;
          }
        }
        return streak;
      },

      getTotalAyat: () => {
        return Object.values(get().dailyAyat).reduce((a, b) => a + b, 0);
      },

      getTodayAyat: () => {
        return get().dailyAyat[todayKey()] || 0;
      },

      resetAll: () => set({ dailyAyat: {}, dailyMinutes: {} }),
    }),
    {
      name: 'tilawah-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const getTodayKey = todayKey;