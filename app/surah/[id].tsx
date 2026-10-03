import { useCallback, useMemo, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { getSurahDetail } from '../../services/quranLocal';
import { useBookmarkStore } from '../../store/bookmarkStore';
import { useTilawahStore } from '../../store/tilawahStore';

const AyahCard = ({ ayah, surahNumber, surahName }: { ayah: any; surahNumber: number; surahName: string }) => {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkStore();
  const bookmarked = isBookmarked(surahNumber, ayah.ayah);

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (bookmarked) {
      const existing = useBookmarkStore
        .getState()
        .bookmarks.find((b) => b.surah === surahNumber && b.ayah === ayah.ayah);
      if (existing) removeBookmark(existing.id);
    } else {
      addBookmark({
        surah: surahNumber,
        ayah: ayah.ayah,
        surahName,
        color: 'hijau',
      });
    }
  };

  return (
    <Pressable onLongPress={handleLongPress} delayLongPress={400}>
      <View style={styles.ayahCard}>
        <View style={styles.cardCornerTL} />
        <View style={styles.cardCornerTR} />
        <View style={styles.cardCornerBL} />
        <View style={styles.cardCornerBR} />
        <View style={styles.cardSideOrnament} />

        {bookmarked && (
          <View style={styles.bookmarkBadge}>
            <Ionicons name="bookmark" size={14} color="#EAB308" />
          </View>
        )}

        <View style={styles.ayahHeader}>
          <View style={styles.ayahNumberWrapper}>
            <View style={styles.ayahNumberGlow} />
            <View style={styles.ayahNumberOuter}>
              <LinearGradient
                colors={['#059669', '#047857']}
                style={styles.ayahNumberInner}
              >
                <Text style={styles.ayahNumberText}>{ayah.ayah}</Text>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.ayahOrnamentLine}>
            <View style={styles.ayahOrnamentDot} />
            <View style={styles.ayahOrnamentDash} />
            <View style={styles.ayahOrnamentDiamond} />
            <View style={styles.ayahOrnamentDash} />
            <View style={styles.ayahOrnamentDot} />
          </View>
        </View>

        <Text style={styles.arabicText}>{ayah.arabic}</Text>

        <View style={styles.dividerWrapper}>
          <View style={styles.dividerLine} />
          <View style={styles.dividerDiamond} />
          <View style={styles.dividerDiamondSmall} />
          <View style={styles.dividerDiamond} />
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.latinWrapper}>
          <View style={styles.latinIconWrapper}>
            <Ionicons name="text-outline" size={11} color="#059669" />
          </View>
          <Text style={styles.latinText}>{ayah.latin}</Text>
        </View>

        <View style={styles.translationWrapper}>
          <LinearGradient
            colors={['#059669', '#10B981', '#A7F3D0']}
            style={styles.translationBar}
          />
          <Text style={styles.translationText}>{ayah.translation}</Text>
        </View>

        {ayah.footnotes && (
          <LinearGradient
            colors={['rgba(248, 250, 252, 0.9)', 'rgba(241, 245, 249, 0.9)']}
            style={styles.footnoteBox}
          >
            <Ionicons name="information-circle" size={14} color="#D4AF37" style={{ marginTop: 2 }} />
            <Text style={styles.footnoteText}>{ayah.footnotes}</Text>
          </LinearGradient>
        )}
      </View>
    </Pressable>
  );
};

