import Header from '@/components/ui/Header';
import { deleteUser, fetchUsers } from '@/services/userApi';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

type User = {
  id: number;
  full_name: string;
  school_id: string;
  email: string;
  phone?: string | null;
  photo?: string | null;
  photo_url?: string | null; // ✅ match instructors
  role: 'Checker' | 'Admin';
};

export default function UsersScreen() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [nameFilter, setNameFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const roleOptions = [
    { label: 'All Roles', value: '' },
    { label: 'Checker', value: 'Checker' },
    { label: 'Admin', value: 'Admin' },
  ];

  const loadUsers = async () => {
    try {
      const data = await fetchUsers(); // ✅ same as instructors
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const res = await fetch('https://testingapi.loca.lt/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentUser({
          id: data.school_id, // 👈 this matches ProfileScreen
          name: data.full_name,
          role: data.role,
          email: data.email,
        });
      }
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    await fetchCurrentUser();
    setRefreshing(false);
  };

  const handleDelete = async (id: number) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this user?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteUser(id); // ✅ same as instructors
            loadUsers();
          } catch (err) {
            Alert.alert('Error', 'Failed to delete user.');
          }
        },
      },
    ]);
  };

  const filteredUsers = users.filter((u) => {
    return (
      u.full_name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      (roleFilter === '' || u.role === roleFilter)
    );
  });

  const clearFilters = () => {
    setNameFilter('');
    setRoleFilter('');
  };

  useEffect(() => {
    loadUsers();
    fetchCurrentUser();

    const interval = setInterval(() => {
      loadUsers();
    }, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUsers();
      fetchCurrentUser();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Users" onProfilePress={() => router.push('/(admin)/profile')} />

      {/* Filters */}
      <View style={styles.filterWrapper}>
        <View style={{ flexDirection: 'column', gap: 10 }}>
          {/* Role filter */}
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={roleFilter} onValueChange={(val) => setRoleFilter(val)}>
              {roleOptions.map((opt) => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
          </View>

          {/* Name filter */}
          <TextInput
            style={styles.filterChip}
            placeholder="Search by name"
            value={nameFilter}
            onChangeText={setNameFilter}
          />

          {(nameFilter || roleFilter) && (
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* List */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
        ) : filteredUsers.length === 0 ? (
          <Text style={styles.noResults}>No Record Found</Text>
        ) : (
          filteredUsers.map((user) => (
            <View key={user.id} style={styles.card}>
              {/* Left: photo */}
              {user.photo_url ? (
                <Image source={{ uri: user.photo_url }} style={styles.photo} />
              ) : (
                <Image
                  source={{ uri: 'https://via.placeholder.com/70x70.png?text=User' }}
                  style={styles.photo}
                />
              )}

              {/* Right: info */}
              <View style={{ flex: 1, marginLeft: user.photo ? 12 : 0 }}>
                <Text style={styles.name}>{user.full_name}</Text>
                <Text style={styles.detail}>School ID: {user.school_id}</Text>
                <Text style={styles.detail}>Email: {user.email}</Text>
                <Text style={styles.detail}>Phone: {user.phone || '-'}</Text>
                <Text style={styles.detail}>Role: {user.role}</Text>

                {/* Delete Button */}
                <View style={styles.actions}>
                  {(!currentUser || currentUser.id !== user.school_id) && (
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: '#FF3B30' }]}
                      onPress={() => handleDelete(user.id)}
                    >
                      <Text style={styles.actionText}>Delete</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Floating + button */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/create-users')}>
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
    flexDirection: 'row',
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
