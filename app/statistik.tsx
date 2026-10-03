import { useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTilawahStore } from '../store/tilawahStore';

// Format tanggal jadi YYYY-MM-DD
const formatKey = (d: Date) => d.toISOString().split('T')[0];

export default function StatistikScreen() {
  const router = useRouter();
  const { dailyAyat, targetHarian, getStreak, getTotalAyat, getTodayAyat } =
    useTilawahStore();

  const streak = getStreak();
  const totalAyat = getTotalAyat();
  const todayAyat = getTodayAyat();

  // Bikin data heatmap 12 minggu terakhir (84 hari)
  const heatmapData = useMemo(() => {
    const weeks: { date: string; count: number; day: number }[][] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Mulai dari 83 hari lalu
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 83);

    let currentWeek: { date: string; count: number; day: number }[] = [];

    for (let i = 0; i < 84; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const key = formatKey(d);
      const day = d.getDay(); // 0 = Minggu

      currentWeek.push({
        date: key,
        count: dailyAyat[key] || 0,
        day,
      });

      if (day === 6 || i === 83) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    return weeks;
  }, [dailyAyat]);

  // Warna berdasarkan jumlah ayat
  const getColor = (count: number) => {
    if (count === 0) return 'rgba(255,255,255,0.08)';
    if (count < 5) return '#064E3B';
    if (count < 15) return '#047857';
    if (count < 30) return '#059669';
    if (count < 60) return '#10B981';
    return '#34D399';
  };

  // Progress target hari ini
  const progressToday = Math.min((todayAyat / targetHarian) * 100, 100);

  // Rata-rata per hari
  const activeDays = Object.keys(dailyAyat).length;
  const avgPerDay = activeDays > 0 ? Math.round(totalAyat / activeDays) : 0;

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const dayNames = ['M', 'S', 'S', 'R', 'K', 'J', 'S'];

  return (
    <ImageBackground
      source={require('../assets/images/BackgroundBeranda1.png')}
      style={styles.bgImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={['#0A1628', '#134E4A', '#059669']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerOrnament1} />
          <View style={styles.headerOrnament2} />

          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Statistik Tilawah</Text>
            <Text style={styles.headerSubtitle}>Progress baca Al-Qur'an kamu</Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons name="stats-chart" size={20} color="#D4AF37" />
          </View>
        </LinearGradient>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 3 Stat Cards */}
          <View style={styles.statsRow}>
            <LinearGradient
              colors={['#059669', '#047857']}
              style={styles.statCard}
            >
              <Ionicons name="flame" size={20} color="#FCD34D" />
              <Text style={styles.statValue}>{streak}</Text>
              <Text style={styles.statLabel}>Hari Streak</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#7C3AED', '#6D28D9']}
              style={styles.statCard}
            >
              <Ionicons name="book" size={20} color="#FFFFFF" />
              <Text style={styles.statValue}>{totalAyat}</Text>
              <Text style={styles.statLabel}>Total Ayat</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              style={styles.statCard}
            >
              <Ionicons name="trending-up" size={20} color="#FFFFFF" />
              <Text style={styles.statValue}>{avgPerDay}</Text>
              <Text style={styles.statLabel}>Rata-rata/Hari</Text>
            </LinearGradient>
          </View>

          {/* Target Hari Ini */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="flag" size={18} color="#059669" />
              <Text style={styles.cardTitle}>Target Hari Ini</Text>
              <Text style={styles.cardBadge}>
                {todayAyat} / {targetHarian}
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <LinearGradient
                colors={['#059669', '#10B981']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${progressToday}%` }]}
              />
            </View>
            <Text style={styles.cardHint}>
              {progressToday >= 100
                ? '🎉 MasyaAllah, target hari ini tercapai!'
                : `Kurang ${targetHarian - todayAyat} ayat lagi`}
            </Text>
          </View>

          {/* Heatmap */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="calendar" size={18} color="#059669" />
              <Text style={styles.cardTitle}>12 Minggu Terakhir</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.heatmapContainer}>
                {/* Labels hari */}
                <View style={styles.dayLabels}>
                  {dayNames.map((d, i) => (
                    <Text key={i} style={styles.dayLabelText}>
                      {d}
                    </Text>
                  ))}
                </View>

                {/* Grid */}
                <View style={styles.heatmapGrid}>
                  {heatmapData.map((week, wi) => (
                    <View key={wi} style={styles.weekColumn}>
                      {[0, 1, 2, 3, 4, 5, 6].map((dayNum) => {
                        const cell = week.find((c) => c.day === dayNum);
                        if (!cell) {
                          return <View key={dayNum} style={styles.emptyCell} />;
                        }
                        return (
                          <View
                            key={dayNum}
                            style={[
                              styles.dayCell,
                              { backgroundColor: getColor(cell.count) },
                            ]}
                          />
                        );
                      })}
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Legend */}
            <View style={styles.legend}>
              <Text style={styles.legendText}>Sedikit</Text>
              {[0, 1, 5, 15, 30, 60].map((c, i) => (
                <View
                  key={i}
                  style={[styles.legendCell, { backgroundColor: getColor(c) }]}
                />
              ))}
              <Text style={styles.legendText}>Banyak</Text>
            </View>
          </View>

          {/* Info */}
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={16} color="#7C3AED" />
            <Text style={styles.infoText}>
              Statistik dihitung dari ayat yang kamu baca. Terus istiqomah
              tilawah setiap hari ya! 🌙
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1 },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    overflow: 'hidden', position: 'relative',
    shadowColor: '#059669', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  headerOrnament1: {
    position: 'absolute', top: -40, right: -40,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
  },
  headerOrnament2: {
    position: 'absolute', bottom: -30, left: -20,
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  backButton: {
    width: 42, height: 42, borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)', zIndex: 1,
  },
  headerInfo: { flex: 1, zIndex: 1 },
  headerTitle: {
    fontSize: 17, fontWeight: '800', color: '#FFFFFF',
    letterSpacing: 0.3, marginBottom: 2,
  },
  headerSubtitle: { fontSize: 11, color: 'rgba(255,255,255,0.8)' },
  headerIcon: {
    width: 42, height: 42, borderRadius: 14,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.4)', zIndex: 1,
  },

  scrollContent: { padding: 16, paddingBottom: 40 },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },

  card: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    color: '#0A1628',
  },
  cardBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  progressTrack: {
    height: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: 10,
    borderRadius: 5,
  },
  cardHint: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
    textAlign: 'center',
  },

  heatmapContainer: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 8,
  },
  dayLabels: {
    justifyContent: 'space-between',
    paddingTop: 2,
    paddingBottom: 2,
  },
  dayLabelText: {
    fontSize: 9,
    color: '#94A3B8',
    height: 13,
    lineHeight: 13,
    fontWeight: '600',
  },
  heatmapGrid: {
    flexDirection: 'row',
    gap: 3,
  },
  weekColumn: {
    gap: 3,
  },
  dayCell: {
    width: 13,
    height: 13,
    borderRadius: 3,
  },
  emptyCell: {
    width: 13,
    height: 13,
  },

  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  legendText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  legendCell: {
    width: 11,
    height: 11,
    borderRadius: 3,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(243, 232, 255, 0.9)',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.2)',
    borderLeftWidth: 3,
    borderLeftColor: '#7C3AED',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#4C1D95',
    lineHeight: 18,
    fontStyle: 'italic',
  },
});