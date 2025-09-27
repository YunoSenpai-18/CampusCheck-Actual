import Header from '@/components/ui/Header';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type User = {
  id: number;
  full_name: string;
  school_id: string;
  email: string;
  phone?: string;
  role: 'Checker' | 'Admin';
  photo?: string | null; // ✅ optional photo field
};

export default function UsersScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/login');
        return;
      }

      const res = await axios.get('https://testingapi.loca.lt/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this user?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
              router.replace('/login');
              return;
            }
            await axios.delete(`https://testingapi.loca.lt/api/users/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            fetchUsers();
          } catch (err) {
            Alert.alert('Error', 'Failed to delete user.');
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Users" onProfilePress={() => router.push('/(admin)/profile')} />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
        ) : users.length === 0 ? (
          <Text style={styles.noResults}>No Record Found</Text>
        ) : (
          users.map((user) => (
            <View key={user.id} style={styles.card}>
              {/* Left: photo if available */}
              {user.photo ? (
                <Image source={{ uri: user.photo }} style={styles.photo} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="person" size={32} color="#999" />
                </View>
              )}

              {/* Right: user info */}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.name}>{user.full_name}</Text>
                <Text style={styles.detail}>School ID: {user.school_id}</Text>
                <Text style={styles.detail}>Email: {user.email}</Text>
                <Text style={styles.detail}>Phone: {user.phone || '—'}</Text>
                <Text style={styles.detail}>Role: {user.role}</Text>

                {/* Delete button */}
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#FF3B30' }]}
                    onPress={() => handleDelete(user.id)}
                  >
                    <Text style={styles.actionText}>Delete</Text>
                  </TouchableOpacity>
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
  photo: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#eee' },
  photoPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center',
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
  actionBtn: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center' },
  actionText: { color: '#fff', fontWeight: '600' },
});
