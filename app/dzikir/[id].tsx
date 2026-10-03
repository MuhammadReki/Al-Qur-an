import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { getDzikirKategori } from '../../data/dzikir';

export default function DzikirCounterScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const kategori = getDzikirKategori(id as string);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [count, setCount] = useState(0);

  if (!kategori) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Kategori gak ditemukan</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const current = kategori.items[currentIndex];
  const progress = (count / current.target) * 100;
  const isDone = count >= current.target;

  const handleTap = () => {
    if (isDone) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCount(count + 1);
    if (count + 1 === current.target) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleNext = () => {
    if (currentIndex < kategori.items.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCount(0);
    } else {
      router.back();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCount(0);
    }
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCount(0);
  };

  return (
    <ImageBackground
      source={require('../../assets/images/BackgroundBeranda1.png')}
      style={styles.bgImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
              <Ionicons name="arrow-back" size={20} color="#0A1628" />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>{kategori.nama}</Text>
              <Text style={styles.headerSubtitle}>
                {currentIndex + 1} / {kategori.items.length}
              </Text>
            </View>
          </View>

          <View style={styles.progressWrapper}>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {count} / {current.target}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.dzikirNama}>{current.nama}</Text>

            <Text style={styles.dzikirArab}>{current.arab}</Text>
            <Text style={styles.dzikirLatin}>{current.latin}</Text>

            <View style={styles.divider} />

            <Text style={styles.dzikirArti}>{current.arti}</Text>

            {current.keutamaan && (
              <View style={styles.keutamaanBox}>
                <Ionicons name="information-circle" size={14} color="#D4AF37" />
                <Text style={styles.keutamaanText}>{current.keutamaan}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.tapButton, isDone && styles.tapButtonDone]}
            onPress={handleTap}
            activeOpacity={0.8}
            disabled={isDone}
          >
            <LinearGradient
              colors={isDone ? ['#059669', '#047857'] : ['#10B981', '#059669']}
              style={styles.tapGradient}
            >
              {isDone ? (
                <>
                  <Ionicons name="checkmark-circle" size={32} color="#FFF" />
                  <Text style={styles.tapDoneText}>Selesai!</Text>
                </>
              ) : (
                <>
                  <Text style={styles.tapNumber}>{count}</Text>
                  <Text style={styles.tapText}>Tap untuk berdzikir</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, currentIndex === 0 && styles.actionBtnDisabled]}
              onPress={handlePrev}
              disabled={currentIndex === 0}
            >
              <Ionicons name="chevron-back" size={18} color={currentIndex === 0 ? '#CBD5E1' : '#64748B'} />
              <Text style={[styles.actionText, currentIndex === 0 && { color: '#CBD5E1' }]}>
                Sebelumnya
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Ionicons name="refresh" size={18} color="#DC2626" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnPrimary]}
              onPress={handleNext}
            >
              <Text style={[styles.actionText, { color: '#FFF' }]}>
                {currentIndex < kategori.items.length - 1 ? 'Selanjutnya' : 'Selesai'}
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#DC2626', fontSize: 15, marginBottom: 16 },
  backBtn: {
    backgroundColor: '#059669', paddingHorizontal: 24,
    paddingVertical: 12, borderRadius: 10,
  },
  backBtnText: { color: '#FFF', fontWeight: '600' },

  header: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, marginBottom: 16,
  },
  backIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#0A1628' },
  headerSubtitle: { fontSize: 11, color: '#64748B', marginTop: 2 },

  progressWrapper: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, marginBottom: 16,
  },
  progressBg: {
    flex: 1, height: 8,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 4, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', backgroundColor: '#059669', borderRadius: 4,
  },
  progressText: { fontSize: 12, fontWeight: '700', color: '#0A1628' },

  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 18, padding: 18,
    borderWidth: 1.5, borderColor: 'rgba(212, 175, 55, 0.25)',
    marginBottom: 16,
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  dzikirNama: {
    fontSize: 12, fontWeight: '800', color: '#059669',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12,
  },
  // 👇 FONT BARU: Scheherazade SemiBold
  dzikirArab: {
    fontSize: 26,
    color: '#0A1628',
    textAlign: 'right',
    lineHeight: 48,
    marginBottom: 10,
    fontFamily: 'Scheherazade-SemiBold',
  },
  dzikirLatin: {
    fontSize: 13, color: '#059669', fontStyle: 'italic',
    marginBottom: 12, lineHeight: 20,
  },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  dzikirArti: { fontSize: 13, color: '#475569', lineHeight: 21 },

  keutamaanBox: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    backgroundColor: '#FFFBEB', borderRadius: 10,
    padding: 10, marginTop: 12,
    borderWidth: 1, borderColor: '#FDE68A',
  },
  keutamaanText: { flex: 1, fontSize: 11, color: '#92400E', lineHeight: 16 },

  tapButton: {
    borderRadius: 18, overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  tapButtonDone: { shadowColor: '#047857' },
  tapGradient: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: 24, gap: 4,
  },
  tapNumber: { fontSize: 42, fontWeight: '800', color: '#FFF' },
  tapText: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.9)' },
  tapDoneText: { fontSize: 18, fontWeight: '800', color: '#FFF', marginTop: 4 },

  actionRow: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 12, paddingVertical: 12,
    borderWidth: 1, borderColor: '#F1F5F9',
  },
  actionBtnDisabled: { opacity: 0.5 },
  actionBtnPrimary: {
    backgroundColor: '#059669', borderColor: '#059669',
  },
  actionText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  resetBtn: {
    width: 46, height: 46, borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#FECACA',
  },
});