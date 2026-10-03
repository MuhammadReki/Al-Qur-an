import {
  View, Text, StyleSheet, ImageBackground, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function TentangScreen() {
  const router = useRouter();

  const fiturList = [
    { icon: 'book', title: 'Al-Quran 114 Surah', desc: 'Kemenag RI offline', color: '#059669' },
    { icon: 'hand-left', title: 'Doa Harian', desc: '227 doa EQuran.id', color: '#D97706' },
    { icon: 'trophy', title: 'Hafalan Tracker', desc: 'CRUD + streak', color: '#3B82F6' },
    { icon: 'time', title: 'Jadwal Sholat', desc: 'Aladhan API', color: '#7C3AED' },
  ];

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
                <Ionicons name="arrow-back" size={20} color="#FFF" />
              </TouchableOpacity>

              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>Tentang Aplikasi</Text>
                <Text style={styles.headerSubtitle}>HafizKu v1.0.0</Text>
              </View>
            </LinearGradient>
          </View>

          {/* LOGO + NAMA */}
          <View style={styles.logoSection}>
            <LinearGradient
              colors={['#10B981', '#059669', '#047857']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoCircle}
            >
              <Ionicons name="book" size={36} color="#FFF" />
            </LinearGradient>

            <View style={styles.logoTextWrapper}>
              <Text style={styles.appName}>HafizKu</Text>
              <Text style={styles.appTagline}>Teman setia hafalanmu 🤲</Text>
            </View>

            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>v1.0.0</Text>
            </View>
          </View>

          {/* DESKRIPSI */}
          <View style={styles.descCard}>
            <Text style={styles.descText}>
              Aplikasi Al-Quran lengkap untuk membantu perjalanan hafalan dan
              ibadah harianmu. Dilengkapi Al-Quran 114 surah, doa harian, jadwal
              sholat real-time, dan tracker hafalan interaktif.
            </Text>
          </View>

          {/* FITUR */}
          <Text style={styles.sectionTitle}>✨ Fitur Unggulan</Text>
          <View style={styles.fiturGrid}>
            {fiturList.map((f, i) => (
              <View key={i} style={styles.fiturItem}>
                <LinearGradient
                  colors={[`${f.color}30`, `${f.color}15`]}
                  style={styles.fiturIcon}
                >
                  <Ionicons name={f.icon as any} size={16} color={f.color} />
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fiturTitle} numberOfLines={1}>{f.title}</Text>
                  <Text style={styles.fiturDesc} numberOfLines={1}>{f.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}></Text>
            <Text style={styles.footerSub}></Text>
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
    paddingBottom: 90,   // kasih ruang buat bottom tab
    justifyContent: 'space-between',
  },

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
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  headerSubtitle: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },

  // LOGO SECTION
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    gap: 12,
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  logoCircle: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  logoTextWrapper: { flex: 1 },
  appName: { fontSize: 20, fontWeight: '800', color: '#0A1628' },
  appTagline: { fontSize: 11, color: '#64748B', marginTop: 2 },
  versionBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  versionText: { fontSize: 10, fontWeight: '700', color: '#059669' },

  // DESKRIPSI
  descCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  descText: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 17,
    textAlign: 'justify',
  },

  // SECTION TITLE
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0A1628',
    marginBottom: 6,
  },

  // FITUR GRID
  fiturGrid: {
    gap: 6,
  },
  fiturItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 10,
  },
  fiturIcon: {
    width: 32, height: 32, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  fiturTitle: { fontSize: 12, fontWeight: '700', color: '#0A1628' },
  fiturDesc: { fontSize: 10, color: '#64748B', marginTop: 1 },

  // FOOTER
  footer: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  footerText: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  footerSub: { fontSize: 10, color: '#94A3B8', marginTop: 2 },
});