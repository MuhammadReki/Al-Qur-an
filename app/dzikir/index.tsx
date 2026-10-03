import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { dzikirKategori } from '../../data/dzikir';

export default function DzikirListScreen() {
  const router = useRouter();

  const renderKategori = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.kategoriCard}
      onPress={() => router.push(`/dzikir/${item.id}`)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={[`${item.warna}25`, `${item.warna}10`]}
        style={styles.iconWrapper}
      >
        <Ionicons name={item.icon} size={24} color={item.warna} />
      </LinearGradient>

      <View style={styles.kategoriInfo}>
        <Text style={styles.kategoriName}>{item.nama}</Text>
        <Text style={styles.kategoriDesc}>{item.deskripsi}</Text>
        <Text style={[styles.kategoriCount, { color: item.warna }]}>
          {item.items.length} dzikir
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
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
          <Text style={styles.title}>Dzikir</Text>
          <Text style={styles.subtitle}>Kumpulan dzikir & wirid</Text>
        </View>

        <FlatList
          data={dzikirKategori}
          keyExtractor={(item) => item.id}
          renderItem={renderKategori}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', color: '#0A1628' },
  subtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },
  listContent: { paddingHorizontal: 20, paddingBottom: 120 },

  kategoriCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.15)',
    gap: 12,
  },
  iconWrapper: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  kategoriInfo: { flex: 1 },
  kategoriName: { fontSize: 15, fontWeight: '800', color: '#0A1628' },
  kategoriDesc: { fontSize: 11, color: '#64748B', marginTop: 2 },
  kategoriCount: { fontSize: 10, fontWeight: '700', marginTop: 4 },
});