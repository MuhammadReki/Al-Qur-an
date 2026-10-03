// services/notificationService.ts
// Safe version — gak crash di Expo Go, jalan full di APK

import { Platform } from 'react-native';

let Notifications: any = null;
let isExpoGo = false;

try {
  const Constants = require('expo-constants').default;
  isExpoGo = Constants.appOwnership === 'expo';
} catch (e) {
  isExpoGo = false;
}

if (!isExpoGo) {
  try {
    Notifications = require('expo-notifications');
    if (Notifications) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
    }
  } catch (e) {
    Notifications = null;
  }
}

const isAvailable = () => Notifications !== null && !isExpoGo;

// PERMISSION
export async function requestNotifPermission(): Promise<boolean> {
  if (!isAvailable()) {
    console.log('⚠️ Notif gak tersedia di Expo Go. Pakai APK buat test.');
    return false;
  }
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') return false;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'HafizKu Notifikasi',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
      });
      await Notifications.setNotificationChannelAsync('adzan', {
        name: 'Adzan',
        importance: Notifications.AndroidImportance.MAX,
        sound: 'default',
      });
    }
    return true;
  } catch (error) {
    return false;
  }
}

// SCHEDULE
export async function scheduleHafalanReminder(hour: number, minute: number) {
  if (!isAvailable()) return null;
  try {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: '📖 Waktunya Murajaah!',
        body: 'Yuk, luangkan waktu buat murajaah hafalanmu hari ini.',
        sound: 'default',
        data: { type: 'hafalan' },
      },
      trigger: { type: 'daily', hour, minute },
    });
  } catch { return null; }
}

export async function scheduleQuranReminder(hour = 6, minute = 0) {
  if (!isAvailable()) return null;
  try {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: '📚 Baca Quran Yuk!',
        body: 'Awali harimu dengan membaca Al-Quran. 🤲',
        sound: 'default',
        data: { type: 'quran' },
      },
      trigger: { type: 'daily', hour, minute },
    });
  } catch { return null; }
}

export async function scheduleDoaReminder() {
  if (!isAvailable()) return [];
  const ids: any[] = [];
  try {
    ids.push(await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌅 Doa Pagi',
        body: 'Jangan lupa baca doa pagi ya.',
        sound: 'default',
        data: { type: 'doa-pagi' },
      },
      trigger: { type: 'daily', hour: 6, minute: 30 },
    }));
    ids.push(await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌇 Doa Sore',
        body: 'Waktunya doa sore.',
        sound: 'default',
        data: { type: 'doa-sore' },
      },
      trigger: { type: 'daily', hour: 17, minute: 30 },
    }));
  } catch {}
  return ids;
}

export interface PrayerSchedule {
  name: string;
  hour: number;
  minute: number;
}

export async function scheduleAdzanNotif(prayers: PrayerSchedule[]) {
  if (!isAvailable()) return [];
  const ids: any[] = [];
  try {
    for (const p of prayers) {
      ids.push(await Notifications.scheduleNotificationAsync({
        content: {
          title: `🕌 Waktu ${p.name}`,
          body: `Sudah masuk waktu sholat ${p.name}.`,
          sound: 'default',
          data: { type: 'adzan', prayer: p.name },
        },
        trigger: { type: 'daily', hour: p.hour, minute: p.minute },
      }));
    }
  } catch {}
  return ids;
}

export async function scheduleAdzanReminder(prayers: PrayerSchedule[]) {
  if (!isAvailable()) return [];
  const ids: any[] = [];
  try {
    for (const p of prayers) {
      let total = p.hour * 60 + p.minute - 10;
      if (total < 0) total += 1440;
      ids.push(await Notifications.scheduleNotificationAsync({
        content: {
          title: `⏰ ${p.name} 10 menit lagi`,
          body: `Bersiap-siap, sebentar lagi ${p.name}.`,
          sound: 'default',
          data: { type: 'adzan-reminder', prayer: p.name },
        },
        trigger: { type: 'daily', hour: Math.floor(total / 60) % 24, minute: total % 60 },
      }));
    }
  } catch {}
  return ids;
}

// CANCEL
export async function cancelByType(type: string) {
  if (!isAvailable()) return;
  try {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    for (const n of all) {
      if (n.content.data?.type === type) {
        await Notifications.cancelScheduledNotificationAsync(n.identifier);
      }
    }
  } catch {}
}

export async function cancelAllNotifications() {
  if (!isAvailable()) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {}
}

export async function listScheduledNotifications() {
  if (!isAvailable()) {
    console.log('📋 Notif gak tersedia (Expo Go).');
    return [];
  }
  try {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    console.log('📋 Total notif:', all.length);
    return all;
  } catch { return []; }
}