import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useBookmarkStore } from '@/store/bookmarkStore';

const COLOR_MAP = {
  hijau: '#059669',
  kuning: '#eab308',
  biru: '#3b82f6',
};

export default function BookmarkScreen() {
  const { bookmarks, removeBookmark } = useBookmarkStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Bookmark Ayat</Text>
        <View style={{ width: 24 }} />
      </View>

      {bookmarks.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="bookmark-outline" size={64} color="#475569" />
          <Text style={styles.emptyText}>Belum ada bookmark</Text>
          <Text style={styles.emptyHint}>
            Tekan lama ayat di halaman baca untuk menandai
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/surah/${item.surah}?ayah=${item.ayah}`)}
            >
              <View style={[styles.colorBar, { backgroundColor: COLOR_MAP[item.color] }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.surahName}>
                  {item.surahName} : {item.ayah}
                </Text>
                {item.note ? <Text style={styles.note}>{item.note}</Text> : null}
              </View>
              <TouchableOpacity onPress={() => removeBookmark(item.id)}>
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1f1c' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  emptyText: { color: '#94a3b8', fontSize: 16, fontWeight: '600' },
  emptyHint: { color: '#475569', fontSize: 13, textAlign: 'center', paddingHorizontal: 32 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f2e29',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 12,
  },
  colorBar: { width: 4, height: 40, borderRadius: 2 },
  surahName: { color: '#fff', fontSize: 15, fontWeight: '600' },
  note: { color: '#94a3b8', fontSize: 13, marginTop: 4 },
});