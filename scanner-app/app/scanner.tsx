import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { checkInAPI } from '../src/api/checkin';
import { useAuth } from '../src/context/AuthContext';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();
  const { scanner } = useAuth();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned || processing) return;
    setScanned(true);
    setProcessing(true);

    try {
      const res = await checkInAPI.scanPass(data, scanner?.event_id || 0);
      // Navigate to result screen with success data
      router.replace({
        pathname: '/result',
        params: {
          success: 'true',
          result: res.data.result,
          message: res.data.message,
          guestName: res.data.guestName,
          passNumber: res.data.passNumber,
          category: res.data.category,
          checkedInAt: res.data.checkedInAt,
          gate: res.data.gate,
        }
      });
    } catch (error: any) {
      // Navigate to result screen with error data
      const errData = error.response?.data;
      router.replace({
        pathname: '/result',
        params: {
          success: 'false',
          result: errData?.result || 'CONNECTION_ERROR',
          message: errData?.message || 'Unable to contact the event server.',
          guestName: errData?.guestName || '',
          passNumber: errData?.passNumber || '',
          category: errData?.category || '',
          checkedInAt: errData?.checkedInAt || '',
          gate: errData?.gate || '',
        }
      });
    } finally {
      // We don't need to reset processing here because we are navigating away,
      // but just in case:
      setProcessing(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1b4d3e" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.scanBox}>
            {processing && (
              <View style={styles.processingIndicator}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.processingText}>Verifying Pass...</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Cancel Scan</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1b4d3e',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 16,
    padding: 16,
  },
  cancelText: {
    color: '#64748b',
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#d97706',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  processingIndicator: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  processingText: {
    color: 'white',
    marginTop: 12,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
