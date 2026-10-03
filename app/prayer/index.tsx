import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getUserLocation } from '../../services/locationService';
import {
  getPrayerTimes, getNextPrayer, PrayerData,
} from '../../services/prayerApi';

export default function PrayerScreen() {
  const router = useRouter();
  const [data, setData] = useState<PrayerData | null>(null);
  const [nextPrayer, setNextPrayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const loc = await getUserLocation();
      setLocationName(loc.city);

      const prayer = await getPrayerTimes(loc.latitude, loc.longitude);
      setData(prayer);
      setNextPrayer(getNextPrayer(prayer.waktu));
    } catch (e: any) {
      setError(e.message || 'Gagal memuat jadwal sholat');
    } finally {
      setLoading(false);
    }
  };

  // ===== LOADING =====
  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#5B21B6', '#7C3AED', '#A78BFA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fullGradient}
        >
          <View style={styles.ornament1} />
          <View style={styles.ornament2} />
          <SafeAreaView style={styles.centerAll}>
            <View style={styles.loadingCircle}>
              <ActivityIndicator size="large" color="#7C3AED" />
            </View>
            <Text style={styles.loadingText}>Menghitung Jadwal Sholat</Text>
            <Text style={styles.loadingSub}>Berdasarkan lokasi Anda</Text>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  // ===== ERROR =====
  if (error || !data) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#5B21B6', '#7C3AED', '#A78BFA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fullGradient}
        >
          <View style={styles.ornament1} />
          <View style={styles.ornament2} />
          <SafeAreaView style={styles.centerAll}>
            <Ionicons name="alert-circle" size={64} color="rgba(255,255,255,0.5)" />
            <Text style={styles.errorText}>{error || 'Gagal memuat data'}</Text>
            <TouchableOpacity onPress={loadData} style={styles.retryBtn}>
              <Text style={styles.retryBtnText}>Coba Lagi</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
              <Text style={styles.backLink}>Kembali</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  const prayers = [
    { name: 'Imsak', time: data.waktu.imsak, icon: 'moon-outline' },
    { name: 'Subuh', time: data.waktu.subuh, icon: 'cloudy-night' },
    { name: 'Terbit', time: data.waktu.terbit, icon: 'sunny-outline' },
    { name: 'Dzuhur', time: data.waktu.dzuhur, icon: 'sunny' },
    { name: 'Ashar', time: data.waktu.ashar, icon: 'partly-sunny' },
    { name: 'Maghrib', time: data.waktu.maghrib, icon: 'cloudy-night' },
    { name: 'Isya', time: data.waktu.isya, icon: 'moon' },
  ];

  return (
    <View style={styles.container}>
      {/* ===== FULL GRADIENT BACKGROUND ===== */}
      <LinearGradient
        colors={['#5B21B6', '#7C3AED', '#A78BFA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fullGradient}
      >
        {/* Ornamen Islami */}
        <View style={styles.ornament1} />
        <View style={styles.ornament2} />
        <View style={styles.ornament3} />
        <View style={styles.ornament4} />

        <SafeAreaView style={styles.safeArea}>
          {/* ===== TOP BAR ===== */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.topBarCenter}>
              <Text style={styles.topBarTitle}>Jadwal Sholat</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={11} color="rgba(255,255,255,0.8)" />
                <Text style={styles.topBarLocation}>{locationName}</Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => router.push('/settings')} style={styles.iconBtn}>
              <Ionicons name="settings-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* ===== NEXT PRAYER CARD (BIG) ===== */}
          {nextPrayer && (
            <View style={styles.nextCard}>
              {/* Ornamen Sudut */}
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />

              <View style={styles.nextCardTop}>
                <View style={styles.pulseDot} />
                <Text style={styles.nextLabel}>SHOLAT BERIKUTNYA</Text>
              </View>

              <Text style={styles.nextName}>{nextPrayer.name}</Text>

              <View style={styles.nextTimeRow}>
                <Text style={styles.nextTime}>{nextPrayer.time}</Text>
                <View style={styles.countdownBadge}>
                  <Ionicons name="hourglass-outline" size={11} color="#FFFFFF" />
                  <Text style={styles.countdownText}>{nextPrayer.countdown}</Text>
                </View>
              </View>
            </View>
          )}

          {/* ===== DATE ROW ===== */}
          <View style={styles.dateRow}>
            <View style={styles.dateItem}>
              <Ionicons name="calendar-outline" size={14} color="#FFFFFF" />
              <Text style={styles.dateText}>{data.tanggal}</Text>
            </View>
            <View style={styles.dateSeparator} />
            <View style={styles.dateItem}>
              <Ionicons name="moon-outline" size={14} color="#FDE68A" />
              <Text style={[styles.dateText, { color: '#FDE68A' }]}>{data.hijriah}</Text>
            </View>
          </View>

          {/* ===== PRAYER GRID (7 WAKTU) ===== */}
          <View style={styles.prayerGrid}>
            {prayers.map((prayer, idx) => {
              const isNext = nextPrayer && prayer.name === nextPrayer.name.replace(' (besok)', '');

              return (
                <View
                  key={idx}
                  style={[styles.prayerItem, isNext && styles.prayerItemActive]}
                >
                  <View style={[styles.prayerIconWrapper, isNext && styles.prayerIconWrapperActive]}>
                    <Ionicons
                      name={prayer.icon as any}
                      size={18}
                      color={isNext ? '#7C3AED' : '#FFFFFF'}
                    />
                  </View>

                  <Text style={[styles.prayerName, isNext && styles.prayerNameActive]}>
                    {prayer.name}
                  </Text>

                  <Text style={[styles.prayerTime, isNext && styles.prayerTimeActive]}>
                    {prayer.time}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* ===== FOOTER ===== */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>🤲 Dihitung otomatis berdasarkan lokasi Anda</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#5B21B6' },
  fullGradient: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  centerAll: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  /* ===== ORNAMENTS ===== */
  ornament1: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  ornament2: {
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  ornament3: {
    position: 'absolute',
    top: '40%',
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
  },
  ornament4: {
    position: 'absolute',
    top: '20%',
    left: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(212, 175, 55, 0.06)',
  },

  /* ===== LOADING ===== */
  loadingCircle: {
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  loadingText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  loadingSub: { fontSize: 11, color: 'rgba(255,255,255,0.75)' },

  /* ===== ERROR ===== */
  errorText: {
    marginTop: 12, color: '#FFFFFF', fontSize: 13,
    textAlign: 'center', paddingHorizontal: 20,
  },
  retryBtn: {
    marginTop: 20, backgroundColor: '#FFFFFF',
    paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10,
  },
  retryBtnText: { color: '#7C3AED', fontWeight: '700' },
  backLink: { color: 'rgba(255,255,255,0.7)', fontSize: 12, textDecorationLine: 'underline' },

  /* ===== TOP BAR ===== */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 12,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  topBarCenter: { alignItems: 'center', flex: 1 },
  topBarTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  topBarLocation: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },

  /* ===== NEXT PRAYER CARD ===== */
  nextCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 4,
  },
  cornerTL: {
    position: 'absolute', top: 6, left: 6, width: 14, height: 14,
    borderTopWidth: 1.5, borderLeftWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    borderTopLeftRadius: 5,
  },
  cornerTR: {
    position: 'absolute', top: 6, right: 6, width: 14, height: 14,
    borderTopWidth: 1.5, borderRightWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    borderTopRightRadius: 5,
  },
  cornerBL: {
    position: 'absolute', bottom: 6, left: 6, width: 14, height: 14,
    borderBottomWidth: 1.5, borderLeftWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    borderBottomLeftRadius: 5,
  },
  cornerBR: {
    position: 'absolute', bottom: 6, right: 6, width: 14, height: 14,
    borderBottomWidth: 1.5, borderRightWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    borderBottomRightRadius: 5,
  },
  nextCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FDE68A',
  },
  nextLabel: {
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  nextName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  nextTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  nextTime: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1.5,
    lineHeight: 44,
  },
  countdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  countdownText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* ===== DATE ROW ===== */
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dateText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  dateSeparator: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },

  /* ===== PRAYER GRID ===== */
  prayerGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  prayerItem: {
    width: '32%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  prayerItemActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FDE68A',
    shadowColor: '#FDE68A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  prayerIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  prayerIconWrapperActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
  },
  prayerName: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  prayerNameActive: {
    color: '#7C3AED',
    fontWeight: '800',
  },
  prayerTime: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  prayerTimeActive: {
    color: '#7C3AED',
  },

  /* ===== FOOTER ===== */
  footer: {
    alignItems: 'center',
    paddingTop: 4,
  },
  footerText: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});