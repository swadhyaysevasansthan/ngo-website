import { secureStorage } from '../utils/secureStorage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Resolve the backend API URL intelligently:
 * 1. If EXPO_PUBLIC_API_URL is set (production/staging), always use that.
 * 2. On Expo Go (physical device), derive the host IP from the Expo dev server URL
 *    so the phone can reach the backend running on the developer's machine.
 * 3. On Android emulator, 10.0.2.2 maps to the host machine's localhost.
 * 4. Fallback: localhost (works on web and iOS simulator).
 */
function resolveApiUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // When running in Expo Go on a physical device, hostUri looks like "192.168.x.x:8081"
  // We extract the IP and use port 5000 for the backend.
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const hostIp = hostUri.split(':')[0];
    return `http://${hostIp}:5000/api`;
  }

  // Android emulator: 10.0.2.2 routes to host machine localhost
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }

  // Web / iOS simulator: localhost is the host machine
  return 'http://localhost:5000/api';
}

export const API_URL = resolveApiUrl();

export const fetchClient = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const token = await secureStorage.getItem('scannerToken');
  
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
