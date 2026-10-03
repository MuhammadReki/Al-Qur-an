import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = async () => {
    Animated.sequence([
      Animated.timing(btnScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(btnScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    } catch (e) {
      console.log('Error saving onboarding flag:', e);
    }

    setTimeout(() => {
      router.replace('/(tabs)/home');
    }, 200);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ImageBackground
        source={require('../assets/images/BackGroundOnboardingAlquran.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.85)']}
          locations={[0, 0.4, 0.7, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        <SafeAreaView style={styles.safeArea}>
          <Animated.View style={[styles.topOrnament, { opacity: fadeAnim }]}>
            <LinearGradient
              colors={['transparent', '#D4AF37', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ornamentLine}
            />
            <View style={styles.ornamentDiamond} />
          </Animated.View>

          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.bismillahWrapper}>
              <Text style={styles.bismillah}>
                بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
              </Text>
              <View style={styles.bismillahUnderline} />
            </View>

            <View style={styles.appNameWrapper}>
              <View style={styles.sideOrnament}>
                <View style={styles.sideLine} />
                <View style={styles.sideDot} />
              </View>

              <Text style={styles.appName}>MyQur'an</Text>

              <View style={[styles.sideOrnament, { transform: [{ scaleX: -1 }] }]}>
                <View style={styles.sideLine} />
                <View style={styles.sideDot} />
              </View>
            </View>

            <Text style={styles.tagline}>Teman setia hafalanmu</Text>

            <View style={styles.dividerWrapper}>
              <View style={styles.dividerLine} />
              <View style={styles.dividerDiamond} />
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.featuresWrapper}>
              <View style={styles.featureItem}>
                <Ionicons name="book" size={14} color="#D4AF37" />
                <Text style={styles.featureText}>114 Surah</Text>
              </View>
              <View style={styles.featureDot} />
              <View style={styles.featureItem}>
                <Ionicons name="trophy" size={14} color="#D4AF37" />
                <Text style={styles.featureText}>Tracker Hafalan</Text>
              </View>
              <View style={styles.featureDot} />
              <View style={styles.featureItem}>
                <Ionicons name="time" size={14} color="#D4AF37" />
                <Text style={styles.featureText}>Jadwal Sholat</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View style={[styles.bottomContent, { opacity: fadeAnim }]}>
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <TouchableOpacity
                onPress={handleGetStarted}
                activeOpacity={1}
                style={styles.btnTouchable}
              >
                <LinearGradient
                  colors={['#F5DEB3', '#D4AF37', '#B8941F']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.btnGradient}
                >
                  <View style={styles.btnOrnamentLeft}>
                    <View style={styles.btnDot} />
                    <View style={styles.btnLine} />
                  </View>

                  <View style={styles.btnContent}>
                    <Text style={styles.btnText}>GET STARTED</Text>
                    <View style={styles.btnArrowCircle}>
                      <Ionicons name="arrow-forward" size={16} color="#0A1628" />
                    </View>
                  </View>

                  <View style={styles.btnOrnamentRight}>
                    <View style={styles.btnLine} />
                    <View style={styles.btnDot} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.btnGlow} />

            <View style={styles.footerWrapper}>
              <View style={styles.footerLine} />
              <Text style={styles.footer}>🤲 Sumber: Kemenag RI</Text>
              <View style={styles.footerLine} />
            </View>
          </Animated.View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  background: { flex: 1, width: '100%', height: '100%' },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  topOrnament: { alignItems: 'center', marginTop: 10 },
  ornamentLine: { width: 100, height: 2, borderRadius: 1 },
  ornamentDiamond: {
    width: 10, height: 10,
    backgroundColor: '#D4AF37',
    transform: [{ rotate: '45deg' }],
    marginTop: -6, borderRadius: 2,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8, shadowRadius: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  bismillahWrapper: { alignItems: 'center', marginBottom: 30 },
  bismillah: {
    fontSize: 28,
    color: '#D4AF37',
    fontFamily: 'Scheherazade-SemiBold',
    textAlign: 'center',
    lineHeight: 52,
    textShadowColor: 'rgba(212, 175, 55, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  bismillahUnderline: {
    width: 60, height: 2,
    backgroundColor: '#D4AF37',
    marginTop: 8, borderRadius: 1,
    opacity: 0.6,
  },
  appNameWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sideOrnament: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sideLine: {
    width: 24, height: 1,
    backgroundColor: '#D4AF37',
    opacity: 0.6,
  },
  sideDot: {
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: '#D4AF37',
  },
  appName: {
    fontSize: 44,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginHorizontal: 12,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontStyle: 'italic',
    letterSpacing: 1,
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  dividerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  dividerLine: {
    width: 40, height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.4)',
  },
  dividerDiamond: {
    width: 6, height: 6,
    backgroundColor: '#D4AF37',
    transform: [{ rotate: '45deg' }],
    borderRadius: 1,
  },
  featuresWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  featureDot: {
    width: 3, height: 3, borderRadius: 2,
    backgroundColor: 'rgba(212, 175, 55, 0.5)',
  },
  bottomContent: { alignItems: 'center' },
  btnTouchable: {
    borderRadius: 50,
    overflow: 'hidden',
    width: width - 60,
    maxWidth: 340,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  btnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  btnOrnamentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  btnDot: {
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: '#0A1628',
    opacity: 0.6,
  },
  btnLine: {
    width: 14, height: 1,
    backgroundColor: '#0A1628',
    opacity: 0.4,
  },
  btnOrnamentRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0A1628',
    letterSpacing: 2.5,
  },
  btnArrowCircle: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(10, 22, 40, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(10, 22, 40, 0.2)',
  },
  btnGlow: {
    position: 'absolute',
    top: 20,
    width: 200, height: 60,
    borderRadius: 30,
    backgroundColor: '#D4AF37',
    opacity: 0.15,
    zIndex: -1,
  },
  footerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 24,
  },
  footerLine: {
    width: 20, height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.3)',
  },
  footer: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 0.5,
    fontWeight: '500',
  },
});