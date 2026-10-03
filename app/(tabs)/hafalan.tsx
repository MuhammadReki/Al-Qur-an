import { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  getAllHafalan, getStats, getStreak, getAchievements,
  generateMurajaahToday, toggleMurajaah,
  HafalanItem, HafalanStats, StreakData, MurajaahItem, Achievement,
} from '../../services/hafalanService';
import { getSurahMeta } from '../../data/surahMeta';

export default function HafalanScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [hafalan, setHafalan] = useState<HafalanItem[]>([]);
  const [stats, setStats] = useState<HafalanStats | null>(null);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [murajaah, setMurajaah] = useState<MurajaahItem[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadAll();
    }, [])
  );

  const loadAll = async () => {
    setLoading(true);
    const [h, s, st, a] = await Promise.all([
      getAllHafalan(),
      getStats(),
      getStreak(),
      getAchievements(),
    ]);
    const m = await generateMurajaahToday();

    setHafalan(h);
    setStats(s);
    setStreak(st);
    setMurajaah(m);
    setAchievements(a);
    setLoading(false);
  };

  const handleToggleMurajaah = async (surahId: number) => {
    const updated = await toggleMurajaah(surahId);
    setMurajaah(updated);
    const newStreak = await getStreak();
    setStreak(newStreak);
  };

  const getStatusInfo = (item: HafalanItem) => {
    if (item.status === 'hafal') {
      return { color: '#16A34A', bg: '#DCFCE7', icon: 'checkmark-circle', label: 'Hafal' };
    }
    if (item.status === 'proses') {
      return { color: '#D97706', bg: '#FEF3C7', icon: 'play-circle', label: 'Proses' };
    }
    return { color: '#64748B', bg: '#F1F5F9', icon: 'ellipse-outline', label: 'Belum' };
  };

  const getWeekDays = () => {
    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const today = new Date();
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const done = streak?.history?.includes(dateStr) || false;
      result.push({ label: days[d.getDay() === 0 ? 6 : d.getDay() - 1], done });
    }
    return result;
  };

  if (loading || !stats || !streak) {
    return (
      <ImageBackground
        source={require('../../assets/images/BackgroundBeranda1.png')}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#059669" />
            <Text style={styles.loadingText}>Memuat hafalan...</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  const weekDays = getWeekDays();

  return (
    <ImageBackground
      source={require('../../assets/images/BackgroundBeranda1.png')}
      style={styles.bgImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* ============ HEADER GRADIENT ============ */}
          <View style={styles.headerWrapper}>
            <LinearGradient
              colors={['#0A1628', '#134E4A', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >
              <View style={styles.headerOrnament1} />
              <View style={styles.headerOrnament2} />

              <View style={styles.headerTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.headerGreet}>PROGRESS HAFALAN</Text>
                  <Text style={styles.headerTitle}>Hafalan Saya</Text>
                </View>

                <View style={styles.streakBadge}>
                  <Text style={styles.streakBadgeEmoji}>🔥</Text>
                  <Text style={styles.streakBadgeText}>{streak.current}</Text>
                </View>
              </View>

              <View style={styles.headerDivider} />

              <View style={styles.headerBottom}>
                <View style={styles.headerStat}>
                  <Text style={styles.headerStatValue}>{stats.totalSurah}</Text>
                  <Text style={styles.headerStatLabel}>Dipelajari</Text>
                </View>
                <View style={styles.headerStatDivider} />
                <View style={styles.headerStat}>
                  <Text style={styles.headerStatValue}>{stats.surahHafal}</Text>
                  <Text style={styles.headerStatLabel}>Hafal</Text>
                </View>
                <View style={styles.headerStatDivider} />
                <View style={styles.headerStat}>
                  <Text style={styles.headerStatValue}>{stats.totalAyatHafal}</Text>
                  <Text style={styles.headerStatLabel}>Total Ayat</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* ============ PROGRESS RING ============ */}
          <View style={styles.progressCard}>
            <View style={styles.progressOrnament} />

            <View style={styles.progressCircleOuter}>
              <LinearGradient
                colors={['#10B981', '#059669', '#047857']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.progressCircleGradient}
              >
                <View style={styles.progressCircleInner}>
                  <Text style={styles.progressPercent}>{stats.persen}%</Text>
                  <Text style={styles.progressLabel}>
                    {stats.totalAyatHafal} / {stats.totalAyatSemua || 0}
                  </Text>
                  <Text style={styles.progressSubLabel}>ayat</Text>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.targetBox}>
              <View style={styles.targetRow}>
                <View style={[styles.targetIconBox, { backgroundColor: '#ECFDF5' }]}>
                  <Ionicons name="flag" size={14} color="#059669" />
                </View>
                <Text style={styles.targetText}>
                  Target hari ini: <Text style={styles.targetBold}>{stats.targetHarian} ayat</Text>
                </Text>
              </View>
              <View style={styles.targetRow}>
                <View style={[styles.targetIconBox, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="checkmark-circle" size={14} color="#D97706" />
                </View>
                <Text style={styles.targetText}>
                  Selesai: <Text style={styles.targetBold}>{stats.selesaiHarian} ayat</Text>
                </Text>
              </View>
            </View>
          </View>

          {/* ============ MURAJAAH ============ */}
          {murajaah.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.sectionIconBox}
                >
                  <Ionicons name="calendar" size={14} color="#FFF" />
                </LinearGradient>
                <Text style={styles.sectionTitle}>Murajaah Hari Ini</Text>
              </View>

              <View style={styles.heatmapCard}>
                <Text style={styles.heatmapLabel}>MINGGU INI</Text>
                <View style={styles.heatmapRow}>
                  {weekDays.map((d, i) => (
                    <View key={i} style={styles.heatmapItem}>
                      {d.done ? (
                        <LinearGradient
                          colors={['#10B981', '#059669']}
                          style={styles.heatmapDot}
                        >
                          <Ionicons name="checkmark" size={12} color="#FFF" />
                        </LinearGradient>
                      ) : (
                        <View style={[styles.heatmapDot, styles.heatmapDotEmpty]} />
                      )}
                      <Text style={styles.heatmapDay}>{d.label}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.murajaahCard}>
                {murajaah.map((m) => {
                  const meta = getSurahMeta(m.surahId);
                  if (!meta) return null;
                  return (
                    <TouchableOpacity
                      key={m.surahId}
                      style={styles.murajaahRow}
                      onPress={() => handleToggleMurajaah(m.surahId)}
                      activeOpacity={0.7}
                    >
                      {m.checked ? (
                        <LinearGradient
                          colors={['#10B981', '#059669']}
                          style={styles.checkbox}
                        >
                          <Ionicons name="checkmark" size={14} color="#FFF" />
                        </LinearGradient>
                      ) : (
                        <View style={[styles.checkbox, styles.checkboxEmpty]} />
                      )}
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.murajaahName,
                            m.checked && styles.murajaahNameDone,
                          ]}
                        >
                          {meta.name}
                        </Text>
                        <Text style={styles.murajaahMeta}>
                          Ulang {m.target}x {m.checked ? '· Selesai ✓' : ''}
                        </Text>
                      </View>
                      <Text style={styles.murajaahArabic}>{meta.nameArabic}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          {/* ============ PROGRESS PER SURAH ============ */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sectionIconBox}
              >
                <Ionicons name="book" size={14} color="#FFF" />
              </LinearGradient>
              <Text style={styles.sectionTitle}>Progress per Surah</Text>
            </View>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => router.push('/hafalan/tambah')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.addBtnGradient}
              >
                <Ionicons name="add" size={14} color="#FFF" />
                <Text style={styles.addBtnText}>Tambah</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {hafalan.length === 0 ? (
            <View style={styles.emptyCard}>
              <LinearGradient
                colors={['#ECFDF5', '#D1FAE5']}
                style={styles.emptyIconBox}
              >
                <Ionicons name="book-outline" size={36} color="#059669" />
              </LinearGradient>
              <Text style={styles.emptyText}>Belum ada hafalan</Text>
              <Text style={styles.emptySubtext}>
                Tap "+ Tambah" untuk mulai menghafal
              </Text>
            </View>
          ) : (
            hafalan.map((item) => {
              const meta = getSurahMeta(item.surahId);
              if (!meta) return null;
              const info = getStatusInfo(item);
              const persen = Math.round((item.ayatHafal / item.totalAyat) * 100);

              return (
                <TouchableOpacity
                  key={item.surahId}
                  style={styles.surahCard}
                  onPress={() => router.push(`/hafalan/${item.surahId}`)}
                  activeOpacity={0.7}
                >
                  <View style={styles.surahHeader}>
                    <View style={styles.surahLeft}>
                      <Text style={styles.surahName}>{meta.name}</Text>
                      <Text style={styles.surahMeta}>
                        {item.ayatHafal} / {item.totalAyat} ayat · {persen}%
                      </Text>
                    </View>
                    <View style={styles.surahRight}>
                      <Text style={styles.surahArabic}>{meta.nameArabic}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: info.bg }]}>
                        <Ionicons name={info.icon as any} size={11} color={info.color} />
                        <Text style={[styles.statusText, { color: info.color }]}>
                          {info.label}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${persen}%`, backgroundColor: info.color },
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              );
            })
          )}

          {/* ============ ACHIEVEMENT ============ */}
          <View style={styles.sectionHeader}>
            <LinearGradient
              colors={['#D4AF37', '#B8941F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sectionIconBox}
            >
              <Ionicons name="trophy" size={14} color="#FFF" />
            </LinearGradient>
            <Text style={styles.sectionTitle}>Pencapaian</Text>
          </View>

          <View style={styles.achievementGrid}>
            {achievements.map((a) => (
              <View
                key={a.id}
                style={[
                  styles.achievementCard,
                  a.unlocked ? styles.achievementUnlocked : styles.achievementLocked,
                ]}
              >
                {a.unlocked && (
                  <LinearGradient
                    colors={['rgba(212, 175, 55, 0.15)', 'rgba(212, 175, 55, 0)']}
                    style={styles.achievementShine}
                  />
                )}
                <Text style={styles.achievementIcon}>
                  {a.unlocked ? a.icon : '🔒'}
                </Text>
                <Text
                  style={[
                    styles.achievementTitle,
                    !a.unlocked && styles.achievementTitleLocked,
                  ]}
                >
                  {a.title}
                </Text>
                <Text style={styles.achievementDesc}>{a.desc}</Text>

                {a.unlocked && (
                  <View style={styles.achievementBadge}>
                    <Ionicons name="checkmark-circle" size={12} color="#D4AF37" />
                  </View>
                )}
              </View>
            ))}
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#059669', fontSize: 14 },

  // ============ HEADER ============
  headerWrapper: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  headerGradient: { padding: 18, overflow: 'hidden' },
  headerOrnament1: {
    position: 'absolute',
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    top: -50, right: -40,
  },
  headerOrnament2: {
    position: 'absolute',
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(212, 175, 55, 0.10)',
    bottom: -30, left: -30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerGreet: {
    fontSize: 10,
    color: 'rgba(212, 175, 55, 0.95)',
    letterSpacing: 1.5,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#FFF' },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  streakBadgeEmoji: { fontSize: 14 },
  streakBadgeText: { fontSize: 13, fontWeight: '800', color: '#D4AF37' },
  headerDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginVertical: 14,
  },
  headerBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  headerStat: { alignItems: 'center', flex: 1 },
  headerStatValue: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  headerStatLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 2,
  },
  headerStatDivider: {
    width: 1, height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },

  // ============ PROGRESS ============
  progressCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    overflow: 'hidden',
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  progressOrnament: {
    position: 'absolute',
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(16, 185, 129, 0.04)',
    top: -80, right: -80,
  },
  progressCircleOuter: {
    width: 160, height: 160, borderRadius: 80,
    elevation: 6,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  progressCircleGradient: {
    width: 160, height: 160, borderRadius: 80,
    alignItems: 'center', justifyContent: 'center', padding: 6,
  },
  progressCircleInner: {
    width: '100%', height: '100%', borderRadius: 74,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
  },
  progressPercent: { fontSize: 40, fontWeight: '800', color: '#059669' },
  progressLabel: { fontSize: 14, fontWeight: '700', color: '#0A1628', marginTop: 2 },
  progressSubLabel: { fontSize: 10, color: '#94A3B8' },

  targetBox: {
    marginTop: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  targetRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  targetIconBox: {
    width: 26, height: 26, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  targetText: { fontSize: 12, color: '#475569', flex: 1 },
  targetBold: { fontWeight: '700', color: '#0A1628' },

  // ============ SECTION ============
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 8,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 8,
  },
  sectionIconBox: {
    width: 28, height: 28, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    elevation: 3,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0A1628' },
  addBtn: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  addBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  addBtnText: { fontSize: 12, fontWeight: '700', color: '#FFF' },

  // ============ HEATMAP ============
  heatmapCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  heatmapLabel: {
    fontSize: 10, color: '#64748B',
    marginBottom: 10, fontWeight: '700', letterSpacing: 1,
  },
  heatmapRow: { flexDirection: 'row', justifyContent: 'space-between' },
  heatmapItem: { alignItems: 'center', gap: 4 },
  heatmapDot: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  heatmapDotEmpty: { backgroundColor: '#F1F5F9' },
  heatmapDay: { fontSize: 10, color: '#94A3B8', fontWeight: '600' },

  // ============ MURAJAAH ============
  murajaahCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 14,
    padding: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  murajaahRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  checkbox: {
    width: 24, height: 24, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxEmpty: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  murajaahName: { fontSize: 14, fontWeight: '700', color: '#0A1628' },
  murajaahNameDone: { textDecorationLine: 'line-through', color: '#94A3B8' },
  murajaahMeta: { fontSize: 11, color: '#64748B', marginTop: 2 },
  murajaahArabic: {
    fontSize: 18, color: '#059669',
    fontFamily: 'Amiri-Regular',
  },

  // ============ SURAH CARD ============
  surahCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  surahHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  surahLeft: { flex: 1 },
  surahName: { fontSize: 15, fontWeight: '800', color: '#0A1628' },
  surahMeta: { fontSize: 11, color: '#64748B', marginTop: 2 },
  surahRight: { alignItems: 'flex-end', gap: 6 },
  surahArabic: {
    fontSize: 20, color: '#059669',
    fontFamily: 'Amiri-Regular',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: { fontSize: 10, fontWeight: '800' },
  progressBarBg: {
    height: 6, backgroundColor: '#F1F5F9',
    borderRadius: 3, overflow: 'hidden',
  },
  progressBarFill: { height: '100%', borderRadius: 3 },

  // ============ EMPTY ============
  emptyCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  emptyIconBox: {
    width: 70, height: 70, borderRadius: 35,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  emptyText: { fontSize: 15, fontWeight: '700', color: '#0A1628' },
  emptySubtext: { fontSize: 12, color: '#94A3B8', marginTop: 4 },

  // ============ ACHIEVEMENT ============
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
  },
  achievementCard: {
    width: '48%',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    overflow: 'hidden',
  },
  achievementUnlocked: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  achievementLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    opacity: 0.65,
  },
  achievementShine: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '60%',
  },
  achievementIcon: { fontSize: 30, marginBottom: 6 },
  achievementTitle: {
    fontSize: 12, fontWeight: '800',
    color: '#0A1628', textAlign: 'center',
  },
  achievementTitleLocked: { color: '#94A3B8' },
  achievementDesc: {
    fontSize: 10, color: '#64748B',
    textAlign: 'center', marginTop: 4,
  },
  achievementBadge: { position: 'absolute', top: 8, right: 8 },
});