import { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getProfile, UserProfile } from '../../services/profileService';
import { getStats, HafalanStats } from '../../services/hafalanService';
import { useBookmarkStore } from '../../store/bookmarkStore';
import { useTilawahStore } from '../../store/tilawahStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeTabScreen() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<HafalanStats | null>(null);
  const { bookmarks } = useBookmarkStore();
  const { getTotalAyat, getStreak } = useTilawahStore();

  // 👇 Auto-load profil & stats tiap halaman dibuka
  useFocusEffect(
    useCallback(() => {
      getProfile().then(setProfile);
      getStats().then(setStats);
    }, [])
  );

  // 👇 Greeting dinamis berdasarkan waktu
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat pagi';
    if (hour < 15) return 'Selamat siang';
    if (hour < 18) return 'Selamat sore';
    return 'Selamat malam';
  };

const quickActions = [
  { id: 'quran', label: 'Quran', desc: '114 Surah', icon: 'book', gradient: ['#10B981', '#059669'], route: '/(tabs)/quran' },
  { id: 'doa', label: 'Doa', desc: '100+ Doa', icon: 'hand-left', gradient: ['#F59E0B', '#D97706'], route: '/(tabs)/doa' },
  { id: 'hafalan', label: 'Hafalan', desc: 'Tracker', icon: 'trophy', gradient: ['#3B82F6', '#2563EB'], route: '/(tabs)/hafalan' },
  { id: 'dzikir', label: 'Dzikir', desc: 'Lengkap', icon: 'sparkles', gradient: ['#EC4899', '#DB2777'], route: '/dzikir' },
  { id: 'bookmark', label: 'Bookmark', desc: `${bookmarks.length} ayat`, icon: 'bookmark', gradient: ['#EAB308', '#CA8A04'], route: '/bookmark' },
  { id: 'qiblat', label: 'Arah Kiblat', desc: 'Kompas', icon: 'compass', gradient: ['#8B5CF6', '#7C3AED'], route: '/qiblat' },
  { id: 'statistik', label: 'Statistik', desc: `${getTotalAyat()} ayat`, icon: 'stats-chart', gradient: ['#06B6D4', '#0891B2'], route: '/statistik' },
];

  const prayerTimes = [
    { name: 'Subuh', time: '04:52' },
    { name: 'Dzuhur', time: '12:13' },
    { name: 'Ashar', time: '15:13' },
    { name: 'Maghrib', time: '18:16' },
    { name: 'Isya', time: '19:21' },
  ];

  const activePrayerIndex = 2;

  return (
    <ImageBackground
      source={require('../../assets/images/BackgroundBeranda1.png')}
      style={styles.bgImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.mainWrapper}>

          {/* ========== HEADER ========== */}
          <LinearGradient
            colors={['#0A1628', '#134E4A', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.ornament1} />
            <View style={styles.ornament2} />

            <View style={styles.headerTop}>
              <View style={styles.headerLeftRow}>
                {profile?.avatar ? (
                  <Image source={{ uri: profile.avatar }} style={styles.headerAvatar} />
                ) : (
                  <View style={styles.headerAvatarPlaceholder}>
                    <Ionicons name="person" size={18} color="#FFF" />
                  </View>
                )}

                <View style={{ flex: 1 }}>
                  <Text style={styles.greeting}>{getGreeting()},</Text>
                  <Text style={styles.name} numberOfLines={1}>
                    {profile?.name || 'Hafiz'} 👋
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.settingsBtn}
                onPress={() => router.push('/pengaturan')}
              >
                <Ionicons name="settings-outline" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.headerBottom}>
              <View style={styles.hijriWrapper}>
                <View style={styles.hijriDot} />
                <Text style={styles.hijriDate}>23 Rabiul Akhir 1448 H</Text>
              </View>

              <LinearGradient
                colors={['rgba(212, 175, 55, 0.25)', 'rgba(212, 175, 55, 0.1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.nextPrayerBox}
              >
                <View style={styles.nextPrayerLeft}>
                  <Ionicons name="time" size={14} color="#D4AF37" />
                  <Text style={styles.nextPrayerName}>Ashar</Text>
                </View>
                <Text style={styles.nextPrayerTime}>15:13</Text>
              </LinearGradient>
            </View>
          </LinearGradient>

          {/* ========== AYAT HARI INI ========== */}
          <View style={styles.ayatCard}>
            <View style={styles.ayatCornerTopLeft} />
            <View style={styles.ayatCornerTopRight} />
            <View style={styles.ayatCornerBottomLeft} />
            <View style={styles.ayatCornerBottomRight} />

            <View style={styles.ayatCardHeader}>
              <LinearGradient colors={['#FEF3C7', '#FDE68A']} style={styles.ayatIconWrapper}>
                <Ionicons name="sparkles" size={12} color="#D97706" />
              </LinearGradient>
              <Text style={styles.ayatLabel}>AYAT HARI INI</Text>
              <View style={styles.ayatDot} />
            </View>

            <Text style={styles.ayatArab}>فَإِنَّ مَعَ الْعُسْرِ يُسْرًا</Text>

            <View style={styles.ayatDivider}>
              <View style={styles.ayatDividerLine} />
              <View style={styles.ayatDividerDot} />
              <View style={styles.ayatDividerLine} />
            </View>

            <Text style={styles.ayatLatin}>Fa inna ma'al 'usri yusra</Text>
            <Text style={styles.ayatArti}>
              "Maka sesungguhnya bersama kesulitan ada kemudahan."
            </Text>
            <Text style={styles.ayatSumber}>QS. Al-Insyirah: 6</Text>
          </View>

          {/* ========== PROGRESS HAFALAN — REAL-TIME ========== */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs)/hafalan')}
          >
            <LinearGradient
              colors={['#059669', '#047857']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressCard}
            >
              <View style={styles.progressLeft}>
                <View style={styles.progressIconWrapper}>
                  <Ionicons name="trophy" size={16} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.progressTitle}>Progress Hafalan</Text>
                  <Text style={styles.progressDetail}>
                    {stats && stats.totalAyatSemua > 0
                      ? `${stats.totalAyatHafal} / ${stats.totalAyatSemua} ayat`
                      : 'Belum ada hafalan'}
                  </Text>
                </View>
              </View>
              <View style={styles.progressRight}>
                <Text style={styles.progressPercent}>
                  {stats?.persen ?? 0}%
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="rgba(255,255,255,0.7)"
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* ========== JADWAL SHOLAT ========== */}
          <View style={styles.prayerCard}>
            <View style={styles.prayerHeader}>
              <View style={styles.prayerLeft}>
                <View style={styles.prayerIconWrapper}>
                  <Ionicons name="moon" size={14} color="#7C3AED" />
                </View>
                <View>
                  <Text style={styles.prayerTitle}>Jadwal Sholat</Text>
                  <Text style={styles.prayerLocation}>Payakumbuh Utara</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/prayer')}
                style={styles.prayerLinkBtn}
              >
                <Text style={styles.prayerLink}>Lihat</Text>
                <Ionicons name="arrow-forward" size={12} color="#7C3AED" />
              </TouchableOpacity>
            </View>

            <View style={styles.prayerTimes}>
              {prayerTimes.map((prayer, idx) => {
                const isActive = idx === activePrayerIndex;
                return (
                  <View key={idx} style={[styles.prayerItem, isActive && styles.prayerItemActive]}>
                    <Text style={[styles.prayerName, isActive && styles.prayerNameActive]}>
                      {prayer.name}
                    </Text>
                    <Text style={[styles.prayerTime, isActive && styles.prayerTimeActive]}>
                      {prayer.time}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* ========== AKSI CEPAT ========== */}
          <View style={styles.actionsWrapper}>
            <View style={styles.actionsGrid}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={[
                    styles.actionCard,
                    action.id === 'bookmark' && { width: '100%' }
                  ]}
                  onPress={() => router.push(action.route as any)}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={action.gradient as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.actionIconWrapper}
                  >
                    <Ionicons name={action.icon as any} size={20} color="#FFFFFF" />
                  </LinearGradient>
                  <View style={styles.actionTextWrapper}>
                    <Text style={styles.actionLabel}>{action.label}</Text>
                    <Text style={styles.actionDesc}>{action.desc}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1 },
  mainWrapper: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 90,
    justifyContent: 'space-between',
  },

  /* HEADER */
  header: {
    paddingHorizontal: 16, paddingVertical: 14,
    borderRadius: 20, overflow: 'hidden', position: 'relative',
  },
  ornament1: {
    position: 'absolute', top: -50, right: -50,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  ornament2: {
    position: 'absolute', bottom: -30, left: -30,
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 10,
    position: 'relative', zIndex: 1,
  },
  headerLeftRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, flex: 1,
  },
  headerAvatar: {
    width: 40, height: 40, borderRadius: 20,
    borderWidth: 2, borderColor: '#D4AF37',
  },
  headerAvatarPlaceholder: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#D4AF37',
  },
  greeting: {
    fontSize: 11, color: 'rgba(255,255,255,0.75)',
    marginBottom: 2,
  },
  name: {
    fontSize: 18, fontWeight: '800', color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  settingsBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  headerBottom: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', gap: 8,
    position: 'relative', zIndex: 1,
  },
  hijriWrapper: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  hijriDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#D4AF37' },
  hijriDate: {
    fontSize: 10, color: '#D4AF37',
    fontWeight: '700', letterSpacing: 0.3,
  },
  nextPrayerBox: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 10, borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  nextPrayerLeft: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  nextPrayerName: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
  nextPrayerTime: {
    fontSize: 12, fontWeight: '800', color: '#FFFFFF',
    marginLeft: 4,
  },

  /* AYAT */
  ayatCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 16, padding: 14,
    borderWidth: 1.5, borderColor: '#FDE68A',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12, shadowRadius: 8, elevation: 3,
    position: 'relative', marginTop: 10,
  },
  ayatCornerTopLeft: {
    position: 'absolute', top: 6, left: 6, width: 14, height: 14,
    borderTopWidth: 2, borderLeftWidth: 2, borderColor: '#FDE68A', borderTopLeftRadius: 6,
  },
  ayatCornerTopRight: {
    position: 'absolute', top: 6, right: 6, width: 14, height: 14,
    borderTopWidth: 2, borderRightWidth: 2, borderColor: '#FDE68A', borderTopRightRadius: 6,
  },
  ayatCornerBottomLeft: {
    position: 'absolute', bottom: 6, left: 6, width: 14, height: 14,
    borderBottomWidth: 2, borderLeftWidth: 2, borderColor: '#FDE68A', borderBottomLeftRadius: 6,
  },
  ayatCornerBottomRight: {
    position: 'absolute', bottom: 6, right: 6, width: 14, height: 14,
    borderBottomWidth: 2, borderRightWidth: 2, borderColor: '#FDE68A', borderBottomRightRadius: 6,
  },
  ayatCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  ayatIconWrapper: {
    width: 22, height: 22, borderRadius: 6,
    alignItems: 'center', justifyContent: 'center',
  },
  ayatLabel: {
    fontSize: 9, fontWeight: '800', color: '#D97706', letterSpacing: 1.2,
  },
  ayatDot: { flex: 1, height: 1, backgroundColor: '#FEF3C7' },
  ayatArab: {
    fontSize: 24, color: '#0A1628',
    textAlign: 'right', lineHeight: 44,
    marginBottom: 6, paddingHorizontal: 2,
    fontFamily: 'Scheherazade-SemiBold',
  },
  ayatDivider: {
    flexDirection: 'row', alignItems: 'center',
    gap: 6, marginVertical: 6,
  },
  ayatDividerLine: { flex: 1, height: 1, backgroundColor: '#FEF3C7' },
  ayatDividerDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#FDE68A' },
  ayatLatin: {
    fontSize: 11, color: '#059669',
    fontStyle: 'italic', fontWeight: '600', marginBottom: 4,
  },
  ayatArti: { fontSize: 11, color: '#334155', lineHeight: 16, marginBottom: 4 },
  ayatSumber: { fontSize: 9, color: '#94A3B8', fontWeight: '600', textAlign: 'right' },

  /* PROGRESS HAFALAN */
  progressCard: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14,
    marginTop: 8,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  progressLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  progressIconWrapper: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  progressTitle: {
    fontSize: 12, fontWeight: '700',
    color: '#FFFFFF', marginBottom: 1,
  },
  progressDetail: { fontSize: 10, color: 'rgba(255,255,255,0.8)' },
  progressRight: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  progressPercent: {
    fontSize: 20, fontWeight: '800',
    color: '#FFFFFF', letterSpacing: -0.5,
  },

  /* JADWAL SHOLAT */
  prayerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: '#E9D5FF',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 2,
    marginTop: 8,
  },
  prayerHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 8,
  },
  prayerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  prayerIconWrapper: {
    width: 26, height: 26, borderRadius: 8,
    backgroundColor: '#F3E8FF',
    alignItems: 'center', justifyContent: 'center',
  },
  prayerTitle: { fontSize: 11, fontWeight: '700', color: '#0A1628' },
  prayerLocation: { fontSize: 9, color: '#64748B' },
  prayerLink: { fontSize: 10, color: '#7C3AED', fontWeight: '700' },
  prayerTimes: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: '#FAF5FF', borderRadius: 10,
    paddingVertical: 8, paddingHorizontal: 4,
  },
  prayerItem: {
    alignItems: 'center', flex: 1,
    paddingVertical: 4, borderRadius: 8,
  },
  prayerItemActive: { backgroundColor: '#7C3AED' },
  prayerName: {
    fontSize: 8, color: '#7C3AED', fontWeight: '600',
    marginBottom: 2, textTransform: 'uppercase',
  },
  prayerNameActive: { color: '#FFFFFF', fontWeight: '800' },
  prayerTime: { fontSize: 10, fontWeight: '800', color: '#0A1628' },
  prayerTimeActive: { color: '#FFFFFF' },

  /* AKSI CEPAT */
  actionsWrapper: { marginTop: 8 },
  actionsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 8, justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%', flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 12, paddingVertical: 10, paddingHorizontal: 10,
    borderWidth: 1, borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    gap: 10,
  },
  actionIconWrapper: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  actionTextWrapper: { flex: 1 },
  actionLabel: {
    fontSize: 12, fontWeight: '700',
    color: '#0A1628', marginBottom: 1,
  },
  actionDesc: { fontSize: 9, color: '#94A3B8', fontWeight: '500' },

  /* PRAYER LINK BTN */
  prayerLinkBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 6, paddingHorizontal: 10,
    backgroundColor: '#F3E8FF', borderRadius: 8,
  },
});