// src/api/client.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = process.env.EXPO_PUBLIC_API_URL

export const api = axios.create({
  baseURL: API_URL,
});

// Anexa o token JWT automaticamente em todas as requisições
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn('Erro ao ler token do AsyncStorage', err);
  }
  return config;
});

// Monta a URL completa da imagem vinda do backend
export function buildImageUrl(path?: string | null): string | undefined {
  if (!path) return undefined;

  // Data URL / base64
  if (path.startsWith('data:')) return path;

  // Já é URL absoluta
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  // Remove ./ ou / do começo
  const cleanPath = path.replace(/^\.?\//, '');
  const base = API_URL.replace(/\/$/, '');

  return `${base}/${cleanPath}`;
}
