import AuthButton from '@/components/auth/AuthButton';
import AuthInput from '@/components/auth/AuthInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Constants
const SCHOOL_ID_PLACEHOLDER = '22-0000-000';
const PASSWORD_PLACEHOLDER = '********';

// Expose public domain here
const API_URL = 'https://testingapi.loca.lt/api';

function Logo() {
  return (
    <Image
      source={require('@/assets/images/logo-Photoroom.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const [schoolId, setSchoolId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = useCallback(async () => {
    if (!schoolId || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API_URL}/login`, {
        school_id: schoolId,
        password: password,
      });

      const { access_token, user } = res.data;

      if (access_token && user) {
        // Save token + user in AsyncStorage
        await AsyncStorage.setItem('token', access_token);
        await AsyncStorage.setItem('user', JSON.stringify(user));

        const navigateByRole = () => {
          if (user.role === 'Admin') {
            router.replace('/(admin)');
          } else if (user.role === 'Checker') {
            router.replace('/(checker)');
          } else {
            Alert.alert('Error', 'Unknown role, cannot login');
          }
        };
        navigateByRole();
      } else {
        Alert.alert('Error', 'Unexpected response from server');
      }
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'Could not connect to server'
      );
    } finally {
      setLoading(false);
    }
  }, [schoolId, password, router]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Logo />
            <Text style={styles.title}>Sign in to your account</Text>
            <Text style={styles.subtitle}>
              Enter your School ID and Password
            </Text>

            <View style={styles.form}>
              <AuthInput
                label="School ID"
                placeholder={SCHOOL_ID_PLACEHOLDER}
                value={schoolId}
                onChangeText={setSchoolId}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <AuthInput
                label="Password"
                placeholder={PASSWORD_PLACEHOLDER}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />

              <AuthButton
                title={loading ? 'Signing In...' : 'Sign In'}
                onPress={handleSignIn}
                disabled={loading}
                style={styles.signInButton}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff' 
  },
  keyboardView: {
    flex: 1 
  },
  scrollContent: {
    flexGrow: 1 
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 48,
    textAlign: 'center',
  },
  form: {
    gap: 24,
    marginBottom: 32 
  },
  signInButton: {
    marginTop: 8 
  },
});
