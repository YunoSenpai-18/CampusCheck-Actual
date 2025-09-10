import Header from '@/components/ui/Header';
import { deleteSchedule, fetchSchedules } from '@/services/scheduleApi';
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

type ScheduleItem = {
  id: number;
  subject_code: string;
  subject: string;
  room: string;
  block: string;
  day: string;
  time: string;
  instructor: {
    id: number;
    full_name: string;
    department: string;
    email: string;
    phone: string;
  };
  checker: {
    id: number;
    full_name: string;
    email: string;
    phone: string | null;
    role: 'Checker' | 'Admin';
  };
};

export default function CampScheduleScreen() {
  const router = useRouter();

  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [dayFilter, setDayFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [roomFilter, setRoomFilter] = useState('');
  const [blockFilter, setBlockFilter] = useState('');
  const [instructorFilter, setInstructorFilter] = useState('');

  // dropdown state
  const [openDay, setOpenDay] = useState(false);
  const [openTime, setOpenTime] = useState(false);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const data = await fetchSchedules();
      setScheduleItems(data);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
      setScheduleItems([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSchedules();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSchedules();
    setRefreshing(false);
  };

  const handleDelete = async (id: number) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this schedule?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteSchedule(id);
            loadSchedules();
          } catch (err) {
            Alert.alert('Error', 'Failed to delete schedule.');
          }
        },
      },
    ]);
  };

  const filteredSchedules = scheduleItems.filter((item) => {
    return (
      (dayFilter === '' || item.day === dayFilter) &&
      (timeFilter === '' || item.time === timeFilter) &&
      (roomFilter === '' || item.room.toLowerCase().includes(roomFilter.toLowerCase())) &&
      (blockFilter === '' || item.block.toLowerCase().includes(blockFilter.toLowerCase())) &&
      (instructorFilter === '' ||
        item.instructor?.full_name.toLowerCase().includes(instructorFilter.toLowerCase()))
    );
  });

  const clearFilters = () => {
    setDayFilter('');
    setTimeFilter('');
    setRoomFilter('');
    setBlockFilter('');
    setInstructorFilter('');
  };

  // dropdown options
  const dayOptions = [
    { label: 'All Days', value: '' },
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ].map((d) => (typeof d === 'string' ? { label: d, value: d } : d));

  const timeOptions = Array.from(new Set(scheduleItems.map((i) => i.time))).map((t) => ({
    label: t,
    value: t,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Schedule" onProfilePress={() => router.push('/(admin)/profile')} />

      {/* Filters */}
      <View style={styles.filterWrapper}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <View style={{ flex: 1, zIndex: 3000 }}>
            <DropDownPicker
              open={openDay}
              value={dayFilter}
              items={dayOptions}
              setOpen={setOpenDay}
              setValue={(cb) => setDayFilter(cb(dayFilter))}
              placeholder="Select Day"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownMenu}
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>

          <View style={{ flex: 1, zIndex: 2000 }}>
            <DropDownPicker
              open={openTime}
              value={timeFilter}
              items={[{ label: 'All Times', value: '' }, ...timeOptions]}
              setOpen={setOpenTime}
              setValue={(cb) => setTimeFilter(cb(timeFilter))}
              placeholder="Select Time"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownMenu}
              zIndex={2000}
              zIndexInverse={2000}
            />
          </View>

          <TextInput
            style={styles.filterChip}
            placeholder="Room"
            value={roomFilter}
            onChangeText={setRoomFilter}
          />

          <TextInput
            style={styles.filterChip}
            placeholder="Block"
            value={blockFilter}
            onChangeText={setBlockFilter}
          />

          <TextInput
            style={styles.filterChip}
            placeholder="Instructor"
            value={instructorFilter}
            onChangeText={setInstructorFilter}
          />

          {dayFilter || timeFilter || roomFilter || blockFilter || instructorFilter ? (
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>✕ Clear</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Schedule List */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
        ) : filteredSchedules.length === 0 ? (
          <Text style={styles.noResults}>No Record Found</Text>
        ) : (
          filteredSchedules.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.name}>
                {item.subject_code} | {item.subject}
              </Text>
              <Text style={styles.detail}>Day: {item.day}</Text>
              <Text style={styles.detail}>Time: {item.time}</Text>
              <Text style={styles.detail}>Room: {item.room}</Text>
              <Text style={styles.detail}>Block: {item.block}</Text>
              <Text style={styles.detail}>Instructor: {item.instructor?.full_name}</Text>
              <Text style={styles.detail}>Checker: {item.checker?.full_name}</Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: '#FF3B30' }]}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/create-schedules')}>
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
