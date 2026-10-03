import { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ImageBackground,
  Image, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { getProfile, UserProfile } from '../../services/profileService';

export default function ProfileScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    setLoading(true);
    const p = await getProfile();
    setProfile(p);
    setLoading(false);
  };

  const menuItems = [
    {
      icon: 'person-outline',
      label: 'Edit Profil',
      color: '#2563EB',
      onPress: () => router.push('/profile/edit'),
    },
    {
      icon: 'settings-outline',
      label: 'Pengaturan',
      color: '#059669',
      onPress: () => router.push('/pengaturan'),
    },
    {
      icon: 'notifications-outline',
      label: 'Notifikasi',
      color: '#D97706',
      onPress: () => router.push('/profile/notifikasi'),
    },
    {
      icon: 'information-circle-outline',
      label: 'Tentang Aplikasi',
      color: '#7C3AED',
      onPress: () => router.push('/pengaturan/tentang'),
    },
  ];

  if (loading || !profile) {
    return (
      <ImageBackground
        source={require('../../assets/images/BackgroundBeranda.png')}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#059669" />
            <Text style={styles.loadingText}>Memuat profil...</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/images/BackgroundBeranda.png')}
      style={styles.bgImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        {/* 👇 GANTI ScrollView → View flex:1 */}
        <View style={styles.contentWrapper}>

          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>Profil</Text>
            <Text style={styles.subtitle}>Tentang kamu</Text>
          </View>

          {/* PROFILE CARD */}
          <View style={styles.profileCard}>
            {profile.avatar ? (
              <Image
                source={{ uri: profile.avatar }}
                style={styles.avatarImage}
              />
            ) : (
              <LinearGradient
                colors={['#10B981', '#059669', '#047857']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatar}
              >
                <Ionicons name="person" size={48} color="#FFFFFF" />
              </LinearGradient>
            )}

            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.role}>@{profile.username}</Text>

            {profile.bio ? (
              <Text style={styles.bio}>{profile.bio}</Text>
            ) : null}

            <View style={styles.levelBadge}>
              <Text style={styles.levelIcon}>🌱</Text>
              <Text style={styles.levelText}>Pejuang Hafalan</Text>
            </View>
          </View>

          {/* MENU */}
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[`${item.color}25`, `${item.color}10`]}
                  style={styles.menuIcon}
                >
                  <Ionicons name={item.icon as any} size={20} color={item.color} />
                </LinearGradient>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
              </TouchableOpacity>
            ))}
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>MyQuran v1.0.0</Text>
            <Text style={styles.footerText}>Teman setia hafalanmu 🤲</Text>
          </View>

        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#059669', fontSize: 14 },

  // 👇 WRAPPER BARU (gantiin ScrollView)
  contentWrapper: {
    flex: 1,
    paddingBottom: 100,       // ruang buat bottom tab
    justifyContent: 'space-between',
  },

  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', color: '#0A1628' },
  subtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },

  // PROFILE CARD
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  avatar: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarImage: {
    width: 100, height: 100, borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#D4AF37',
  },
  name: { fontSize: 20, fontWeight: '800', color: '#0A1628' },
  role: { fontSize: 13, color: '#64748B', marginTop: 4 },
  bio: {
    fontSize: 12, color: '#475569',
    textAlign: 'center', marginTop: 10,
    fontStyle: 'italic', lineHeight: 18,
    paddingHorizontal: 10,
  },

  levelBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 14,
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    borderWidth: 1, borderColor: '#A7F3D0',
  },
  levelIcon: { fontSize: 14 },
  levelText: { fontSize: 11, fontWeight: '800', color: '#059669', letterSpacing: 0.5 },

  // MENU
  menuContainer: { paddingHorizontal: 20 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 14, padding: 14, marginBottom: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.15)',
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  menuIcon: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 14,
  },
  menuLabel: { fontSize: 15, fontWeight: '700', color: '#0A1628', flex: 1 },

  // FOOTER
  footer: { alignItems: 'center', paddingVertical: 30 },
  footerText: { fontSize: 12, color: '#64748B', marginTop: 4, fontWeight: '500' },
});