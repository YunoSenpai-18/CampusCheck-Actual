import Header from '@/components/ui/Header';
import { deleteInstructor, fetchInstructors } from '@/services/instructorApi';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

type Instructor = {
  id: number;
  full_name: string;
  instructor_id: string;
  department: string;
  email: string;
  phone: string;
};

export default function InstructorScreen() {
  const router = useRouter();

  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [nameFilter, setNameFilter] = useState('');
  const [idFilter, setIdFilter] = useState('');
  const [departmentFilter, setdepartmentFilter] = useState('');

  // dropdown state
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'All departments', value: '' },
    { label: 'SITE', value: 'SITE' },
    { label: 'SOE', value: 'SOE' },
    { label: 'SOHS', value: 'SOHS' },
    { label: 'SOC', value: 'SOC' },
    { label: 'SBA', value: 'SBA' },
    { label: 'SIHM', value: 'SIHM' },
  ]);

  const loadInstructors = async () => {
    try {
      setLoading(true);
      const data = await fetchInstructors();
      setInstructors(data);
    } catch (error) {
      console.error('Failed to fetch instructors:', error);
      setInstructors([]);
    } finally {
      setLoading(false);
    }
  };

  // refresh on focus
  useFocusEffect(
    useCallback(() => {
      loadInstructors();
    }, [])
  );

  // pull-to-refresh
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
            loadInstructors(); // refresh list
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
    setdepartmentFilter('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Instructor" onProfilePress={() => router.push('/(admin)/profile')} />

      {/* Filters */}
      <View style={styles.filterWrapper}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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

          <View style={{ flex: 1, zIndex: 3000 }}>
            <DropDownPicker
              open={open}
              value={departmentFilter}
              items={items}
              setOpen={setOpen}
              setValue={(callback) => {
                const value = callback(departmentFilter);
                setdepartmentFilter(value);
              }}
              setItems={setItems}
              placeholder="Select department"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownMenu}
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>

          {nameFilter || idFilter || departmentFilter ? (
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>✕ Clear</Text>
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
              <Text style={styles.name}>{inst.full_name}</Text>
              <Text style={styles.detail}>Instructor ID: {inst.instructor_id}</Text>
              <Text style={styles.detail}>department: {inst.department}</Text>
              <Text style={styles.detail}>Email: {inst.email}</Text>
              <Text style={styles.detail}>Phone: {inst.phone}</Text>

              {/* Delete Button Only */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: '#FF3B30' }]}
                  onPress={() => handleDelete(inst.id)}
                >
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Floating Create Button */}
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
  dropdown: { borderRadius: 20, borderColor: '#e0e0e0', minHeight: 40 },
  dropdownMenu: { borderRadius: 12, borderColor: '#e0e0e0' },
  clearButton: {
    backgroundColor: '#f1f3f4',
    borderRadius: 20,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  clearButtonText: { color: '#007AFF', fontWeight: '500', fontSize: 14 },
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
  name: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 6 },
  detail: { fontSize: 14, color: '#666666', marginBottom: 2 },
  noResults: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginTop: 40,
  },
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
