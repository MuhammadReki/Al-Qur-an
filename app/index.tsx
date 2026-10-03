import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const JS_SPLASH_DURATION = 2200;

export default function Index() {
  const router = useRouter();

  // Animasi logo
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const logoGlow = useRef(new Animated.Value(0.3)).current;

  // Animasi teks
  const bismillahOpacity = useRef(new Animated.Value(0)).current;
  const bismillahY = useRef(new Animated.Value(15)).current;

  const titleY = useRef(new Animated.Value(30)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;

  const taglineY = useRef(new Animated.Value(15)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  // Progress bar
  const progressOpacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  // Particles
  const p1 = useRef(new Animated.Value(0)).current;
  const p2 = useRef(new Animated.Value(0)).current;
  const p3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 🌙 Logo: scale + fade + rotate
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 40,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.back(1.3)),
        useNativeDriver: true,
      }),
    ]).start();

    // ✨ Glow pulse (loop)
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoGlow, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(logoGlow, {
          toValue: 0.3,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 📜 Bismillah (delay 300ms)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(bismillahOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bismillahY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);

    // 📝 Title (delay 500ms)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(titleY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 500);

    // 💬 Tagline (delay 700ms)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(taglineY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 700);

    // 📊 Progress bar (delay 900ms)
    setTimeout(() => {
      Animated.timing(progressOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      Animated.timing(progressWidth, {
        toValue: 1,
        duration: 1300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }).start();
    }, 900);

    // ⭐ Particles (loop)
    const animateParticle = (value: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration: 1500,
            delay,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 1500,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateParticle(p1, 0);
    animateParticle(p2, 500);
    animateParticle(p3, 1000);

    // 🚀 Redirect (delay JS_SPLASH_DURATION)
    const timer = setTimeout(async () => {
      try {
        const hasSeen = await AsyncStorage.getItem('hasSeenOnboarding');
        if (hasSeen === 'true') {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/onboarding');
        }
      } catch (e) {
        router.replace('/onboarding');
      }
    }, JS_SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, []);

  const rotate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-15deg', '0deg'],
  });

  const barWidth = progressWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // Particle animations
  const particleStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1.2],
        }),
      },
    ],
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Background gradient putih → hijau lembut */}
      <LinearGradient
        colors={['#FFFFFF', '#F0FDF4', '#DCFCE7', '#FFFFFF']}
        locations={[0, 0.3, 0.7, 1]}
        style={styles.background}
      >
        {/* Ornamen atas */}
        <View style={styles.ornamentTopRight} />
        <View style={styles.ornamentTopLeft} />
        <View style={styles.ornamentBottom} />

        {/* Floating particles */}
        <Animated.View style={[styles.particle, styles.particle1, particleStyle(p1)]}>
          <Ionicons name="sparkles" size={14} color="#D4AF37" />
        </Animated.View>
        <Animated.View style={[styles.particle, styles.particle2, particleStyle(p2)]}>
          <Ionicons name="star" size={10} color="#10B981" />
        </Animated.View>
        <Animated.View style={[styles.particle, styles.particle3, particleStyle(p3)]}>
          <Ionicons name="sparkles" size={12} color="#D4AF37" />
        </Animated.View>

        {/* Konten utama */}
        <View style={styles.content}>
          {/* Bismillah */}
          <Animated.View
            style={{
              opacity: bismillahOpacity,
              transform: [{ translateY: bismillahY }],
            }}
          >
            <Text style={styles.bismillah}>
              بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
            </Text>
          </Animated.View>

          {/* Logo dengan glow */}
          <View style={styles.logoContainer}>
            {/* Glow effect */}
            <Animated.View
              style={[
                styles.logoGlowOuter,
                { opacity: logoGlow },
              ]}
            />
            <Animated.View
              style={[
                styles.logoGlowInner,
                { opacity: logoGlow },
              ]}
            />

            {/* Logo */}
            <Animated.View
              style={[
                styles.logoWrapper,
                {
                  opacity: logoOpacity,
                  transform: [
                    { scale: logoScale },
                    { rotate: rotate },
                  ],
                },
              ]}
            >
              <Image
                source={require('../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </Animated.View>
          </View>

          {/* Title */}
          <Animated.View
            style={{
              opacity: titleOpacity,
              transform: [{ translateY: titleY }],
            }}
          >
            <Text style={styles.title}>MyQur'an</Text>
          </Animated.View>

          {/* Ornament line */}
          <Animated.View
            style={[
              styles.titleOrnament,
              { opacity: titleOpacity },
            ]}
          >
            <View style={styles.titleOrnamentLine} />
            <View style={styles.titleOrnamentDiamond} />
            <View style={styles.titleOrnamentLine} />
          </Animated.View>

          {/* Tagline */}
          <Animated.View
            style={{
              opacity: taglineOpacity,
              transform: [{ translateY: taglineY }],
            }}
          >
            <Text style={styles.tagline}>Teman setia hafalanmu</Text>
          </Animated.View>
        </View>

        {/* Progress bar di bawah */}
        <Animated.View style={[styles.progressWrapper, { opacity: progressOpacity }]}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFillWrap, { width: barWidth }]}>
              <LinearGradient
                colors={['#10B981', '#059669', '#D4AF37']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.progressFill}
              />
            </Animated.View>
          </View>
          <Text style={styles.progressText}>Memuat aplikasi...</Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Ornamen */
  ornamentTopRight: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(16, 185, 129, 0.06)',
  },
  ornamentTopLeft: {
    position: 'absolute',
    top: 50,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
  },
  ornamentBottom: {
    position: 'absolute',
    bottom: -120,
    left: -50,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(5, 150, 105, 0.04)',
  },

  /* Particles */
  particle: {
    position: 'absolute',
  },
  particle1: {
    top: SCREEN_HEIGHT * 0.22,
    left: SCREEN_WIDTH * 0.18,
  },
  particle2: {
    top: SCREEN_HEIGHT * 0.28,
    right: SCREEN_WIDTH * 0.15,
  },
  particle3: {
    top: SCREEN_HEIGHT * 0.15,
    right: SCREEN_WIDTH * 0.25,
  },

  /* Konten */
  content: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },

    bismillah: {
    fontSize: 28,
    color: '#D4AF37',
    textAlign: 'center',
    lineHeight: 52,
    marginBottom: 60,    // ← dari 24 jadi 60
    fontFamily: 'Scheherazade-SemiBold',
    textShadowColor: 'rgba(212, 175, 55, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  /* Logo */
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 24,
  },
  logoGlowOuter: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  logoGlowInner: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 140,
    height: 140,
  },

  /* Title */
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(16, 185, 129, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },

  /* Ornament line under title */
  titleOrnament: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  titleOrnamentLine: {
    width: 40,
    height: 1,
    backgroundColor: '#D4AF37',
    opacity: 0.6,
  },
  titleOrnamentDiamond: {
    width: 6,
    height: 6,
    backgroundColor: '#D4AF37',
    transform: [{ rotate: '45deg' }],
    borderRadius: 1,
  },

  /* Tagline */
  tagline: {
    fontSize: 13,
    color: '#64748B',
    fontStyle: 'italic',
    letterSpacing: 0.8,
    textAlign: 'center',
  },

  /* Progress bar */
  progressWrapper: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.65,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(5, 150, 105, 0.12)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFillWrap: {
    height: 4,
    borderRadius: 2,
  },
  progressFill: {
    flex: 1,
    borderRadius: 2,
  },
  progressText: {
    marginTop: 12,
    fontSize: 11,
    color: '#94A3B8',
    letterSpacing: 0.5,
    fontStyle: 'italic',
  },
});