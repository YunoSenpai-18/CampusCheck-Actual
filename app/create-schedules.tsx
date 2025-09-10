import Header from '@/components/ui/Header';
import { fetchInstructors } from '@/services/instructorApi';
import { createSchedule } from '@/services/scheduleApi';
import { fetchUsers } from '@/services/userApi';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

// --- Types ---
type Instructor = {
  id: number;
  full_name: string;
  instructor_id: string;
  department: string;
  email: string;
  phone: string;
};

type User = {
  id: number;
  full_name: string;
  school_id: string;
  email: string;
  phone?: string;
  role: 'Checker' | 'Admin';
};

export default function CreateScheduleScreen() {
  const router = useRouter();

  // form fields
  const [subjectCode, setSubjectCode] = useState('');
  const [subject, setSubject] = useState('');
  const [block, setBlock] = useState('');
  const [time, setTime] = useState('');
  const [day, setDay] = useState('');
  const [room, setRoom] = useState('');

  // dropdown data
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [checkers, setCheckers] = useState<User[]>([]);

  // selected IDs
  const [instructorId, setInstructorId] = useState('');
  const [checkerId, setCheckerId] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDropdowns();
  }, []);

  async function loadDropdowns() {
    try {
      const [instRes, userRes] = await Promise.all([
        fetchInstructors(),
        fetchUsers(),
      ]);

      setInstructors(instRes || []);

      // only keep users with role = "Checker"
      const onlyCheckers = (userRes || []).filter(
        (u: User) => u.role === 'Checker'
      );
      setCheckers(onlyCheckers);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load dropdown data');
    }
  }

  async function handleSubmit() {
    if (
      !subjectCode ||
      !subject ||
      !block ||
      !time ||
      !day ||
      !room ||
      !instructorId ||
      !checkerId
    ) {
      Alert.alert('Validation Error', 'All fields are required');
      return;
    }

    try {
      setLoading(true);
      const res = await createSchedule({
        subject_code: subjectCode,
        subject,
        block,
        time,
        day,
        room,
        instructor_id: Number(instructorId),
        assigned_checker_id: Number(checkerId),
      });

      if (res?.id) {
        Alert.alert('Success', 'Schedule created successfully');
        router.back();
      } else {
        Alert.alert('Error', res?.message || 'Failed to create schedule');
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Add Schedule"
        onProfilePress={() => router.push('/(admin)/profile')}
      />

      <ScrollView contentContainerStyle={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Subject Code"
          value={subjectCode}
          onChangeText={setSubjectCode}
        />
        <TextInput
          style={styles.input}
          placeholder="Subject"
          value={subject}
          onChangeText={setSubject}
        />
        <TextInput
          style={styles.input}
          placeholder="Block"
          value={block}
          onChangeText={setBlock}
        />
        <TextInput
          style={styles.input}
          placeholder="Time"
          value={time}
          onChangeText={setTime}
        />
        <TextInput
          style={styles.input}
          placeholder="Day"
          value={day}
          onChangeText={setDay}
        />
        <TextInput
          style={styles.input}
          placeholder="Room"
          value={room}
          onChangeText={setRoom}
        />

        {/* Instructor Dropdown */}
        <Text style={styles.label}>Select Instructor</Text>
        <View style={styles.dropdownWrapper}>
          <Picker
            selectedValue={instructorId}
            onValueChange={(val) => setInstructorId(val)}
            style={styles.picker}
            dropdownIconColor="#007AFF"
          >
            <Picker.Item label="-- Select Instructor --" value="" />
            {instructors.map((inst) => (
              <Picker.Item
                key={inst.id}
                label={inst.full_name}
                value={inst.id.toString()}
              />
            ))}
          </Picker>
        </View>

        {/* Checker Dropdown */}
        <Text style={styles.label}>Select Checker</Text>
        <View style={styles.dropdownWrapper}>
          <Picker
            selectedValue={checkerId}
            onValueChange={(val) => setCheckerId(val)}
            style={styles.picker}
            dropdownIconColor="#007AFF"
          >
            <Picker.Item label="-- Select Checker --" value="" />
            {checkers.map((checker) => (
              <Picker.Item
                key={checker.id}
                label={checker.full_name}
                value={checker.id.toString()}
              />
            ))}
          </Picker>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitText}>
            {loading ? 'Saving...' : 'Save Schedule'}
          </Text>
        </TouchableOpacity>

        {/* Cancel Button */}
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
