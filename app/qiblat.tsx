import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Magnetometer } from 'expo-sensors';
import * as Location from 'expo-location';

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

export default function QiblatScreen() {
  const [heading, setHeading] = useState(0);
  const [qiblatAngle, setQiblatAngle] = useState(0);
  const [location, setLocation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs buat smoothing
  const headingRef = useRef(0);
  const targetRef = useRef(0);
  const animFrameRef = useRef<any>(null);

  useEffect(() => {
    let sub: any;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Izin lokasi ditolak');
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(loc.coords);

        const lat1 = (loc.coords.latitude * Math.PI) / 180;
        const lat2 = (KAABA_LAT * Math.PI) / 180;
        const dLng = ((KAABA_LNG - loc.coords.longitude) * Math.PI) / 180;
        const y = Math.sin(dLng) * Math.cos(lat2);
        const x =
          Math.cos(lat1) * Math.sin(lat2) -
          Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
        const brng = (Math.atan2(y, x) * 180) / Math.PI;
        setQiblatAngle((brng + 360) % 360);
      } catch (e) {
        setError('Gagal mengambil lokasi');
      }
    })();

    // Sensor update cepat
    Magnetometer.setUpdateInterval(16);

    sub = Magnetometer.addListener(({ x, y }) => {
      let angle = (Math.atan2(y, x) * 180) / Math.PI;
      angle = (angle + 360) % 360;
      targetRef.current = angle;
    });

    // 🔥 Animasi loop 60fps: gerakan halus ke target
    const animate = () => {
      const target = targetRef.current;
      const current = headingRef.current;

      // Hitung shortest path (biar gak muter 360°)
      let diff = target - current;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      // Lerp: makin deket, makin lambat (smooth easing)
      const newHeading = current + diff * 0.12;

      headingRef.current = newHeading;
      setHeading(newHeading);

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (sub) sub.remove();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const rotation = qiblatAngle - heading;
  const isAligned = Math.abs(((rotation + 180) % 360) - 180) < 5;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A1628', '#134E4A', '#059669']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Arah Kiblat</Text>
        <View style={{ width: 42 }} />
      </LinearGradient>

      <View style={styles.content}>
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={48} color="#DC2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <>
            <Text style={styles.subtitle}>
              Arahkan HP ke kiblat hingga jarum menyala hijau
            </Text>

            <View style={styles.compassWrapper}>
              <View
                style={[
                  styles.compassOuter,
                  isAligned && styles.compassOuterAligned,
                ]}
              >
                <View style={styles.compassInner}>
                  <Text style={[styles.direction, styles.directionN]}>U</Text>
                  <Text style={[styles.direction, styles.directionS]}>S</Text>
                  <Text style={[styles.direction, styles.directionE]}>T</Text>
                  <Text style={[styles.direction, styles.directionW]}>B</Text>

                  <View
                    style={[
                      styles.needleWrapper,
                      { transform: [{ rotate: `${rotation}deg` }] },
                    ]}
                  >
                    <View
                      style={[
                        styles.needleTop,
                        isAligned && styles.needleTopAligned,
                      ]}
                    />
                    <View style={styles.needleBottom} />
                  </View>

                  <View style={styles.centerDot} />
                </View>
              </View>

              <View style={styles.angleBadge}>
                <Text style={styles.angleText}>{Math.round(qiblatAngle)}°</Text>
                <Text style={styles.angleLabel}>dari Utara</Text>
              </View>

              {isAligned && (
                <View style={styles.alignedBadge}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.alignedText}>Sudah menghadap kiblat</Text>
                </View>
              )}
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons name="location" size={16} color="#059669" />
                <Text style={styles.infoLabel}>Lokasi</Text>
              </View>
              <Text style={styles.infoValue}>
                {location
                  ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                  : 'Mencari lokasi...'}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons name="compass" size={16} color="#059669" />
                <Text style={styles.infoLabel}>Heading HP</Text>
              </View>
              <Text style={styles.infoValue}>{Math.round(heading)}°</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingTop: 50,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#FFFFFF' },
  content: { flex: 1, padding: 20, alignItems: 'center' },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  compassWrapper: { alignItems: 'center', justifyContent: 'center' },
  compassOuter: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 3,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  compassOuterAligned: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  compassInner: {
    flex: 1,
    borderRadius: 130,
    backgroundColor: 'rgba(10, 22, 40, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  direction: {
    position: 'absolute',
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '800',
  },
  directionN: { top: 12, color: '#10B981' },
  directionS: { bottom: 12 },
  directionE: { right: 12 },
  directionW: { left: 12 },
  needleWrapper: {
    width: 20,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  needleTop: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 100,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#D4AF37',
    marginBottom: -1,
  },
  needleTopAligned: {
    borderBottomColor: '#10B981',
  },
  needleBottom: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 100,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(255,255,255,0.25)',
    marginTop: -1,
  },
  centerDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#D4AF37',
    borderWidth: 3,
    borderColor: '#0A1628',
    zIndex: 10,
  },
  angleBadge: {
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    alignItems: 'center',
  },
  angleText: { color: '#D4AF37', fontSize: 24, fontWeight: '800' },
  angleLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 },
  alignedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  alignedText: { color: '#10B981', fontWeight: '700', fontSize: 13 },
  infoCard: {
    width: '100%',
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  infoLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '600' },
  infoValue: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  errorBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  errorText: { color: '#DC2626', fontSize: 15, textAlign: 'center' },
});