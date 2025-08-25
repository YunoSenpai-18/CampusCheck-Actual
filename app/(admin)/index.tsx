import Header from '@/components/ui/Header';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Instructor = {
  id: number;
  full_name: string;
  instructor_id: string;
  course: string;
  email: string;
  phone: string;
  photo?: string;
};

export default function InstructorScreen() {
  const router = useRouter();

  const navigateToProfile = () => {
    router.push('/(admin)/profile');
  };

  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  const [nameFilter, setNameFilter] = useState('');
  const [idFilter, setIdFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const data: Instructor[] = [
        {
          id: 1,
          full_name: 'Jelson V. Lanto',
          instructor_id: '22-0001-000',
          course: 'SITE',
          email: 'jelson@cdd.edu.ph',
          phone: '09123456789',
        },
        {
          id: 2,
          full_name: 'Yuri Rancudo',
          instructor_id: '22-0002-000',
          course: 'SOE',
          email: 'yuri@cdd.edu.ph',
          phone: '09987654321',
        },
      ];
      setInstructors(data);
    } catch (error) {
      console.error('Failed to fetch instructors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const filteredInstructors = instructors.filter((inst) => {
    return (
      inst.full_name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      inst.instructor_id.toLowerCase().includes(idFilter.toLowerCase()) &&
      (courseFilter === '' || inst.course === courseFilter)
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Instructor" onProfilePress={navigateToProfile} />

      {/* Filters */}
      <View style={styles.filterBar}>
        <TextInput
          style={styles.filterChip}
          placeholder="Name"
          value={nameFilter}
          onChangeText={setNameFilter}
        />
        <TextInput
          style={styles.filterChip}
          placeholder="Instructor ID"
          value={idFilter}
          onChangeText={setIdFilter}
        />

        <View style={styles.pickerChip}>
          <Picker
            selectedValue={courseFilter}
            onValueChange={(value) => setCourseFilter(value)}
            style={styles.picker}
          >
            <Picker.Item label="All Course" value="" />
            <Picker.Item label="SITE" value="SITE" />
            <Picker.Item label="SOE" value="SOE" />
            <Picker.Item label="SOHS" value="SOHS" />
            <Picker.Item label="SOC" value="SOC" />
            <Picker.Item label="SBA" value="SBA" />
          </Picker>
        </View>

        {nameFilter || idFilter || courseFilter ? (
          <Text
            style={styles.clearButton}
            onPress={() => {
              setNameFilter('');
              setIdFilter('');
              setCourseFilter('');
            }}
          >
            ✕ Clear
          </Text>
        ) : null}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
        ) : filteredInstructors.length === 0 ? (
          <Text style={styles.noResults}>No instructors found.</Text>
        ) : (
          filteredInstructors.map((inst) => (
            <View key={inst.id} style={styles.card}>
              <Text style={styles.name}>{inst.full_name}</Text>
              <Text style={styles.detail}>Instructor ID: {inst.instructor_id}</Text>
              <Text style={styles.detail}>Course: {inst.course}</Text>
              <Text style={styles.detail}>Email: {inst.email}</Text>
              <Text style={styles.detail}>Phone: {inst.phone}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
    backgroundColor: '#fafafa',
    flexWrap: 'wrap',
    gap: 8, // if not supported, use marginRight manually
  },
  filterChip: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    minWidth: 100,
    marginBottom: 6,
  },
  pickerChip: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    minWidth: 120,
    marginBottom: 6,
  },
  picker: {
    height: 40,
    width: '100%',
  },
  clearButton: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f3f4',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  detail: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  noResults: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginTop: 40,
  },
});
