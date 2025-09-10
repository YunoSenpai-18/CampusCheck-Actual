import Header from '@/components/ui/Header';
import { createInstructor } from '@/services/instructorApi';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CreateInstructorScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [instructorId, setInstructorId] = useState('');
  const [course, setCourse] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!fullName || !instructorId || !course || !email || !phone) {
      Alert.alert('Validation Error', 'All fields are required');
      return;
    }

    const newInstructor = {
      full_name: fullName,
      instructor_id: instructorId,
      course,
      email,
      phone,
    };

    try {
      setLoading(true);
      const res = await createInstructor(newInstructor);

      if (res?.id) {
        Alert.alert('Success', 'Instructor created successfully');
        router.back(); // ✅ navigate back to list
      } else {
        Alert.alert('Error', res?.message || 'Failed to create instructor');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Add Instructor" onProfilePress={() => router.push('/(admin)/profile')} />

      <ScrollView contentContainerStyle={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />

        <TextInput
          style={styles.input}
          placeholder="Instructor ID"
          value={instructorId}
          onChangeText={setInstructorId}
        />

        {/* Course Dropdown */}
        <View style={styles.dropdownWrapper}>
          <Picker
            selectedValue={course}
            onValueChange={(value) => setCourse(value)}
            style={styles.picker}
            dropdownIconColor="#007AFF"
          >
            <Picker.Item label="Select Course" value="" />
            <Picker.Item label="SITE" value="SITE" />
            <Picker.Item label="SOE" value="SOE" />
            <Picker.Item label="SOHS" value="SOHS" />
            <Picker.Item label="SOC" value="SOC" />
            <Picker.Item label="SBA" value="SBA" />
            <Picker.Item label="SIHM" value="SIHM" />
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        {/* Create Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitText}>{loading ? 'Creating...' : 'Create'}</Text>
        </TouchableOpacity>

        {/* Cancel / Back Button */}
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
  dropdownWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 14,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    color: '#222',
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
