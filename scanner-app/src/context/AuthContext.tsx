import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { scannerAuthAPI } from '../api/auth';
import { secureStorage } from '../utils/secureStorage';
import { useRouter, useSegments } from 'expo-router';

interface ScannerProfile {
  id: number;
  name: string;
  device_code: string;
  event_id: number;
  gate: string;
  event_name: string;
  event_status: string;
}

interface AuthContextType {
  scanner: ScannerProfile | null;
  isLoading: boolean;
  login: (deviceCode: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [scanner, setScanner] = useState<ScannerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  const loadSession = async () => {
    try {
      setIsLoading(true);
      const token = await secureStorage.getItem('scannerToken');
      if (token) {
        const res = await scannerAuthAPI.getProfile();
        if (res.data.success) {
          setScanner(res.data.scanner);
        } else {
          await secureStorage.removeItem('scannerToken');
          setScanner(null);
        }
      }
    } catch (error) {
      console.error('Session load error:', error);
      await secureStorage.removeItem('scannerToken');
      setScanner(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'login';
    
    if (!scanner && !inAuthGroup) {
      // Redirect to the login page.
      router.replace('/login');
    } else if (scanner && inAuthGroup) {
      // Redirect away from the login page.
      router.replace('/');
    }
  }, [scanner, segments, isLoading]);

  const login = async (deviceCode: string, password: string) => {
    const res = await scannerAuthAPI.login(deviceCode, password);
    if (res.data.success && res.data.token) {
      await secureStorage.setItem('scannerToken', res.data.token);
      setScanner(res.data.scanner);
      router.replace('/');
    } else {
      throw new Error(res.data.message || 'Login failed');
    }
  };

  const logout = async () => {
    await secureStorage.removeItem('scannerToken');
    setScanner(null);
    router.replace('/login');
  };

  const refreshProfile = async () => {
    const res = await scannerAuthAPI.getProfile();
    if (res.data.success) {
      setScanner(res.data.scanner);
    }
  };

  return (
    <AuthContext.Provider value={{ scanner, isLoading, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
