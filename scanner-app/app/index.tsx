import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const { scanner, logout } = useAuth();
  const router = useRouter();

  if (!scanner) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.orgName}>SWADHYAY</Text>
        <Text style={styles.eventName}>{scanner.event_name || 'Active Event'}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Scanner:</Text>
        <Text style={styles.value}>{scanner.name}</Text>
        <Text style={styles.subValue}>{scanner.gate || 'Main Gate'} - {scanner.device_code}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={() => router.push('/scanner')}
        >
          <Text style={styles.scanButtonText}>[ CAMERA SCANNER ]</Text>
        </TouchableOpacity>
        <Text style={styles.scanHelp}>Point camera at QR pass</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  orgName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1b4d3e',
    letterSpacing: 2,
    marginBottom: 8,
  },
  eventName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 40,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subValue: {
    fontSize: 14,
    color: '#475569',
  },
  actions: {
    alignItems: 'center',
    flex: 1,
  },
  scanButton: {
    backgroundColor: '#d97706',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#d97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 16,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  scanHelp: {
    fontSize: 14,
    color: '#64748b',
  },
  logoutButton: {
    padding: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 16,
  },
});
