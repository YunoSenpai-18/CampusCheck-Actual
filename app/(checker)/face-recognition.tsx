import Header from '@/components/ui/Header';
import { useIsFocused } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FaceRecognitionScreen() {
  const router = useRouter();
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused(); // Track tab focus
  const [cameraActive, setCameraActive] = useState(true);

  const navigateToProfile = () => {
    router.push('/(checker)/profile');
  };

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    // Pause/Resume camera when switching tabs
    if (isFocused) {
      setCameraActive(true);
    } else {
      setCameraActive(false);
    }
  }, [isFocused]);

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 40 }}>Requesting camera permissions...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 40 }}>
          Camera access is required to use this feature.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={{ color: '#fff', fontSize: 16 }}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  /* Placeholder for backend
  const handleFaceRecognition = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      console.log("Captured image data:", photo.uri);
    }
  }; */

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Face Recognition" onProfilePress={navigateToProfile} />
      
      <View style={styles.content}>
        <View style={styles.cameraContainer}>
          {cameraActive && (
            <CameraView
              ref={cameraRef}
              style={{ flex: 1 }}
              facing="back"
              onCameraReady={() => {
                console.log("Camera ready");
              }}
            />
          )}
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Ready to scan</Text>
          <Text style={styles.statusSubtext}>Align the instructor's face within the frame</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { flex: 1, padding: 20, backgroundColor: '#ffffff' },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f3f4',
  },
  statusContainer: { alignItems: 'center' },
  statusText: { fontSize: 18, fontWeight: '600', color: '#1a1a1a', marginBottom: 4 },
  statusSubtext: { fontSize: 14, color: '#666666', textAlign: 'center' },
  permissionButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
});