import Header from '@/components/ui/Header';
import { createUser } from '@/services/userApi';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
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
  const [showPassword, setShowPassword] = useState(false);
  const [photo, setPhoto] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!fullName || !schoolId || !email || !password) {
      Alert.alert(
        'Validation Error',
        'Full name, School ID, Email, and Password are required.'
      );
      return;
    }

    const newUser = {
      full_name: fullName,
      school_id: schoolId,
      email,
      phone,
      role,
      password,
    };

    try {
      setLoading(true);
      const res = await createUser(newUser, photo);

      if (res?.id) {
        Alert.alert('Success', 'User created successfully');
        router.back();
      } else {
        Alert.alert('Error', res?.message || 'Failed to create user');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Create User" onProfilePress={() => router.push('/(admin)/profile')} />

      <ScrollView 
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.label}>School ID</Text>
        <TextInput
          style={styles.input}
          placeholder="School ID"
          value={schoolId}
          onChangeText={setSchoolId}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Role</Text>
        <View style={styles.dropdownWrapper}>
          <Picker
            selectedValue={role}
            onValueChange={(value) => setRole(value)}
            style={styles.picker}
            dropdownIconColor="#007AFF"
          >
            <Picker.Item label="Checker" value="Checker" />
            <Picker.Item label="Admin" value="Admin" />
          </Picker>
        </View>

        <Text style={styles.label}>Password</Text>
          <View style={{ position: 'relative' }}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              onPressIn={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 12,
                top: '38%',
                transform: [{ translateY: -10 }],
              }}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>

        {/* Photo Picker */}
        <Text style={styles.label}>Photo</Text>
        <TouchableOpacity style={styles.photoPicker} onPress={pickImage}>
          {photo ? (
            <Image
              source={{ uri: photo.uri }}
              style={{ width: '100%', height: '100%', borderRadius: 10 }}
              resizeMode="cover"
            />
          ) : (
            <Text style={{ color: '#888' }}>Tap to select an image</Text>
          )}
        </TouchableOpacity>

        {/* Submit */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitText}>{loading ? 'Creating...' : 'Create'}</Text>
        </TouchableOpacity>

        {/* Cancel */}
        <TouchableOpacity
          style={[styles.submitButton, styles.cancelButton]}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  form: { padding: 20 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 6,
    color: '#333',
  },
  dropdownWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 14,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: { height: 50, color: '#222' },
  photoPicker: {
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    marginBottom: 14,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancelButton: { backgroundColor: '#f1f1f1', marginTop: 8 },
  cancelText: { color: '#333', fontSize: 16, fontWeight: '500' },
});
