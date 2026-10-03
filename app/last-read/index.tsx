import {
  View, Text, StyleSheet, TouchableOpacity, ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function LastReadScreen() {
  const router = useRouter();

  // 👇 Nanti bisa diganti dari storage (async)
  const lastRead: any = null;   // belum ada riwayat

  return (
    <ImageBackground
      source={require('../../assets/images/BackgroundBeranda1.png')}
      style={styles.bgImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>

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
              <Text style={styles.headerTitle}>Terakhir Baca</Text>
              <Text style={styles.headerSubtitle}>Lanjutkan tilawahmu</Text>
            </View>

            <View style={styles.headerBadge}>
              <Ionicons name="time" size={16} color="#D4AF37" />
            </View>
          </LinearGradient>
        </View>

        {/* CONTENT */}
        {lastRead ? (
          // 👇 Kalau ada riwayat
          <View style={styles.contentWrapper}>
            <TouchableOpacity
              style={styles.lastReadCard}
              onPress={() => router.push(`/surah/${lastRead.surahId}`)}
              activeOpacity={0.75}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.lastReadIconBox}
              >
                <Ionicons name="book" size={22} color="#FFF" />
              </LinearGradient>

              <View style={{ flex: 1 }}>
                <Text style={styles.lastReadLabel}>LANJUT BACA</Text>
                <Text style={styles.lastReadName}>{lastRead.surahName}</Text>
                <Text style={styles.lastReadMeta}>
                  Ayat {lastRead.ayah} · Juz {lastRead.juz}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
            </TouchableOpacity>
          </View>
        ) : (
          // 👇 Kalau belum ada riwayat
          <View style={styles.contentWrapper}>
            <View style={styles.emptyCard}>
              <View style={styles.emptyOrnamentTL} />
              <View style={styles.emptyOrnamentBR} />

              <LinearGradient
                colors={['#ECFDF5', '#D1FAE5']}
                style={styles.emptyIconBox}
              >
                <Ionicons name="time-outline" size={42} color="#059669" />
              </LinearGradient>

              <Text style={styles.emptyTitle}>Belum Ada Riwayat</Text>
              <Text style={styles.emptySubtitle}>
                Mulai baca Qur'an dulu yuk, nanti riwayatnya otomatis muncul di sini 🤲
              </Text>

              <TouchableOpacity
                style={styles.btnWrapper}
                onPress={() => router.push('/(tabs)/quran')}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.btnGradient}
                >
                  <Ionicons name="book" size={16} color="#FFF" />
                  <Text style={styles.btnText}>Baca Qur'an Sekarang</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1 },

  // ============ HEADER ============
  headerWrapper: {
    marginHorizontal: 16,
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
  headerGradient: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    overflow: 'hidden',
  },
  ornament1: {
    position: 'absolute',
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    top: -40, right: -30,
  },
  ornament2: {
    position: 'absolute',
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    bottom: -30, left: -20,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#FFF' },
  headerSubtitle: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  headerBadge: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },

  // ============ CONTENT ============
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 100,
    justifyContent: 'center',
  },

  // ============ EMPTY STATE ============
  emptyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyOrnamentTL: {
    position: 'absolute',
    top: 10, left: 10,
    width: 20, height: 20,
    borderTopWidth: 2, borderLeftWidth: 2,
    borderColor: '#D4AF37',
    borderTopLeftRadius: 8,
    opacity: 0.4,
  },
  emptyOrnamentBR: {
    position: 'absolute',
    bottom: 10, right: 10,
    width: 20, height: 20,
    borderBottomWidth: 2, borderRightWidth: 2,
    borderColor: '#D4AF37',
    borderBottomRightRadius: 8,
    opacity: 0.4,
  },
  emptyIconBox: {
    width: 90, height: 90, borderRadius: 45,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 18,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0A1628',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
    marginBottom: 22,
  },
  btnWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    width: '100%',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  btnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  btnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },

  // ============ LAST READ CARD (kalau ada riwayat) ============
  lastReadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 18,
    padding: 16,
    gap: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  lastReadIconBox: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  lastReadLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#059669',
    letterSpacing: 1,
    marginBottom: 2,
  },
  lastReadName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0A1628',
    marginBottom: 2,
  },
  lastReadMeta: {
    fontSize: 11,
    color: '#64748B',
  },
});