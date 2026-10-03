import { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getAllSurah } from '../../services/quranLocal';

export default function QuranScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const surahs = getAllSurah();

  const filteredSurahs = search.trim() === ''
    ? surahs
    : surahs.filter(
        (s) =>
          s.transliteration.toLowerCase().includes(search.toLowerCase()) ||
          s.arabic.includes(search) ||
          s.id.toString().includes(search)
      );

  const renderSurah = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.surahCard}
      onPress={() => router.push(`/surah/${item.id}`)}
      activeOpacity={0.75}
    >
      <View style={styles.cardCornerTL} />

      {/* Nomor */}
      <LinearGradient
        colors={['#10B981', '#059669']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.numberBox}
      >
        <Text style={styles.numberText}>{item.id}</Text>
      </LinearGradient>

      {/* Info surah — dibagi 2 baris */}
      <View style={styles.surahInfo}>
        <Text style={styles.surahName} numberOfLines={1}>
          {item.transliteration}
        </Text>
        <Text style={styles.surahMeta} numberOfLines={1}>
          {item.translation} · {item.num_ayah} ayat
        </Text>
      </View>

      {/* Arab + chevron — dikasih lebar tetap */}
      <View style={styles.arabicWrapper}>
        <Text
          style={styles.arabicName}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.arabic}
        </Text>
        <Ionicons name="chevron-forward" size={14} color="#CBD5E1" />
      </View>
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

            <View style={styles.headerTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.headerLabel}>AL-QURAN</Text>
                <Text style={styles.headerTitle}>114 Surah</Text>
                <Text style={styles.headerSubtitle}>Sumber: Kemenag RI</Text>
              </View>

              <LinearGradient
                colors={['#D4AF37', '#B8941F']}
                style={styles.headerBadge}
              >
                <Ionicons name="book" size={22} color="#FFF" />
              </LinearGradient>
            </View>
          </LinearGradient>
        </View>

        {/* SEARCH */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color="#059669" />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari surah, arti, atau nomor..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* RESULT */}
        <View style={styles.resultRow}>
          <Text style={styles.resultText}>
            {filteredSurahs.length} surah {search ? 'ditemukan' : 'tersedia'}
          </Text>
        </View>

        {/* LIST */}
        <FlatList
          data={filteredSurahs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSurah}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="book-outline" size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>Surah tidak ditemukan</Text>
              <Text style={styles.emptySubtext}>Coba kata kunci lain</Text>
            </View>
          }
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1 },

  // HEADER
  headerWrapper: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  headerGradient: { padding: 18, overflow: 'hidden' },
  ornament1: {
    position: 'absolute',
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    top: -50, right: -40,
  },
  ornament2: {
    position: 'absolute',
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    bottom: -30, left: -30,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerLabel: {
    fontSize: 10,
    color: 'rgba(212, 175, 55, 0.95)',
    letterSpacing: 1.5,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  headerBadge: {
    width: 52, height: 52, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8,
    elevation: 4,
  },

  // SEARCH
  searchWrapper: { paddingHorizontal: 16, marginBottom: 10 },
  searchContainer: {
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

  // RESULT
  resultRow: { paddingHorizontal: 20, marginBottom: 8 },
  resultText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // LIST
  listContent: { paddingHorizontal: 16, paddingBottom: 120 },

  // SURAH CARD
  surahCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardCornerTL: {
    position: 'absolute',
    top: 8, left: 8,
    width: 14, height: 14,
    borderTopWidth: 2, borderLeftWidth: 2,
    borderColor: '#D4AF37',
    borderTopLeftRadius: 6,
    opacity: 0.4,
  },

  // NOMOR
  numberBox: {
    width: 42, height: 42, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  numberText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },

  // INFO — flex: 1 biar ngisi sisa ruang
  surahInfo: {
    flex: 1,
    marginRight: 8,
  },
  surahName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0A1628',
    marginBottom: 3,
  },
  surahMeta: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },

  // ARAB — lebar tetap biar gak nabrak
  arabicWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 90,
    maxWidth: 110,
    justifyContent: 'flex-end',
  },
  arabicName: {
    fontSize: 20,
    color: '#059669',
    fontFamily: 'Scheherazade-Bold',
    textAlign: 'right',
  },

  // EMPTY
  emptyContainer: { alignItems: 'center', paddingVertical: 60 },
  emptyText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 15,
    fontWeight: '700',
  },
  emptySubtext: {
    marginTop: 4,
    color: '#94A3B8',
    fontSize: 12,
  },
});