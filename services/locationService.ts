import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
}

/**
 * Ambil lokasi user via GPS. Fallback ke Payakumbuh kalau ditolak.
 */
export async function getUserLocation(): Promise<LocationData> {
  try {
    // Minta izin
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      // Fallback: Payakumbuh
      return {
        latitude: -0.2345555,
        longitude: 100.640474,
        city: 'Payakumbuh',
      };
    }

    // Ambil posisi
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const { latitude, longitude } = location.coords;

    // Reverse geocode untuk dapet nama kota
    let city = 'Lokasi Anda';
    try {
      const address = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (address[0]) {
        city = address[0].city || address[0].subregion || address[0].region || city;
      }
    } catch (e) {
      console.log('Reverse geocode failed:', e);
    }

    return { latitude, longitude, city };
  } catch (error) {
    console.error('Location error:', error);
    // Fallback
    return {
      latitude: -0.2345555,
      longitude: 100.640474,
      city: 'Payakumbuh',
    };
  }
}