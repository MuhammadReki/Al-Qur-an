import { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getAllSurah } from '../../services/quranLocal';

type SearchMode = 'surah' | 'ayat';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<SearchMode>('surah');

  const surahs = getAllSurah();

  // 👇 Filter surah berdasarkan query
  const filteredSurahs = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase().trim();

    return surahs.filter((s) => {
      // Cari by nomor
      if (s.id.toString() === q) return true;
      // Cari by nama Latin
      if (s.transliteration.toLowerCase().includes(q)) return true;
      // Cari by arti
      if (s.translation.toLowerCase().includes(q)) return true;
      // Cari by Arab
      if (s.arabic.includes(q)) return true;
      return false;
    });
  }, [query, surahs]);

  const renderSurahResult = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={() => router.push(`/surah/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.cardCorner} />

      <LinearGradient
        colors={['#10B981', '#059669']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.numberBox}
      >
        <Text style={styles.numberText}>{item.id}</Text>
      </LinearGradient>

      <View style={styles.resultInfo}>
        <Text style={styles.resultName} numberOfLines={1}>
          {item.transliteration}
        </Text>
        <Text style={styles.resultMeta} numberOfLines={1}>
          {item.translation} · {item.num_ayah} ayat
        </Text>
      </View>

      <Text style={styles.resultArabic} numberOfLines={1}>
        {item.arabic}
      </Text>

      <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
    </TouchableOpacity>
  );

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
              <Text style={styles.headerTitle}>Pencarian</Text>
              <Text style={styles.headerSubtitle}>
                Cari surah, ayat, atau arti
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#059669" />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari surah, arti, atau nomor..."
              placeholderTextColor="#94A3B8"
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* MODE TABS */}
        <View style={styles.modeWrapper}>
          <TouchableOpacity
            style={[styles.modeTab, mode === 'surah' && styles.modeTabActive]}
            onPress={() => setMode('surah')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="book"
              size={14}
              color={mode === 'surah' ? '#FFF' : '#64748B'}
            />
            <Text style={[styles.modeText, mode === 'surah' && styles.modeTextActive]}>
              Surah
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeTab, mode === 'ayat' && styles.modeTabActive]}
            onPress={() => setMode('ayat')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="document-text"
              size={14}
              color={mode === 'ayat' ? '#FFF' : '#64748B'}
            />
            <Text style={[styles.modeText, mode === 'ayat' && styles.modeTextActive]}>
              Ayat
            </Text>
          </TouchableOpacity>
        </View>

        {/* CONTENT */}
        <View style={styles.contentWrapper}>

          {/* KALAU BELUM NGETIK */}
          {!query.trim() && (
            <View style={styles.emptyState}>
              <LinearGradient
                colors={['#ECFDF5', '#D1FAE5']}
                style={styles.emptyIconBox}
              >
                <Ionicons name="search" size={42} color="#059669" />
              </LinearGradient>

              <Text style={styles.emptyTitle}>Mau Cari Apa?</Text>
              <Text style={styles.emptySubtitle}>
                Ketik nama surah, arti, atau nomor surah di kolom pencarian di atas
              </Text>

              {/* Saran Populer */}
              <View style={styles.suggestionWrapper}>
                <Text style={styles.suggestionLabel}>Saran Populer</Text>
                <View style={styles.suggestionRow}>
                  {['Al-Fatihah', 'Yasin', 'Al-Kahf', 'Ar-Rahman'].map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={styles.suggestionChip}
                      onPress={() => setQuery(s)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.suggestionText}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* KALAU MODE AYAT */}
          {query.trim() && mode === 'ayat' && (
            <View style={styles.emptyState}>
              <LinearGradient
                colors={['#FEF3C7', '#FDE68A']}
                style={styles.emptyIconBox}
              >
                <Ionicons name="construct" size={42} color="#D97706" />
              </LinearGradient>

              <Text style={styles.emptyTitle}>Segera Hadir</Text>
              <Text style={styles.emptySubtitle}>
                Pencarian ayat lengkap bakal hadir di update berikutnya 🤲
              </Text>
            </View>
          )}

          {/* KALAU MODE SURAH & ADA QUERY */}
          {query.trim() && mode === 'surah' && (
            <>
              <View style={styles.resultInfoRow}>
                <Text style={styles.resultInfoText}>
                  {filteredSurahs.length} surah ditemukan
                </Text>
              </View>

              {filteredSurahs.length === 0 ? (
                <View style={styles.emptyState}>
                  <LinearGradient
                    colors={['#FEE2E2', '#FECACA']}
                    style={styles.emptyIconBox}
                  >
                    <Ionicons name="sad-outline" size={42} color="#DC2626" />
                  </LinearGradient>

                  <Text style={styles.emptyTitle}>Gak Ketemu</Text>
                  <Text style={styles.emptySubtitle}>
                    Coba kata kunci lain, misal "Fatihah" atau "Yasin"
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={filteredSurahs}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderSurahResult}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                />
              )}
            </>
          )}

        </View>
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
    marginBottom: 14,
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
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#FFF' },
  headerSubtitle: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },

  // ============ SEARCH ============
  searchWrapper: { paddingHorizontal: 16, marginBottom: 10 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#0A1628', padding: 0 },

  // ============ MODE TABS ============
  modeWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  modeTabActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  modeText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  modeTextActive: { color: '#FFF' },

  // ============ CONTENT ============
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 90,
  },

  // ============ EMPTY STATE ============
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
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
    fontSize: 17, fontWeight: '800',
    color: '#0A1628', marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 12, color: '#64748B',
    textAlign: 'center', lineHeight: 18,
    paddingHorizontal: 10,
  },

  // ============ SUGGESTION ============
  suggestionWrapper: {
    marginTop: 24,
    width: '100%',
    alignItems: 'center',
  },
  suggestionLabel: {
    fontSize: 10, fontWeight: '700',
    color: '#94A3B8', letterSpacing: 1,
    marginBottom: 10,
  },
  suggestionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  suggestionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
  },
  suggestionText: {
    fontSize: 11, fontWeight: '700',
    color: '#059669',
  },

  // ============ RESULT ============
  resultInfoRow: { marginBottom: 8 },
  resultInfoText: {
    fontSize: 11, fontWeight: '600',
    color: '#64748B', letterSpacing: 0.3,
  },

  listContent: { paddingBottom: 20 },

  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    gap: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  cardCorner: {
    position: 'absolute',
    top: 6, left: 6,
    width: 12, height: 12,
    borderTopWidth: 2, borderLeftWidth: 2,
    borderColor: '#D4AF37',
    borderTopLeftRadius: 5,
    opacity: 0.4,
  },
  numberBox: {
    width: 38, height: 38, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  numberText: { fontSize: 13, fontWeight: '800', color: '#FFF' },
  resultInfo: { flex: 1 },
  resultName: {
    fontSize: 14, fontWeight: '800',
    color: '#0A1628', marginBottom: 2,
  },
  resultMeta: { fontSize: 10, color: '#64748B' },
  resultArabic: {
    fontSize: 20,
    color: '#059669',
    fontFamily: 'Scheherazade-Bold',
    marginRight: 4,
    maxWidth: 90,
  },
});