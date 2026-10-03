import { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ImageBackground, TouchableOpacity,
  Switch, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  getSettings, updateSettings, resetSettings, AppSettings,
} from '../../services/settingsService';
import { resetAllHafalan } from '../../services/hafalanService';

export default function PengaturanScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [])
  );

  const loadSettings = async () => {
    setLoading(true);
    const s = await getSettings();
    setSettings(s);
    setLoading(false);
  };

  const update = async (patch: Partial<AppSettings>) => {
    const updated = await updateSettings(patch);
    setSettings(updated);
  };

  const handleResetData = () => {
    Alert.alert(
      '⚠️ Reset Semua Data',
      'Hapus SEMUA hafalan dan pengaturan? Gak bisa dibatalin.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            await resetAllHafalan();
            await resetSettings();
            await loadSettings();
            Alert.alert('✅ Selesai', 'Semua data udah direset.');
          },
        },
      ]
    );
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
        <Ionicons name={icon as any} size={15} color={iconColor} />
      </View>
      <Text style={styles.rowTitle} numberOfLines={1}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#E2E8F0', true: '#A7F3D0' }}
        thumbColor={value ? '#059669' : '#F1F5F9'}
        ios_backgroundColor="#E2E8F0"
        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
      />
    </View>
  );

  if (loading || !settings) {
    return (
      <ImageBackground
        source={require('../../assets/images/BackgroundBeranda1.png')}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#059669" />
            <Text style={styles.loadingText}>Memuat pengaturan...</Text>
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
                <Text style={styles.headerTitle}>Pengaturan</Text>
                <Text style={styles.headerSubtitle}>
                  Sesuaikan aplikasi sesuai kebutuhan
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* TAMPILAN */}
          <View style={styles.sectionHeader}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.sectionIconBox}
            >
              <Ionicons name="color-palette" size={12} color="#FFF" />
            </LinearGradient>
            <Text style={styles.sectionTitle}>Tampilan</Text>
          </View>

          <View style={styles.card}>
            {/* Ukuran Font */}
            <View style={styles.fontRow}>
              <Text style={styles.fontLabel}>Ukuran Font Arab</Text>
              <View style={styles.chipRow}>
                {[
                  { key: 'kecil', label: 'Kecil' },
                  { key: 'sedang', label: 'Sedang' },
                  { key: 'besar', label: 'Besar' },
                ].map((o) => (
                  <TouchableOpacity
                    key={o.key}
                    style={[
                      styles.chip,
                      settings.fontSize === o.key && styles.chipActive,
                    ]}
                    onPress={() => update({ fontSize: o.key as any })}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        settings.fontSize === o.key && styles.chipTextActive,
                      ]}
                    >
                      {o.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.divider} />

            <RowSwitch
              icon="language"
              iconColor="#3B82F6"
              title="Tampilkan Latin"
              value={settings.showLatin}
              onChange={(v) => update({ showLatin: v })}
            />
            <View style={styles.divider} />
            <RowSwitch
              icon="book"
              iconColor="#8B5CF6"
              title="Tampilkan Terjemahan"
              value={settings.showTranslation}
              onChange={(v) => update({ showTranslation: v })}
            />
          </View>

          {/* IBADAH */}
          <View style={styles.sectionHeader}>
            <LinearGradient
              colors={['#7C3AED', '#6D28D9']}
              style={styles.sectionIconBox}
            >
              <Ionicons name="moon" size={12} color="#FFF" />
            </LinearGradient>
            <Text style={styles.sectionTitle}>Ibadah</Text>
          </View>

          <View style={styles.card}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => router.push('/pengaturan/lokasi')}
              activeOpacity={0.7}
            >
              <View style={[styles.rowIcon, { backgroundColor: '#05966918' }]}>
                <Ionicons name="location" size={15} color="#059669" />
              </View>
              <Text style={styles.rowTitle}>Lokasi Sholat</Text>
              <Text style={styles.rowValue}>
                {settings.locationMode === 'auto' ? 'Auto' : 'Manual'}
              </Text>
              <Ionicons name="chevron-forward" size={14} color="#CBD5E1" />
            </TouchableOpacity>
            <View style={styles.divider} />
            <RowSwitch
              icon="notifications"
              iconColor="#F59E0B"
              title="Pengingat Sebelum Adzan"
              value={settings.prayerReminder}
              onChange={(v) => update({ prayerReminder: v })}
            />
          </View>

          {/* NOTIFIKASI */}
          <View style={styles.sectionHeader}>
            <LinearGradient
              colors={['#EF4444', '#DC2626']}
              style={styles.sectionIconBox}
            >
              <Ionicons name="notifications" size={12} color="#FFF" />
            </LinearGradient>
            <Text style={styles.sectionTitle}>Notifikasi</Text>
          </View>

          <View style={styles.card}>
            <RowSwitch
              icon="volume-high"
              iconColor="#EF4444"
              title="Notifikasi Adzan"
              value={settings.adzanNotif}
              onChange={(v) => update({ adzanNotif: v })}
            />
            <View style={styles.divider} />
            <RowSwitch
              icon="trophy"
              iconColor="#10B981"
              title="Pengingat Hafalan"
              value={settings.hafalanReminder}
              onChange={(v) => update({ hafalanReminder: v })}
            />
          </View>

          {/* DATA & TENTANG */}
          <View style={styles.sectionHeader}>
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              style={styles.sectionIconBox}
            >
              <Ionicons name="server" size={12} color="#FFF" />
            </LinearGradient>
            <Text style={styles.sectionTitle}>Data & Lainnya</Text>
          </View>

          <View style={styles.card}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => router.push('/pengaturan/tentang')}
              activeOpacity={0.7}
            >
              <View style={[styles.rowIcon, { backgroundColor: '#0EA5E918' }]}>
                <Ionicons name="information-circle" size={15} color="#0EA5E9" />
              </View>
              <Text style={styles.rowTitle}>Tentang HafizKu</Text>
              <Ionicons name="chevron-forward" size={14} color="#CBD5E1" />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.row}
              onPress={handleResetData}
              activeOpacity={0.7}
            >
              <View style={[styles.rowIcon, { backgroundColor: '#FEE2E218' }]}>
                <Ionicons name="trash" size={15} color="#DC2626" />
              </View>
              <Text style={[styles.rowTitle, { color: '#DC2626' }]}>
                Reset Semua Data
              </Text>
              <Ionicons name="chevron-forward" size={14} color="#CBD5E1" />
            </TouchableOpacity>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}></Text>
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
    paddingHorizontal: 14,
    paddingTop: 6,
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
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  headerSubtitle: {
    fontSize: 9, color: 'rgba(255, 255, 255, 0.75)', marginTop: 1,
  },

  // SECTION
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginBottom: 4, marginTop: 4,
  },
  sectionIconBox: {
    width: 20, height: 20, borderRadius: 6,
    alignItems: 'center', justifyContent: 'center',
  },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: '#0A1628' },

  // CARD
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 12,
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.15)',
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 8, gap: 8,
  },
  rowIcon: {
    width: 26, height: 26, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  rowTitle: { fontSize: 11, fontWeight: '700', color: '#0A1628', flex: 1 },
  rowValue: { fontSize: 10, color: '#64748B', marginRight: 4 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 10 },

  // FONT ROW
  fontRow: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  fontLabel: {
    fontSize: 11, fontWeight: '700', color: '#0A1628',
    marginBottom: 6,
  },
  chipRow: { flexDirection: 'row', gap: 6 },
  chip: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  chipText: { fontSize: 10, fontWeight: '700', color: '#475569' },
  chipTextActive: { color: '#FFF' },

  // FOOTER
  footer: {
    alignItems: 'center',
    paddingTop: 4,
  },
  footerText: { fontSize: 9, color: '#94A3B8', fontWeight: '600' },
});