import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import BootSplash from 'react-native-bootsplash';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Scheherazade-SemiBold': require('../assets/fonts/ScheherazadeNew-SemiBold.ttf'),
    'Scheherazade-Bold': require('../assets/fonts/ScheherazadeNew-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Sembunyiin native splash setelah font loaded
      const timer = setTimeout(() => {
        BootSplash.hide({ fade: true });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Native splash masih muncul
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="surah/[id]" />
        <Stack.Screen name="last-read/index" />
        <Stack.Screen name="search/index" />
        <Stack.Screen name="prayer/index" />
        <Stack.Screen name="hafalan/tambah" />
        <Stack.Screen name="profile/edit" />
        <Stack.Screen name="profile/notifikasi" />
        <Stack.Screen name="pengaturan/index" />
        <Stack.Screen name="pengaturan/tentang" />
        <Stack.Screen name="dzikir/index" />
        <Stack.Screen name="dzikir/[id]" />
        <Stack.Screen name="qiblat" />
        <Stack.Screen name="bookmark" />
        <Stack.Screen name="statistik" />
      </Stack>
    </SafeAreaProvider>
  );
}