import Header from '@/components/ui/Header';
import { deleteInstructor, fetchInstructors } from '@/services/instructorApi';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Instructor = {
  id: number;
  full_name: string;
  instructor_id: string;
  department: string;
  email: string;
  phone: string;
  photo_url?: string | null; // ✅ added for photo support
};

export default function InstructorScreen() {
  const router = useRouter();

  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [nameFilter, setNameFilter] = useState('');
  const [idFilter, setIdFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const departmentOptions = [
    { label: 'All departments', value: '' },
    { label: 'SITE', value: 'SITE' },
    { label: 'SOE', value: 'SOE' },
    { label: 'SOHS', value: 'SOHS' },
    { label: 'SOC', value: 'SOC' },
    { label: 'SBA', value: 'SBA' },
    { label: 'SIHM', value: 'SIHM' },
  ];

  const loadInstructors = async () => {
    try {
      const data = await fetchInstructors();
      setInstructors(data);
    } catch (error) {
      console.error('Failed to fetch instructors:', error);
      setInstructors([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInstructors();
    setRefreshing(false);
  };

  const handleDelete = async (id: number) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this instructor?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteInstructor(id);
            loadInstructors();
          } catch (err) {
            Alert.alert('Error', 'Failed to delete instructor.');
          }
        },
      },
    ]);
  };

  const filteredInstructors = instructors.filter((inst) => {
    return (
      inst.full_name?.toLowerCase().includes(nameFilter.toLowerCase()) &&
      inst.instructor_id?.toLowerCase().includes(idFilter.toLowerCase()) &&
      (departmentFilter === '' || inst.department === departmentFilter)
    );
  });

  const clearFilters = () => {
    setNameFilter('');
    setIdFilter('');
    setDepartmentFilter('');
  };

  useEffect(() => {
    loadInstructors();
    const interval = setInterval(() => {
      loadInstructors();
    }, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useFocusEffect( 
    useCallback(() => {
      loadInstructors();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Instructor" onProfilePress={() => router.push('/(admin)/profile')} />

      {/* Filters */}
      <View style={styles.filterWrapper}>
        <View style={{ flexDirection: 'column', gap: 10 }}>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={departmentFilter}
              onValueChange={(value) => setDepartmentFilter(value)}
            >
              {departmentOptions.map((opt) => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
          </View>

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

          {nameFilter || idFilter || departmentFilter ? (
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
        ) : filteredInstructors.length === 0 ? (
          <Text style={styles.noResults}>No Record Found</Text>
        ) : (
          filteredInstructors.map((inst) => (
            <View key={inst.id} style={styles.card}>
              {/* Left: photo (only if available) */}
              {inst.photo_url ? (
                <Image
                  source={{ uri: inst.photo_url }}
                  style={styles.photo}
                />
              ) : null}

              {/* Right: info */}
              <View style={{ flex: 1, marginLeft: inst.photo_url ? 12 : 0 }}>
                <Text style={styles.name}>{inst.full_name}</Text>
                <Text style={styles.detail}>Instructor ID: {inst.instructor_id}</Text>
                <Text style={styles.detail}>Department: {inst.department}</Text>
                <Text style={styles.detail}>Email: {inst.email}</Text>
                <Text style={styles.detail}>Phone: {inst.phone}</Text>

                {/* Delete Button */}
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#FF3B30' }]}
                    onPress={() => handleDelete(inst.id)}
                  >
                    <Text style={styles.actionText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/create-instructors')}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { flex: 1, padding: 20, backgroundColor: '#ffffff' },
  filterWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
    backgroundColor: '#fafafa',
    paddingVertical: 10,
    paddingHorizontal: 12,
    zIndex: 1000,
  },
  filterChip: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    minWidth: 120,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  clearButton: {
    backgroundColor: '#f1f3f4',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  clearButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 15,
  },
  card: {
    flexDirection: 'row', // ✅ side by side layout
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
    alignItems: 'center',
  },
  photo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#eee',
  },
  name: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 6 },
  detail: { fontSize: 14, color: '#666666', marginBottom: 2 },
  noResults: { fontSize: 14, color: '#888888', textAlign: 'center', marginTop: 40 },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  actions: { flexDirection: 'row', marginTop: 10, gap: 8 },
  actionBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionText: { color: '#fff', fontWeight: '600' },
});
