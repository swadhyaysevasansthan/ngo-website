import { secureStorage } from '../utils/secureStorage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Resolve the backend API URL intelligently:
 * 1. If EXPO_PUBLIC_API_URL is set (production/staging/local override), always use that.
 * 2. On Expo Go (physical device), derive the host IP from the Expo dev server URL
 *    so the phone can reach the backend running on the developer's machine.
 * 3. Fallback to older Constants.manifest.debuggerHost (pre-SDK 46 style).
 * 4. On Android emulator, 10.0.2.2 maps to the host machine's localhost.
 * 5. Fallback: localhost (works on web and iOS simulator only).
 */
function resolveApiUrl(): string {
  // Highest priority: explicit env var (set this in .env.local for development too)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // SDK 46+ way: expoConfig.hostUri is "192.168.x.x:8081" in Expo Go dev builds
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const hostIp = hostUri.split(':')[0];
    const url = `http://${hostIp}:5000/api`;
    console.log('[API] Resolved URL from expoConfig.hostUri:', url);
    return url;
  }

  // Older SDK fallback: manifest.debuggerHost
  const debuggerHost = (Constants as any).manifest?.debuggerHost;
  if (debuggerHost) {
    const hostIp = debuggerHost.split(':')[0];
    const url = `http://${hostIp}:5000/api`;
    console.log('[API] Resolved URL from manifest.debuggerHost:', url);
    return url;
  }

  // Android emulator: 10.0.2.2 routes to host machine localhost
  if (Platform.OS === 'android') {
    console.log('[API] Falling back to Android emulator URL');
    return 'http://10.0.2.2:5000/api';
  }

  // Web / iOS simulator: localhost is the host machine
  console.log('[API] Falling back to localhost');
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
