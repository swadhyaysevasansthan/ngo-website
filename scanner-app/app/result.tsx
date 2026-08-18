import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const { 
    success, 
    result, 
    message, 
    guestName, 
    passNumber, 
    category, 
    checkedInAt, 
    gate 
  } = params;

  const isSuccess = success === 'true';

  let icon = '✕';
  let title = 'UNKNOWN ERROR';
  let color = '#ef4444'; // red
  let bg = '#fee2e2';

  if (isSuccess && result === 'SUCCESS') {
    icon = '✓';
    title = 'ENTRY APPROVED';
    color = '#16a34a'; // green
    bg = '#dcfce7';
  } else if (result === 'ALREADY_CHECKED_IN') {
    icon = '⚠';
    title = 'ALREADY CHECKED IN';
    color = '#d97706'; // amber
    bg = '#fef3c7';
  } else if (result === 'INVALID') {
    icon = '✕';
    title = 'INVALID PASS';
    color = '#dc2626'; // red
    bg = '#fee2e2';
  } else if (result === 'CANCELLED') {
    icon = '✕';
    title = 'PASS CANCELLED';
    color = '#dc2626'; // red
    bg = '#fee2e2';
  } else if (result === 'CONNECTION_ERROR') {
    icon = '⚠';
    title = 'CONNECTION ERROR';
    color = '#ea580c'; // orange
    bg = '#ffedd5';
  }

  const formatTime = (isoString?: string | string[]) => {
    if (!isoString) return 'N/A';
    const str = Array.isArray(isoString) ? isoString[0] : isoString;
    if (!str) return 'N/A';
    try {
      return new Date(str).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return str;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.card}>
        <View style={[styles.iconBox, { backgroundColor: color }]}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>
        
        <Text style={[styles.title, { color }]}>{title}</Text>
        
        {(guestName || passNumber) ? (
          <View style={styles.detailsBox}>
            {guestName ? <Text style={styles.guestName}>{guestName}</Text> : null}
            {passNumber ? <Text style={styles.passNumber}>{passNumber}</Text> : null}
            {category ? <Text style={styles.category}>{category}</Text> : null}
            
            {checkedInAt ? (
              <View style={styles.checkInInfo}>
                <Text style={styles.infoLabel}>Checked in: {formatTime(checkedInAt)}</Text>
                {gate ? <Text style={styles.infoLabel}>Gate: {gate}</Text> : null}
              </View>
            ) : null}
          </View>
        ) : (
          <View style={styles.detailsBox}>
            <Text style={styles.message}>{message}</Text>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: color }]} 
          onPress={() => router.replace('/scanner')}
        >
          <Text style={styles.buttonText}>{result === 'CONNECTION_ERROR' ? '[ RETRY ]' : '[ SCAN NEXT ]'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.dashboardButton} onPress={() => router.replace('/')}>
          <Text style={styles.dashboardText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsBox: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  guestName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  passNumber: {
    fontSize: 16,
    color: '#64748b',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d97706',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  checkInInfo: {
    marginTop: 10,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    width: '100%',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  dashboardButton: {
    padding: 10,
  },
  dashboardText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
});
