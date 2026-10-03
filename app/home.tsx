import {
  View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  const menus = [
    {
      id: 'read',
      label: 'BACA QUR\'AN',
      icon: 'book',
      color: '#059669',
      route: '/(tabs)/quran',
    },
    {
      id: 'last-read',
      label: 'TERAKHIR BACA',
      icon: 'time',
      color: '#0EA5E9',
      route: '/last-read',
    },
    {
      id: 'search',
      label: 'PENCARIAN',
      icon: 'search',
      color: '#D97706',
      route: '/search',
    },
    {
      id: 'prayer',
      label: 'JADWAL SHOLAT',
      icon: 'moon',
      color: '#7C3AED',
      route: '/prayer',
    },
    {
      id: 'settings',
      label: 'PENGATURAN',
      icon: 'settings',
      color: '#64748B',
      route: '/pengaturan',
    },
  ];

  return (
    <ImageBackground
      source={require('../assets/images/Background6.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER: Ayat Al-Quran + Nama App */}
          <View style={styles.header}>
            <View style={styles.ayatCard}>
              <Text style={styles.ayatLabel}>AYAT HARI INI</Text>
              <Text style={styles.ayatArab}>
                يٰٓاَيُّهَا النَّاسُ قَدْ جَاۤءَتْكُمْ مَّوْعِظَةٌ مِّنْ رَّبِّكُمْ
              </Text>
              <Text style={styles.ayatLatin}>
                Yā ayyuhan-nāsu qad jā'atkum mau'iẓatum mir rabbikum
              </Text>
              <View style={styles.ayatDivider} />
              <Text style={styles.ayatArti}>
                "Wahai manusia, sungguh telah datang kepadamu pelajaran (Al-Qur'an) dari Tuhanmu."
              </Text>
              <Text style={styles.ayatSumber}>— QS. Yunus: 57</Text>
            </View>

            <Text style={styles.appName}>Tilawah</Text>
            <Text style={styles.tagline}>Teman setia hafalanmu</Text>
          </View>

          {/* MENU UTAMA */}
          <View style={styles.menuContainer}>
            {menus.map((menu) => (
              <TouchableOpacity
                key={menu.id}
                style={[styles.menuButton, { borderColor: menu.color }]}
                onPress={() => router.push(menu.route as any)}
                activeOpacity={0.85}
              >
                <View style={[styles.menuIconWrapper, { backgroundColor: menu.color }]}>
                  <Ionicons name={menu.icon as any} size={18} color="#FFFFFF" />
                </View>
                <Text style={styles.menuLabel}>{menu.label}</Text>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>
            ))}
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>🤲 Sumber: Kemenag RI</Text>
            <Text style={styles.footerVersion}>v1.0.0</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 22, 40, 0.4)',
  },
  safeArea: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 20,
    justifyContent: 'center',
  },

  /* HEADER */
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  ayatCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    marginBottom: 20,
  },
  ayatLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D4AF37',
    letterSpacing: 2,
    marginBottom: 10,
    textAlign: 'center',
  },
  ayatArab: {
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 42,
    fontFamily: 'Scheherazade-SemiBold',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  ayatLatin: {
    fontSize: 12,
    color: 'rgba(212, 175, 55, 0.9)',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  ayatDivider: {
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.3)',
    marginVertical: 10,
  },
  ayatArti: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  ayatSumber: {
    fontSize: 10,
    color: 'rgba(212, 175, 55, 0.8)',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 3,
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  tagline: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    fontStyle: 'italic',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  /* MENU */
  menuContainer: {
    width: '100%',
    maxWidth: 380,
    alignSelf: 'center',
    gap: 10,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  menuIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#0A1628',
    letterSpacing: 0.4,
  },

  /* FOOTER */
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 3,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  footerVersion: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
  },
});