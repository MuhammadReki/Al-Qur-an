import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Bookmark = {
  id: string;
  surah: number;
  ayah: number;
  surahName: string;
  note?: string;
  color: 'hijau' | 'kuning' | 'biru';
  createdAt: number;
};

type BookmarkStore = {
  bookmarks: Bookmark[];
  lastRead: { surah: number; ayah: number; surahName: string } | null;
  addBookmark: (b: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  removeBookmark: (id: string) => void;
  setLastRead: (surah: number, ayah: number, surahName: string) => void;
  isBookmarked: (surah: number, ayah: number) => boolean;
};

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      lastRead: null,
      addBookmark: (b) =>
        set({
          bookmarks: [
            ...get().bookmarks,
            { ...b, id: `${b.surah}-${b.ayah}-${Date.now()}`, createdAt: Date.now() },
          ],
        }),
      removeBookmark: (id) =>
        set({ bookmarks: get().bookmarks.filter((x) => x.id !== id) }),
      setLastRead: (surah, ayah, surahName) =>
        set({ lastRead: { surah, ayah, surahName } }),
      isBookmarked: (surah, ayah) =>
        get().bookmarks.some((b) => b.surah === surah && b.ayah === ayah),
    }),
    {
      name: 'bookmark-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);