const BismillahHeader = () => (
  <View style={styles.bismillahWrapper}>
    <LinearGradient
      colors={['#FEF3C7', '#FDE68A', '#FCD34D']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.bismillahBorder}
    >
      <LinearGradient
        colors={['rgba(255, 251, 235, 1)', 'rgba(236, 253, 245, 1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bismillahContainer}
      >
        <View style={styles.bismillahOrnamentTL} />
        <View style={styles.bismillahOrnamentTR} />
        <View style={styles.bismillahOrnamentBL} />
        <View style={styles.bismillahOrnamentBR} />

        <View style={styles.starLeft}>
          <Ionicons name="sparkles" size={12} color="#D4AF37" />
        </View>
        <View style={styles.starRight}>
          <Ionicons name="sparkles" size={12} color="#D4AF37" />
        </View>

        <View style={styles.bismillahLabel}>
          <View style={styles.labelLine} />
          <Text style={styles.labelText}>BISMILLAH</Text>
          <View style={styles.labelLine} />
        </View>

        <Text style={styles.bismillahText}>
          بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
        </Text>

        <View style={styles.bismillahDivider}>
          <View style={styles.bismillahDot} />
          <View style={styles.bismillahLine} />
          <View style={styles.bismillahDiamond} />
          <View style={styles.bismillahLine} />
          <View style={styles.bismillahDot} />
        </View>
      </LinearGradient>
    </LinearGradient>
  </View>
);

const Footer = ({ total }: { total: number }) => (
  <LinearGradient
    colors={['rgba(236, 253, 245, 0.95)', 'rgba(220, 252, 231, 0.95)']}
    style={styles.footer}
  >
    <View style={styles.footerOrnament}>
      <View style={styles.footerLine} />
      <View style={styles.footerDiamond}>
        <Ionicons name="checkmark" size={14} color="#FFFFFF" />
      </View>
      <View style={styles.footerLine} />
    </View>
    <Text style={styles.footerText}>Alhamdulillah · {total} ayat selesai</Text>
    <Text style={styles.footerSub}>Sumber: Kemenag RI · Tilawah v1.0</Text>
  </LinearGradient>
);

export default function SurahDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const surahNumber = Number(id);
  const { setLastRead } = useBookmarkStore();
  const { logAyat } = useTilawahStore();

  // Set biar ayat gak dihitung 2x dalam 1 sesi
  const viewedAyahs = useRef<Set<number>>(new Set());

  const surah: any = useMemo(() => {
    try {
      return getSurahDetail(surahNumber);
    } catch (e) {
      console.error('Error loading surah:', e);
      return null;
    }
  }, [surahNumber]);

  // Reset tracking kalau pindah surah
  useEffect(() => {
    viewedAyahs.current = new Set();
  }, [surahNumber]);

  // Auto-save posisi baca
  useEffect(() => {
    if (surahNumber && surah?.surah?.transliteration) {
      setLastRead(surahNumber, 1, surah.surah.transliteration);
    }
  }, [surahNumber, surah]);

  // 🔥 Auto-log ayat yang keliatan di layar
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    viewableItems.forEach((v: any) => {
      const ayahNum = v.item?.ayah;
      if (ayahNum && !viewedAyahs.current.has(ayahNum)) {
        viewedAyahs.current.add(ayahNum);
        logAyat(1);
      }
    });
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderAyah = useCallback(
    ({ item }: { item: any }) => (
      <AyahCard
        ayah={item}
        surahNumber={surahNumber}
        surahName={surah?.surah?.transliteration || ''}
      />
    ),
    [surahNumber, surah]
  );

  const keyExtractor = useCallback(
    (item: any) => item.id.toString(),
    []
  );

  if (!surah) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Gagal memuat surah</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/images/BackgroundBeranda1.png')}
      style={styles.bgImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
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
            <Text style={styles.headerTitle}>{surah.surah.transliteration}</Text>
            <View style={styles.headerSubRow}>
              <View style={styles.headerDot} />
              <Text style={styles.headerSubtitle}>
                {surah.surah.location} · {surah.surah.num_ayah} ayat
              </Text>
            </View>
          </View>

          <View style={styles.headerArabicWrapper}>
            <Text style={styles.headerArabicText}>{surah.surah.arabic}</Text>
          </View>
        </LinearGradient>

        <FlatList
          data={surah.ayahs}
          renderItem={renderAyah}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          contentContainerStyle={styles.scrollContent}
          initialNumToRender={5}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews={true}
          updateCellsBatchingPeriod={50}
          ListHeaderComponent={
            surahNumber !== 1 && surahNumber !== 9 ? <BismillahHeader /> : null
          }
          ListFooterComponent={<Footer total={surah.surah.num_ayah} />}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  errorText: { color: '#DC2626', fontSize: 15, marginBottom: 16 },
  backBtn: { backgroundColor: '#059669', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  backBtnText: { color: '#FFF', fontWeight: '600' },

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
    letterSpacing: 0.3, marginBottom: 4,
  },
  headerSubRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#D4AF37' },
  headerSubtitle: { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  headerArabicWrapper: {
    paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.4)', zIndex: 1,
  },
  headerArabicText: {
    fontSize: 20, color: '#FDE68A',
    fontFamily: 'Scheherazade-Bold',
  },

  bismillahWrapper: {
    marginHorizontal: 16, marginTop: 14, borderRadius: 20,
    shadowColor: '#D4AF37', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25, shadowRadius: 14, elevation: 5,
  },
  bismillahBorder: { padding: 3, borderRadius: 20 },
  bismillahContainer: {
    alignItems: 'center',
    paddingVertical: 22, paddingHorizontal: 20,
    borderRadius: 18, position: 'relative', overflow: 'hidden',
  },
  bismillahOrnamentTL: {
    position: 'absolute', top: 8, left: 8, width: 20, height: 20,
    borderTopWidth: 2, borderLeftWidth: 2, borderColor: '#D4AF37',
    borderTopLeftRadius: 8,
  },
  bismillahOrnamentTR: {
    position: 'absolute', top: 8, right: 8, width: 20, height: 20,
    borderTopWidth: 2, borderRightWidth: 2, borderColor: '#D4AF37',
    borderTopRightRadius: 8,
  },
  bismillahOrnamentBL: {
    position: 'absolute', bottom: 8, left: 8, width: 20, height: 20,
    borderBottomWidth: 2, borderLeftWidth: 2, borderColor: '#D4AF37',
    borderBottomLeftRadius: 8,
  },
  bismillahOrnamentBR: {
    position: 'absolute', bottom: 8, right: 8, width: 20, height: 20,
    borderBottomWidth: 2, borderRightWidth: 2, borderColor: '#D4AF37',
    borderBottomRightRadius: 8,
  },
  starLeft: { position: 'absolute', left: 22, top: '50%', marginTop: -6 },
  starRight: { position: 'absolute', right: 22, top: '50%', marginTop: -6 },
  bismillahLabel: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  labelLine: { width: 24, height: 1, backgroundColor: '#D4AF37' },
  labelText: { fontSize: 9, color: '#D4AF37', fontWeight: '800', letterSpacing: 2 },
  bismillahText: {
    fontSize: 28, color: '#059669',
    textAlign: 'center',
    lineHeight: 52, marginBottom: 14,
    fontFamily: 'Scheherazade-Bold',
  },
  bismillahDivider: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bismillahDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#D4AF37' },
  bismillahDiamond: {
    width: 8, height: 8, backgroundColor: '#D4AF37',
    transform: [{ rotate: '45deg' }], borderRadius: 2,
  },
  bismillahLine: { width: 30, height: 1, backgroundColor: '#D4AF37' },

  scrollContent: { padding: 16, paddingBottom: 40 },

  ayahCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 18,
    paddingVertical: 20, paddingHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1.5, borderColor: 'rgba(212, 175, 55, 0.25)',
    shadowColor: '#059669', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1, shadowRadius: 14, elevation: 3,
    position: 'relative', overflow: 'hidden',
  },
  cardCornerTL: {
    position: 'absolute', top: 10, left: 10, width: 16, height: 16,
    borderTopWidth: 2, borderLeftWidth: 2, borderColor: '#D4AF37',
    borderTopLeftRadius: 6, opacity: 0.5,
  },
  cardCornerTR: {
    position: 'absolute', top: 10, right: 10, width: 16, height: 16,
    borderTopWidth: 2, borderRightWidth: 2, borderColor: '#D4AF37',
    borderTopRightRadius: 6, opacity: 0.5,
  },
  cardCornerBL: {
    position: 'absolute', bottom: 10, left: 10, width: 16, height: 16,
    borderBottomWidth: 2, borderLeftWidth: 2, borderColor: '#D4AF37',
    borderBottomLeftRadius: 6, opacity: 0.5,
  },
  cardCornerBR: {
    position: 'absolute', bottom: 10, right: 10, width: 16, height: 16,
    borderBottomWidth: 2, borderRightWidth: 2, borderColor: '#D4AF37',
    borderBottomRightRadius: 6, opacity: 0.5,
  },
  cardSideOrnament: {
    position: 'absolute', left: 0, top: '30%', bottom: '30%',
    width: 3, backgroundColor: '#059669',
    borderTopRightRadius: 3, borderBottomRightRadius: 3,
  },
  bookmarkBadge: {
    position: 'absolute', top: 12, right: 12,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    alignItems: 'center', justifyContent: 'center',
    zIndex: 10,
  },
  ayahHeader: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 16,
  },
  ayahNumberWrapper: { marginRight: 12, position: 'relative' },
  ayahNumberGlow: {
    position: 'absolute', top: -4, left: -4, right: -4, bottom: -4,
    borderRadius: 24, backgroundColor: 'rgba(212, 175, 55, 0.15)',
  },
  ayahNumberOuter: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#FEF3C7',
    borderWidth: 2, borderColor: '#D4AF37',
    alignItems: 'center', justifyContent: 'center', padding: 3,
  },
  ayahNumberInner: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
  },
  ayahNumberText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  ayahOrnamentLine: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  ayahOrnamentDot: {
    width: 4, height: 4, borderRadius: 2, backgroundColor: '#D4AF37',
  },
  ayahOrnamentDiamond: {
    width: 6, height: 6, backgroundColor: '#D4AF37',
    transform: [{ rotate: '45deg' }], borderRadius: 1,
  },
  ayahOrnamentDash: {
    flex: 1, height: 1, backgroundColor: '#D4AF37', opacity: 0.3,
  },
  arabicText: {
    fontSize: 28,
    color: '#0A1628',
    textAlign: 'right',
    lineHeight: 56,
    writingDirection: 'rtl',
    paddingVertical: 8,
    paddingHorizontal: 4,
    fontFamily: 'Scheherazade-SemiBold',
  },
  dividerWrapper: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginVertical: 16,
  },
  dividerLine: {
    flex: 1, height: 1, backgroundColor: '#D4AF37', opacity: 0.3,
  },
  dividerDiamond: {
    width: 8, height: 8, backgroundColor: '#D4AF37',
    transform: [{ rotate: '45deg' }], borderRadius: 1,
  },
  dividerDiamondSmall: {
    width: 4, height: 4, backgroundColor: '#D4AF37',
    transform: [{ rotate: '45deg' }], borderRadius: 1,
  },
  latinWrapper: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    marginBottom: 12, paddingHorizontal: 4,
  },
  latinIconWrapper: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#ECFDF5',
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  latinText: {
    flex: 1, fontSize: 13, color: '#059669',
    fontStyle: 'italic', fontWeight: '600', lineHeight: 22,
  },
  translationWrapper: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingLeft: 4,
  },
  translationBar: {
    width: 3, borderRadius: 2, marginTop: 2, minHeight: 20,
  },
  translationText: {
    flex: 1, fontSize: 14, color: '#334155',
    lineHeight: 24, textAlign: 'justify',
  },
  footnoteBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    borderRadius: 12, padding: 12, marginTop: 14,
    borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.2)',
    borderLeftWidth: 3, borderLeftColor: '#D4AF37',
  },
  footnoteText: {
    flex: 1, fontSize: 11, color: '#64748B',
    fontStyle: 'italic', lineHeight: 17, textAlign: 'justify',
  },

  footer: {
    alignItems: 'center',
    paddingVertical: 24, paddingHorizontal: 20,
    borderRadius: 18,
    borderWidth: 1.5, borderColor: 'rgba(212, 175, 55, 0.3)',
    marginTop: 10,
  },
  footerOrnament: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12,
  },
  footerLine: { width: 50, height: 1, backgroundColor: '#D4AF37', opacity: 0.4 },
  footerDiamond: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#059669',
    borderWidth: 2, borderColor: '#D4AF37',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#059669', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  footerText: {
    fontSize: 13, color: '#059669',
    fontWeight: '800', letterSpacing: 0.3, marginBottom: 4,
  },
  footerSub: {
    fontSize: 10, color: '#94A3B8',
    fontWeight: '500', letterSpacing: 0.2,
  },
});