import { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput,
  ImageBackground, KeyboardAvoidingView, Platform, Alert, Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { surahMetaList, SurahMeta } from '../../data/surahMeta';
import { saveHafalan, getHafalanBySurah } from '../../services/hafalanService';

type Filter = 'semua' | 'juz30' | 'juz29' | 'pendek' | 'panjang';

export default function TambahHafalanScreen() {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('semua');
  const [selectedSurah, setSelectedSurah] = useState<SurahMeta | null>(null);
  const [ayatHafal, setAyatHafal] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const filteredSurah = useMemo(() => {
    let list = surahMetaList;

    if (filter === 'juz30') list = list.filter((s) => s.id >= 78 && s.id <= 114);
    else if (filter === 'juz29') list = list.filter((s) => s.id >= 67 && s.id <= 77);
    else if (filter === 'pendek') list = list.filter((s) => s.totalAyat <= 30);
    else if (filter === 'panjang') list = list.filter((s) => s.totalAyat > 100);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.arti.toLowerCase().includes(q) ||
          s.id.toString() === q
      );
    }

    return list;
  }, [search, filter]);

  const handleSelectSurah = async (surah: SurahMeta) => {
    const existing = await getHafalanBySurah(surah.id);
    setSelectedSurah(surah);
    setAyatHafal(existing ? existing.ayatHafal.toString() : '0');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!selectedSurah) return;

    const jumlah = parseInt(ayatHafal, 10);
    if (isNaN(jumlah) || jumlah < 0) {
      Alert.alert('Error', 'Jumlah ayat harus angka positif');
      return;
    }
    if (jumlah > selectedSurah.totalAyat) {
      Alert.alert('Error', `Maksimal ${selectedSurah.totalAyat} ayat untuk ${selectedSurah.name}`);
      return;
    }

    const result = await saveHafalan(selectedSurah.id, jumlah);
    if (result) {
      setModalVisible(false);
      setSelectedSurah(null);
      setAyatHafal('');
      Alert.alert('✅ Berhasil', `Hafalan ${selectedSurah.name} disimpan (${jumlah} ayat)`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('❌ Gagal', 'Coba lagi');
    }
  };

  const renderSurah = ({ item }: { item: SurahMeta }) => (
    <TouchableOpacity
      style={styles.surahCard}
      onPress={() => handleSelectSurah(item)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={['#10B981', '#059669']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.numberBadge}
      >
        <Text style={styles.numberText}>{item.id}</Text>
      </LinearGradient>

      <View style={styles.surahInfo}>
        <Text style={styles.surahName}>{item.name}</Text>
        <Text style={styles.surahMeta}>
          {item.arti} · {item.totalAyat} ayat
        </Text>
      </View>

      <View style={styles.arabicBox}>
        <Text style={styles.surahArabic}>{item.nameArabic}</Text>
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

        {/* ============ HEADER GRADIENT ============ */}
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
              <Text style={styles.headerTitle}>Tambah Hafalan</Text>
              <Text style={styles.headerSubtitle}>
                Pilih surah untuk mulai menghafal
              </Text>
            </View>

            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeNum}>{surahMetaList.length}</Text>
              <Text style={styles.headerBadgeLabel}>Surah</Text>
            </View>
          </LinearGradient>
        </View>

        {/* ============ SEARCH BAR ============ */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchBox}>
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

        {/* ============ FILTER CHIPS (FIXED) ============ */}
        <View style={styles.filterWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {[
              { key: 'semua', label: '📖 Semua' },
              { key: 'juz30', label: '🌟 Juz 30' },
              { key: 'juz29', label: '⭐ Juz 29' },
              { key: 'pendek', label: '📗 Pendek' },
              { key: 'panjang', label: '📘 Panjang' },
            ].map((f) => (
              <TouchableOpacity
                key={f.key}
                style={[
                  styles.filterChip,
                  filter === f.key && styles.filterChipActive,
                ]}
                onPress={() => setFilter(f.key as Filter)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === f.key && styles.filterTextActive,
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ============ RESULT COUNT ============ */}
        <View style={styles.resultRow}>
          <Text style={styles.resultText}>
            {filteredSurah.length} surah ditemukan
          </Text>
        </View>

        {/* ============ LIST SURAH ============ */}
        {filteredSurah.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="search-outline" size={50} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>Surah gak ketemu</Text>
            <Text style={styles.emptySubtitle}>Coba kata kunci lain</Text>
          </View>
        ) : (
          <FlatList
            data={filteredSurah}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderSurah}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        )}
      </SafeAreaView>

      {/* ============ MODAL INPUT ============ */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalSubtitle}>INPUT HAFALAN</Text>
                  <Text style={styles.modalTitle}>{selectedSurah?.name}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.modalCloseBtn}
                >
                  <Ionicons name="close" size={20} color="#0A1628" />
                </TouchableOpacity>
              </View>

              {selectedSurah && (
                <>
                  <LinearGradient
                    colors={['#0A1628', '#134E4A']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.previewCard}
                  >
                    <View style={styles.previewOrnament} />
                    <Text style={styles.previewArabic}>
                      {selectedSurah.nameArabic}
                    </Text>
                    <Text style={styles.previewName}>
                      {selectedSurah.name}
                    </Text>
                    <View style={styles.previewDivider} />
                    <Text style={styles.previewMeta}>
                      {selectedSurah.arti} · {selectedSurah.totalAyat} ayat
                    </Text>
                  </LinearGradient>

                  <Text style={styles.label}>Berapa ayat yang udah dihafal?</Text>

                  <View style={styles.inputWrapper}>
                    <TouchableOpacity
                      style={styles.counterBtn}
                      onPress={() => {
                        const n = Math.max(0, parseInt(ayatHafal || '0') - 1);
                        setAyatHafal(n.toString());
                      }}
                    >
                      <Ionicons name="remove" size={22} color="#059669" />
                    </TouchableOpacity>

                    <TextInput
                      style={styles.input}
                      keyboardType="number-pad"
                      value={ayatHafal}
                      onChangeText={setAyatHafal}
                      textAlign="center"
                    />

                    <TouchableOpacity
                      style={styles.counterBtn}
                      onPress={() => {
                        const n = Math.min(
                          selectedSurah.totalAyat,
                          parseInt(ayatHafal || '0') + 1
                        );
                        setAyatHafal(n.toString());
                      }}
                    >
                      <Ionicons name="add" size={22} color="#059669" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.maxLabel}>
                    Maksimal: {selectedSurah.totalAyat} ayat
                  </Text>

                  <View style={styles.quickRow}>
                    <TouchableOpacity
                      style={styles.quickBtn}
                      onPress={() => setAyatHafal('0')}
                    >
                      <Text style={styles.quickText}>0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.quickBtn}
                      onPress={() =>
                        setAyatHafal(Math.floor(selectedSurah.totalAyat / 2).toString())
                      }
                    >
                      <Text style={styles.quickText}>½</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.quickBtn}
                      onPress={() => setAyatHafal(selectedSurah.totalAyat.toString())}
                    >
                      <Text style={styles.quickText}>Semua</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={handleSave}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#10B981', '#059669']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.saveGradient}
                    >
                      <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                      <Text style={styles.saveText}>Simpan Hafalan</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1 },

  // ==================== HEADER ====================
  headerWrapper: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  headerGradient: {
    padding: 18,
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
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  headerSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  headerBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  headerBadgeNum: { fontSize: 16, fontWeight: '800', color: '#D4AF37' },
  headerBadgeLabel: { fontSize: 9, color: 'rgba(255, 255, 255, 0.8)' },

  // ==================== SEARCH ====================
  searchWrapper: { paddingHorizontal: 20, marginBottom: 12 },
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

  // ==================== FILTER (FIXED) ====================
  filterWrapper: {
    height: 52,
    marginBottom: 4,
  },
  filterRow: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    gap: 8,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    flexShrink: 0,
  },
  filterChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  filterText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  filterTextActive: { color: '#FFF' },

  // ==================== RESULT ====================
  resultRow: { paddingHorizontal: 20, marginBottom: 8 },
  resultText: { fontSize: 11, color: '#64748B', fontWeight: '500' },

  // ==================== LIST ====================
  listContent: { paddingHorizontal: 20, paddingBottom: 120 },

  surahCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    gap: 12,
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  numberBadge: {
    width: 42, height: 42, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  numberText: { fontSize: 14, fontWeight: '800', color: '#FFF' },
  surahInfo: { flex: 1 },
  surahName: { fontSize: 15, fontWeight: '700', color: '#0A1628' },
  surahMeta: { fontSize: 11, color: '#64748B', marginTop: 2 },
  arabicBox: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  surahArabic: {
    fontSize: 22, color: '#059669',
    fontFamily: 'Amiri-Regular',
  },

  // ==================== EMPTY ====================
  emptyBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#64748B', marginTop: 16 },
  emptySubtitle: { fontSize: 13, color: '#94A3B8', marginTop: 4 },

  // ==================== MODAL ====================
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 22, 40, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
    maxHeight: '90%',
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  modalSubtitle: {
    fontSize: 10, fontWeight: '700',
    color: '#059669', letterSpacing: 1, marginBottom: 4,
  },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#0A1628' },
  modalCloseBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center', justifyContent: 'center',
  },

  previewCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  previewOrnament: {
    position: 'absolute',
    width: 150, height: 150, borderRadius: 75,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    top: -50, right: -40,
  },
  previewArabic: {
    fontSize: 32, color: '#D4AF37',
    fontFamily: 'Amiri-Regular',
    marginBottom: 6,
  },
  previewName: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  previewDivider: {
    width: 40, height: 2,
    backgroundColor: '#D4AF37',
    marginVertical: 10,
    borderRadius: 1,
  },
  previewMeta: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
  },

  label: {
    fontSize: 13, color: '#475569',
    marginBottom: 12, fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  counterBtn: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: '#ECFDF5',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 14,
    fontSize: 28, fontWeight: '800',
    color: '#059669',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  maxLabel: {
    fontSize: 11, color: '#94A3B8',
    textAlign: 'center', marginBottom: 20,
  },

  quickRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  quickBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickText: { fontSize: 13, fontWeight: '700', color: '#475569' },

  saveBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  saveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  saveText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
});