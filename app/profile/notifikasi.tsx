import { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ImageBackground, TouchableOpacity,
  Switch, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  requestNotifPermission,
  scheduleHafalanReminder,
  scheduleQuranReminder,
  scheduleDoaReminder,
  scheduleAdzanNotif,
  scheduleAdzanReminder,
  cancelByType,
} from '../../services/notificationService';

const NOTIF_KEY = '@hafizku/notifikasi';

interface NotifSettings {
  adzan: boolean;
  adzanReminder: boolean;
  hafalanReminder: boolean;
  doaReminder: boolean;
  quranReminder: boolean;
  reminderHour: number;
  reminderMinute: number;
}

const DEFAULT_NOTIF: NotifSettings = {
  adzan: true,
  adzanReminder: true,
  hafalanReminder: true,
  doaReminder: false,
  quranReminder: false,
  reminderHour: 19,
  reminderMinute: 0,
};

const PRAYER_TIMES = [
  { name: 'Subuh', hour: 4, minute: 52 },
  { name: 'Dzuhur', hour: 12, minute: 13 },
  { name: 'Ashar', hour: 15, minute: 13 },
  { name: 'Maghrib', hour: 18, minute: 16 },
  { name: 'Isya', hour: 19, minute: 21 },
];

export default function NotifikasiScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<NotifSettings>(DEFAULT_NOTIF);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadNotif();
    }, [])
  );

  const loadNotif = async () => {
    try {
      const granted = await requestNotifPermission();
      setPermissionGranted(granted);

      const raw = await AsyncStorage.getItem(NOTIF_KEY);
      if (raw) {
        const parsed = { ...DEFAULT_NOTIF, ...JSON.parse(raw) };
        setSettings(parsed);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const update = async (patch: Partial<NotifSettings>) => {
    const updated = { ...settings, ...patch };
    setSettings(updated);
    await AsyncStorage.setItem(NOTIF_KEY, JSON.stringify(updated));

    // Auto-schedule/cancel notif sesuai perubahan
    if ('hafalanReminder' in patch) {
      if (patch.hafalanReminder) {
        await scheduleHafalanReminder(updated.reminderHour, updated.reminderMinute);
      } else {
        await cancelByType('hafalan');
      }
    }
    if ('quranReminder' in patch) {
      if (patch.quranReminder) await scheduleQuranReminder(6, 0);
      else await cancelByType('quran');
    }
    if ('doaReminder' in patch) {
      if (patch.doaReminder) await scheduleDoaReminder();
      else {
        await cancelByType('doa-pagi');
        await cancelByType('doa-sore');
      }
    }
    if ('adzan' in patch) {
      if (patch.adzan) await scheduleAdzanNotif(PRAYER_TIMES);
      else await cancelByType('adzan');
    }
    if ('adzanReminder' in patch) {
      if (patch.adzanReminder) await scheduleAdzanReminder(PRAYER_TIMES);
      else await cancelByType('adzan-reminder');
    }
    if ('reminderHour' in patch && updated.hafalanReminder) {
      await cancelByType('hafalan');
      await scheduleHafalanReminder(updated.reminderHour, updated.reminderMinute);
    }
  };

  // Row Switch compact
  const RowSwitch = ({
    icon, iconColor, title, value, onChange,
  }: {
    icon: string;
    iconColor: string;
    title: string;
    value: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <View style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: `${iconColor}18` }]}>
        <Ionicons name={icon as any} size={16} color={iconColor} />
      </View>
      <Text style={styles.rowTitle} numberOfLines={1}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#E2E8F0', true: '#A7F3D0' }}
        thumbColor={value ? '#059669' : '#F1F5F9'}
        ios_backgroundColor="#E2E8F0"
        style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
      />
    </View>
  );

  if (loading) {
    return (
      <ImageBackground
        source={require('../../assets/images/BackgroundBeranda1.png')}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#059669" />
            <Text style={styles.loadingText}>Memuat notifikasi...</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/images/BackgroundBeranda1.png')}
      style={styles.bgImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.wrapper}>

          {/* HEADER */}
          <View style={styles.headerWrapper}>
            <LinearGradient
              colors={['#0A1628', '#134E4A', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >
              <View style={styles.ornament1} />
              <View style={styles.ornament2} />

              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backBtn}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={18} color="#FFF" />
              </TouchableOpacity>

              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>Notifikasi</Text>
                <Text style={styles.headerSubtitle}>
                  Atur pengingat ibadah & hafalan
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* STATUS IZIN */}
          {!permissionGranted && (
            <View style={styles.warningCard}>
              <Ionicons name="alert-circle" size={14} color="#DC2626" />
              <Text style={styles.warningText}>
                Izin notif belum aktif — pakai APK buat aktifin
              </Text>
            </View>
          )}

          {/* WAKTU SHOLAT */}
          <View style={styles.sectionHeader}>
            <LinearGradient
              colors={['#7C3AED', '#6D28D9']}
              style={styles.sectionIconBox}
            >
              <Ionicons name="moon" size={12} color="#FFF" />
            </LinearGradient>
            <Text style={styles.sectionTitle}>Waktu Sholat</Text>
          </View>

          <View style={styles.card}>
            <RowSwitch
              icon="volume-high"
              iconColor="#7C3AED"
              title="Notifikasi Adzan"
              value={settings.adzan}
              onChange={(v) => update({ adzan: v })}
            />
            <View style={styles.divider} />
            <RowSwitch
              icon="alarm"
              iconColor="#F59E0B"
              title="Pengingat Sebelum Adzan"
              value={settings.adzanReminder}
              onChange={(v) => update({ adzanReminder: v })}
            />
          </View>

          {/* HAFALAN & QURAN */}
          <View style={styles.sectionHeader}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.sectionIconBox}
            >
              <Ionicons name="book" size={12} color="#FFF" />
            </LinearGradient>
            <Text style={styles.sectionTitle}>Hafalan & Quran</Text>
          </View>

          <View style={styles.card}>
            <RowSwitch
              icon="trophy"
              iconColor="#10B981"
              title="Pengingat Hafalan"
              value={settings.hafalanReminder}
              onChange={(v) => update({ hafalanReminder: v })}
            />
            <View style={styles.divider} />
            <RowSwitch
              icon="book-outline"
              iconColor="#3B82F6"
              title="Pengingat Baca Quran"
              value={settings.quranReminder}
              onChange={(v) => update({ quranReminder: v })}
            />
            <View style={styles.divider} />
            <RowSwitch
              icon="hand-left"
              iconColor="#EC4899"
              title="Pengingat Doa Pagi/Sore"
              value={settings.doaReminder}
              onChange={(v) => update({ doaReminder: v })}
            />
          </View>

          {/* JAM PENGINGAT */}
          <View style={styles.sectionHeader}>
            <LinearGradient
              colors={['#D4AF37', '#B8941F']}
              style={styles.sectionIconBox}
            >
              <Ionicons name="time" size={12} color="#FFF" />
            </LinearGradient>
            <Text style={styles.sectionTitle}>
              Jam Pengingat: {String(settings.reminderHour).padStart(2, '0')}:00
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.hourPicker}>
              {[6, 12, 15, 18, 19, 20, 21].map((h) => (
                <TouchableOpacity
                  key={h}
                  style={[
                    styles.hourChip,
                    settings.reminderHour === h && styles.hourChipActive,
                  ]}
                  onPress={() => update({ reminderHour: h })}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.hourText,
                      settings.reminderHour === h && styles.hourTextActive,
                    ]}
                  >
                    {String(h).padStart(2, '0')}:00
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Ionicons name="information-circle-outline" size={12} color="#94A3B8" />
            <Text style={styles.footerText}>
              Notif aktif penuh di versi APK
            </Text>
          </View>

        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1 },
  wrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 90,
    justifyContent: 'space-between',
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#059669', fontSize: 14 },

  // HEADER
  headerWrapper: {
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  headerGradient: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    overflow: 'hidden',
  },
  ornament1: {
    position: 'absolute',
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    top: -35, right: -25,
  },
  ornament2: {
    position: 'absolute',
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    bottom: -25, left: -15,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#FFF' },
  headerSubtitle: {
    fontSize: 10, color: 'rgba(255, 255, 255, 0.75)', marginTop: 1,
  },

  // WARNING
  warningCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1, borderColor: '#FECACA',
  },
  warningText: { fontSize: 10, color: '#991B1B', flex: 1, fontWeight: '600' },

  // SECTION
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginBottom: 6, marginTop: 4,
  },
  sectionIconBox: {
    width: 24, height: 24, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#0A1628' },

  // CARD
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 14,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.15)',
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 8, gap: 10,
  },
  rowIcon: {
    width: 30, height: 30, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  rowTitle: { fontSize: 12, fontWeight: '700', color: '#0A1628', flex: 1 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 12 },

  // HOUR PICKER
  hourPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 6,
  },
  hourChip: {
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 8, backgroundColor: '#F1F5F9',
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  hourChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  hourText: { fontSize: 10, fontWeight: '700', color: '#475569' },
  hourTextActive: { color: '#FFF' },

  // FOOTER
  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, paddingTop: 4,
  },
  footerText: { fontSize: 9, color: '#94A3B8', fontStyle: 'italic' },
});