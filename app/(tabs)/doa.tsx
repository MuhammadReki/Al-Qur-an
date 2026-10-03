import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Modal,
  ImageBackground, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getAllDoa, DoaApiResponse } from '../../services/doaApi';
import { doaList } from '../../data/doa';

export default function DoaScreen() {
  const [doaData, setDoaData] = useState<DoaApiResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<DoaApiResponse | null>(null);

  useEffect(() => {
    loadDoa();
  }, []);

  const loadDoa = async () => {
    setLoading(true);
    const data = await getAllDoa();

    if (data.length === 0) {
      console.log('API gagal, pakai data lokal');
      const fallbackData: DoaApiResponse[] = doaList.map((item) => ({
        id: item.id,
        grup: item.kategori,
        nama: item.judul,
        ar: item.arab,
        tr: item.latin,
        idn: item.arti,
      }));
      setDoaData(fallbackData);
    } else {
      setDoaData(data);
    }

    setLoading(false);
  };

  // 👇 Card versi compact
  const renderDoa = ({ item }: { item: DoaApiResponse }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setSelected(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.kategori} numberOfLines={1}>{item.grup}</Text>
        <Ionicons name="chevron-forward" size={14} color="#CBD5E1" />
      </View>
      <Text style={styles.judul} numberOfLines={2}>{item.nama}</Text>
      <Text style={styles.preview} numberOfLines={1}>{item.tr}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/images/BackgroundBeranda1.png')}
      style={styles.bgImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Doa Harian</Text>
          <Text style={styles.subtitle}>
            {loading ? 'Memuat...' : `${doaData.length} doa pilihan`}
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#059669" />
            <Text style={styles.loadingText}>Memuat doa...</Text>
          </View>
        ) : (
          <FlatList
            data={doaData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderDoa}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Modal Detail Doa */}
        <Modal
          visible={!!selected}
          animationType="slide"
          transparent
          onRequestClose={() => setSelected(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />

              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalKategori}>{selected?.grup}</Text>
                  <Text style={styles.modalTitle}>{selected?.nama}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelected(null)}
                  style={styles.modalCloseBtn}
                >
                  <Ionicons name="close" size={20} color="#0A1628" />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalScroll}
              >
                <Text style={styles.modalArab}>{selected?.ar}</Text>
                <Text style={styles.modalLatin}>{selected?.tr}</Text>
                <View style={styles.divider} />
                <Text style={styles.modalArti}>{selected?.idn}</Text>

                {selected?.tentang && (
                  <>
                    <View style={styles.divider} />
                    <Text style={styles.modalSumber}>{selected.tentang}</Text>
                  </>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0A1628' },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: 2 },
  listContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 120 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#059669', fontSize: 14 },

  // 👇 CARD COMPACT
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  kategori: {
    fontSize: 9,
    color: '#059669',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    flex: 1,
  },
  judul: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A1628',
    marginBottom: 3,
    lineHeight: 17,
  },
  preview: {
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
    lineHeight: 15,
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    maxHeight: '85%',
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalKategori: {
    fontSize: 9,
    fontWeight: '700',
    color: '#059669',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0A1628',
    lineHeight: 22,
  },
  modalCloseBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center', justifyContent: 'center',
    marginLeft: 10,
  },
  modalScroll: {
    paddingBottom: 10,
  },
  modalArab: {
  fontSize: 22,
  color: '#0A1628',
  textAlign: 'right',
  lineHeight: 40,
  marginBottom: 12,
  fontFamily: 'Scheherazade-SemiBold',   // 👈 FONT BARU
},
  modalLatin: {
    fontSize: 13,
    color: '#059669',
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  modalArti: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 21,
  },
  modalSumber: {
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
    lineHeight: 17,
  },
});