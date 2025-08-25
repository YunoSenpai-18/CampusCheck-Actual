import AuthButton from '@/components/auth/AuthButton';
import AuthInput from '@/components/auth/AuthInput';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Constants
const EMAIL_PLACEHOLDER = 'name@cdd.edu.ph';
const PASSWORD_PLACEHOLDER = '********';

// Temporary backend login (replace with API later)
async function loginWithEmail(email: string, password: string) {
  return new Promise<{ success: boolean; role?: string }>((resolve) => {
    setTimeout(() => {
      if (email === 'admin@gmail.com' && password === '1234') {
        resolve({ success: true, role: 'admin' });
      } else if (email === 'checker@gmail.com' && password === '1234') {
        resolve({ success: true, role: 'checker' });
      } else {
        resolve({ success: false });
      }
    }, 800);
  });
}

// ✅ Logo component
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = useCallback(async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const result = await loginWithEmail(email, password);

      if (result.success) {
        Alert.alert('Success', 'Login successful!', [
          {
            text: 'OK',
            onPress: () => {
              if (result.role === 'admin') {
                router.replace('/(admin)');
              } else {
                router.replace('/(checker)');
              }
            },
          },
        ]);
      } else {
        Alert.alert('Error', 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  }, [email, password, router]);

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
            {/* App Logo */}
            <Logo />

            {/* Title */}
            <Text style={styles.title}>Sign in to your account</Text>
            <Text style={styles.subtitle}>
              Enter your credentials to continue
            </Text>

            {/* Form */}
            <View style={styles.form}>
              <AuthInput
                label="Email"
                placeholder={EMAIL_PLACEHOLDER}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
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
                title="Sign In"
                onPress={handleSignIn}
                style={styles.signInButton}
              />
            </View>

            {/* --- Quick Role Login Buttons (for testing only) --- */}
            <View style={styles.tempButtons}>
              <AuthButton
                title="Login as Checker"
                onPress={() => router.replace('/(checker)')}
                style={{ backgroundColor: '#34C759' }}
              />
              <AuthButton
                title="Login as Admin"
                onPress={() => router.replace('/(admin)')}
                style={{ backgroundColor: '#FF9500' }}
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
    backgroundColor: '#ffffff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  logo: {
    width: 120, // adjust size
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
    marginBottom: 32,
  },
  signInButton: {
    marginTop: 8,
  },
  tempButtons: {
    marginTop: 24,
    gap: 12,
  },
});
