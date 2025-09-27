import Header from '@/components/ui/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateUserScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'Checker' | 'Admin'>('Checker');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!fullName || !schoolId || !email || !password) {
      Alert.alert('Validation Error', 'Full name, School ID, Email, and Password are required.');
      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/login');
        return;
      }

      await axios.post(
        'https://testingapi.loca.lt/api/users',
        {
          full_name: fullName,
          school_id: schoolId,
          email,
          phone,
          role,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      Alert.alert('Success', 'User created successfully!');
      router.back(); // Go back to Users list
    } catch (error: any) {
      console.error('Failed to create user:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to create user. Please check your input.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        <Header title="Create User" />

        {/* KeyboardAvoidingView added here */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.form}>
              <View style={styles.formGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                      style={styles.input}
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="Full name"
                  />
              </View>

              <View style={styles.formGroup}>
                  <Text style={styles.label}>School ID</Text>
                  <TextInput
                      style={styles.input}
                      value={schoolId}
                      onChangeText={setSchoolId}
                      placeholder="School ID"
                  />
              </View>

              <View style={styles.formGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                  />
              </View>

              <View style={styles.formGroup}>
                  <Text style={styles.label}>Phone</Text>
                  <TextInput
                      style={styles.input}
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="Phone number"
                      keyboardType="phone-pad"
                  />
              </View>

              <View style={styles.formGroup}>
                  <Text style={styles.label}>Role</Text>
                  <View style={styles.pickerWrapper}>
                      <Picker selectedValue={role} onValueChange={(val) => setRole(val)}>
                          <Picker.Item label="Checker" value="Checker" />
                          <Picker.Item label="Admin" value="Admin" />
                      </Picker>
                  </View>
              </View>

              <View style={styles.formGroup}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                      style={styles.input}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Password"
                      secureTextEntry
                  />
              </View>

              {/* Save Button */}
              <TouchableOpacity style={styles.submitButton} onPress={handleSave} disabled={loading}>
                  <Text style={styles.submitText}>{loading ? 'Saving...' : 'Save User'}</Text>
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity style={[styles.submitButton, styles.cancelButton]} onPress={() => router.back()}>
                  <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    form: { padding: 20 },
    formGroup: { marginBottom: 16 },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
        color: '#1a1a1a',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        backgroundColor: '#fff',
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
    },
    submitButton: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: '#f1f1f1',
        marginTop: 8,
    },
    cancelText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '500',
    },
});