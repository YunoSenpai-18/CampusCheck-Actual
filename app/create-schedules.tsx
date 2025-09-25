import Header from '@/components/ui/Header';
import { fetchInstructors } from '@/services/instructorApi';
import { createSchedule } from '@/services/scheduleApi';
import { fetchUsers } from '@/services/userApi';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
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
      const [instRes, userRes] = await Promise.all([fetchInstructors(), fetchUsers()]);
      setInstructors(instRes || []);
      const onlyCheckers = (userRes || []).filter((u: User) => u.role === 'Checker');
      setCheckers(onlyCheckers);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load dropdown data');
    }
  }

  function formatDisplayTime(d: Date | null) {
    if (!d) return '';
    return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  }

  // ✅ Fixed: include AM/PM so backend accepts it
  function formatBackendTime(d: Date) {
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }); 
    // ex: "8:00 AM", "2:30 PM"
  }

  async function handleSubmit() {
    if (
      !subjectCode ||
      !subject ||
      !block ||
      !startTime ||
      !endTime ||
      !day ||
      !room ||
      !instructorId ||
      !checkerId
    ) {
      Alert.alert('Validation Error', 'All fields are required');
      return;
    }

    if (startTime && endTime && startTime >= endTime) {
      Alert.alert('Validation Error', 'End time must be after start time');
      return;
    }

    try {
      setLoading(true);
      const res = await createSchedule({
        subject_code: subjectCode,
        subject,
        block,
        start_time: formatBackendTime(startTime), // ex: "8:00 AM"
        end_time: formatBackendTime(endTime),     // ex: "2:00 PM"
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
      <Header title="Add Schedule" onProfilePress={() => router.push('/(admin)/profile')} />

      <ScrollView contentContainerStyle={styles.form}>
        <TextInput style={styles.input} placeholder="Subject Code" value={subjectCode} onChangeText={setSubjectCode} />
        <TextInput style={styles.input} placeholder="Subject" value={subject} onChangeText={setSubject} />
        <TextInput style={styles.input} placeholder="Block" value={block} onChangeText={setBlock} />

        {/* Start Time */}
        <Text style={styles.label}>Start Time</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowStartPicker(true)}>
          <Text>{startTime ? formatDisplayTime(startTime) : 'Select Start Time'}</Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startTime || new Date()}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            is24Hour={false}
            onChange={(event, selected) => {
              if (Platform.OS === 'android') {
                setShowStartPicker(false);
                if (event.type === 'set' && selected) setStartTime(selected);
              } else {
                if (selected) setStartTime(selected);
              }
            }}
          />
        )}

        {/* End Time */}
        <Text style={styles.label}>End Time</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowEndPicker(true)}>
          <Text>{endTime ? formatDisplayTime(endTime) : 'Select End Time'}</Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={endTime || new Date()}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            is24Hour={false}
            onChange={(event, selected) => {
              if (Platform.OS === 'android') {
                setShowEndPicker(false);
                if (event.type === 'set' && selected) setEndTime(selected);
              } else {
                if (selected) setEndTime(selected);
              }
            }}
          />
        )}

        {/* Day Picker */}
        <Text style={styles.label}>Select Day</Text>
        <View style={styles.dropdownWrapper}>
          <Picker selectedValue={day} onValueChange={(val) => setDay(val)} style={styles.picker} dropdownIconColor="#007AFF">
            <Picker.Item label="-- Select Day --" value="" />
            <Picker.Item label="Monday" value="Monday" />
            <Picker.Item label="Tuesday" value="Tuesday" />
            <Picker.Item label="Wednesday" value="Wednesday" />
            <Picker.Item label="Thursday" value="Thursday" />
            <Picker.Item label="Friday" value="Friday" />
            <Picker.Item label="Saturday" value="Saturday" />
            <Picker.Item label="Sunday" value="Sunday" />
          </Picker>
        </View>

        <TextInput style={styles.input} placeholder="Room" value={room} onChangeText={setRoom} />

        {/* Instructor Dropdown */}
        <Text style={styles.label}>Select Instructor</Text>
        <View style={styles.dropdownWrapper}>
          <Picker selectedValue={instructorId} onValueChange={(val) => setInstructorId(val)} style={styles.picker} dropdownIconColor="#007AFF">
            <Picker.Item label="-- Select Instructor --" value="" />
            {instructors.map((inst) => (
              <Picker.Item key={inst.id} label={inst.full_name} value={inst.id.toString()} />
            ))}
          </Picker>
        </View>

        {/* Checker Dropdown */}
        <Text style={styles.label}>Select Checker</Text>
        <View style={styles.dropdownWrapper}>
          <Picker selectedValue={checkerId} onValueChange={(val) => setCheckerId(val)} style={styles.picker} dropdownIconColor="#007AFF">
            <Picker.Item label="-- Select Checker --" value="" />
            {checkers.map((checker) => (
              <Picker.Item key={checker.id} label={checker.full_name} value={checker.id.toString()} />
            ))}
          </Picker>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.submitText}>{loading ? 'Saving...' : 'Save Schedule'}</Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity style={[styles.submitButton, styles.cancelButton]} onPress={() => router.back()}>
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
