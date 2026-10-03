// services/doaApi.ts
// Service untuk fetch doa dari EQuran.id API

const BASE_URL = 'https://equran.id/api';

export interface DoaApiResponse {
  id: number;
  grup: string;
  nama: string;
  ar: string;        // 👈 Arab
  tr: string;        // 👈 Latin/Transliterasi
  idn: string;       // 👈 Terjemahan Indonesia
  tentang?: string;  // 👈 Sumber/keterangan
  tag?: string[];
}

// 👇 Ambil semua doa (227 doa)
export async function getAllDoa(): Promise<DoaApiResponse[]> {
  try {
    const response = await fetch(`${BASE_URL}/doa`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const json = await response.json();
    
    // 👇 Format asli: { status, total, data: [...] }
    if (json.data && Array.isArray(json.data)) {
      return json.data;
    }
    
    // Fallback kalau format beda
    if (Array.isArray(json)) return json;
    if (json.doa && Array.isArray(json.doa)) return json.doa;
    
    console.warn('Format response tidak dikenal:', json);
    return [];
  } catch (error) {
    console.error('Gagal fetch doa:', error);
    return [];
  }
}

// 👇 Ambil detail 1 doa by ID
export async function getDoaById(id: number): Promise<DoaApiResponse | null> {
  try {
    const response = await fetch(`${BASE_URL}/doa/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const json = await response.json();
    
    if (json.data) return json.data;
    return json;
  } catch (error) {
    console.error('Gagal fetch detail doa:', error);
    return null;
  }
}