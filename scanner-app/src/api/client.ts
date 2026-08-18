import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// For Android emulator, 10.0.2.2 points to host localhost. 
// For real devices, replace with your machine's local IP (e.g., 192.168.1.100) or production URL.
const defaultApiUrl = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';
export const API_URL = process.env.EXPO_PUBLIC_API_URL || defaultApiUrl;

export const fetchClient = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const token = await SecureStore.getItemAsync('scannerToken');
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    throw { response: { data, status: response.status } };
  }
  
  return { data };
};
