import { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ImageBackground, TouchableOpacity,
  TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
  Image, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { getProfile, updateProfile, UserProfile } from '../../services/profileService';

export default function EditProfilScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    try {
      const p = await getProfile();
      setName(p.name);
      setUsername(p.username);
      setBio(p.bio);
      setAvatar(p.avatar);
    } catch (e) {
      console.error('Gagal load profile:', e);
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin Dibutuhkan', 'HafizKu butuh izin akses galeri.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAvatar(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Error', 'Gagal buka galeri');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin Dibutuhkan', 'HafizKu butuh izin akses kamera.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAvatar(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Error', 'Gagal buka kamera');
    }
  };

  const handleChangePhoto = () => {
    Alert.alert(
      'Ganti Foto Profil',
      'Pilih sumber foto:',
      [
        { text: 'Batal', style: 'cancel' },
        { text: '📷 Kamera', onPress: handleTakePhoto },
        { text: '🖼️ Galeri', onPress: handlePickImage },
      ]
    );
  };

  const handleRemovePhoto = () => {
    Alert.alert(
      'Hapus Foto',
      'Yakin mau hapus foto profil?',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: () => setAvatar(null) },
      ]
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Nama gak boleh kosong');
      return;
    }
    if (!username.trim()) {
      Alert.alert('Error', 'Username gak boleh kosong');
      return;
    }
    if (name.trim().length < 2) {
      Alert.alert('Error', 'Nama minimal 2 karakter');
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        username: username.trim(),
        bio: bio.trim(),
        avatar,
      });

      Alert.alert('✅ Berhasil', 'Profil udah diupdate', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert('❌ Gagal', 'Coba lagi');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ImageBackground
        source={require('../../assets/images/BackgroundBeranda1.png')}
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
      source={require('../../assets/images/BackgroundBeranda1.png')}
      style={styles.bgImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >

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
                  <Ionicons name="arrow-back" size={18} color="#FFF" />
                </TouchableOpacity>

                <View style={styles.headerText}>
                  <Text style={styles.headerTitle}>Edit Profil</Text>
                  <Text style={styles.headerSubtitle}>
                    Update informasi profilmu
                  </Text>
                </View>
              </LinearGradient>
            </View>

            {/* AVATAR SECTION */}
            <View style={styles.avatarSection}>
              <TouchableOpacity onPress={handleChangePhoto} activeOpacity={0.8}>
                <View style={styles.avatarWrapper}>
                  {avatar ? (
                    <Image source={{ uri: avatar }} style={styles.avatarImage} />
                  ) : (
                    <LinearGradient
                      colors={['#10B981', '#059669', '#047857']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.avatarPlaceholder}
                    >
                      <Ionicons name="person" size={42} color="#FFF" />
                    </LinearGradient>
                  )}

                  <View style={styles.cameraBadge}>
                    <Ionicons name="camera" size={14} color="#FFF" />
                  </View>
                </View>
              </TouchableOpacity>

              <View style={styles.photoActions}>
                <TouchableOpacity
                  style={styles.photoBtn}
                  onPress={handleChangePhoto}
                  activeOpacity={0.7}
                >
                  <Ionicons name="camera-outline" size={12} color="#059669" />
                  <Text style={styles.photoBtnText}>Ganti Foto</Text>
                </TouchableOpacity>

                {avatar && (
                  <TouchableOpacity
                    style={[styles.photoBtn, styles.photoBtnDanger]}
                    onPress={handleRemovePhoto}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={12} color="#DC2626" />
                    <Text style={[styles.photoBtnText, { color: '#DC2626' }]}>
                      Hapus
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* FORM */}
            <View style={styles.formCard}>
              {/* Nama */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nama Lengkap</Text>
                <View style={styles.inputBox}>
                  <Ionicons name="person-outline" size={16} color="#94A3B8" />
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Masukkan nama"
                    placeholderTextColor="#94A3B8"
                    maxLength={50}
                  />
                </View>
                <Text style={styles.charCount}>{name.length}/50</Text>
              </View>

              {/* Username */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Username</Text>
                <View style={styles.inputBox}>
                  <Ionicons name="at" size={16} color="#94A3B8" />
                  <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Username"
                    placeholderTextColor="#94A3B8"
                    maxLength={30}
                  />
                </View>
                <Text style={styles.charCount}>{username.length}/30</Text>
              </View>

              {/* Bio */}
              <View style={[styles.inputGroup, { marginBottom: 0 }]}>
                <Text style={styles.label}>Bio</Text>
                <View style={[styles.inputBox, styles.textAreaBox]}>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={bio}
                    onChangeText={setBio}
                    placeholder="Ceritakan tentang dirimu..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    numberOfLines={2}
                    maxLength={120}
                  />
                </View>
                <Text style={styles.charCount}>{bio.length}/120</Text>
              </View>
            </View>

            {/* SAVE BUTTON */}
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveGradient}
              >
                {saving ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={18} color="#FFF" />
                    <Text style={styles.saveText}>Simpan Perubahan</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={{ height: 100 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1 },
  scrollContent: {
    paddingTop: 6,
    paddingBottom: 20,
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#059669', fontSize: 14 },

  // HEADER
  headerWrapper: {
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  headerGradient: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    overflow: 'hidden',
  },
  ornament1: {
    position: 'absolute',
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    top: -35, right: -25,
  },
  ornament2: {
    position: 'absolute',
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    bottom: -25, left: -15,
  },
  backBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  headerSubtitle: {
    fontSize: 9, color: 'rgba(255, 255, 255, 0.75)', marginTop: 1,
  },

  // AVATAR
  avatarSection: {
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarWrapper: {
    position: 'relative',
    width: 90, height: 90,
  },
  avatarImage: {
    width: 90, height: 90, borderRadius: 45,
    borderWidth: 3, borderColor: '#D4AF37',
  },
  avatarPlaceholder: {
    width: 90, height: 90, borderRadius: 45,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 10, elevation: 5,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#059669',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#FFF',
  },
  photoActions: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  photoBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    borderWidth: 1, borderColor: '#A7F3D0',
  },
  photoBtnDanger: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
  photoBtnText: { fontSize: 10, fontWeight: '700', color: '#059669' },

  // FORM
  formCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  inputGroup: { marginBottom: 10 },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  textAreaBox: {
    alignItems: 'flex-start',
    paddingVertical: 9,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: '#0A1628',
    padding: 0,
  },
  textArea: {
    minHeight: 44,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 9,
    color: '#94A3B8',
    textAlign: 'right',
    marginTop: 2,
  },

  // SAVE
  saveBtn: {
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  saveText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
});