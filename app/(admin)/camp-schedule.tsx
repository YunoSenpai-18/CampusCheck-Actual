import Header from '@/components/ui/Header';
import { deleteSchedule, fetchSchedules } from '@/services/scheduleApi';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
  department: string;
  email: string;
  phone: string | null;
};

type Checker = {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  role: 'Checker' | 'Admin';
};

type ScheduleItem = {
  id: number;
  subject_code: string;
  subject: string;
  room: string;
  block: string;
  day: string;
  start_time: string;
  end_time: string;
  instructor: Instructor;
  checker?: Checker;
};

function formatTimeRange(start: string, end: string) {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const sDate = new Date();
  sDate.setHours(sh, sm);
  const eDate = new Date();
  eDate.setHours(eh, em);

  const opts: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' };
  return `${sDate.toLocaleTimeString([], opts)} - ${eDate.toLocaleTimeString([], opts)}`;
}

export default function CampScheduleScreen() {
  const router = useRouter();

  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [dayFilter, setDayFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [roomFilter, setRoomFilter] = useState('');
  const [instructorFilter, setInstructorFilter] = useState('');

  const loadSchedules = async () => {
    try {
      const data = await fetchSchedules();
      setScheduleItems(data);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
      setScheduleItems([]);
    } finally {
      setLoading(false);
    }
  };

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
            await loadSchedules();
          } catch (err) {
            Alert.alert('Error', 'Failed to delete schedule.');
          }
        },
      },
    ]);
  };

  // ⬅️ useFocusEffect to reload every time screen is focused
  useFocusEffect(
    useCallback(() => {
      loadSchedules();
    }, [])
  );

  const filteredSchedules = scheduleItems.filter((item) => {
    const timeRange = formatTimeRange(item.start_time, item.end_time);
    return (
      (dayFilter === '' || item.day === dayFilter) &&
      (timeFilter === '' || timeRange === timeFilter) &&
      (roomFilter === '' || item.room.toLowerCase().includes(roomFilter.toLowerCase())) &&
      (instructorFilter === '' || item.instructor?.full_name === instructorFilter)
    );
  });

  const clearFilters = () => {
    setDayFilter('');
    setTimeFilter('');
    setRoomFilter('');
    setInstructorFilter('');
  };

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

  const timeOptions = Array.from(
    new Set(scheduleItems.map((i) => formatTimeRange(i.start_time, i.end_time)))
  ).map((t) => ({ label: t, value: t }));

  const instructorOptions = Array.from(
    new Set(scheduleItems.map((i) => i.instructor?.full_name).filter(Boolean))
  ).map((name) => ({ label: name!, value: name! }));

  useEffect(() => {
    loadSchedules();
    const interval = setInterval(() => {
      loadSchedules();
    }, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Schedule" onProfilePress={() => router.push('/(admin)/profile')} />

      {/* Filters */}
      <View style={styles.filterWrapper}>
        <View style={{ flexDirection: 'column', gap: 10 }}>
          {/* Day Picker */}
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={dayFilter} onValueChange={(value) => setDayFilter(value)}>
              {dayOptions.map((opt) => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
          </View>

          {/* Time Picker */}
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={timeFilter} onValueChange={(value) => setTimeFilter(value)}>
              <Picker.Item label="All Times" value="" />
              {timeOptions.map((opt) => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
          </View>

          {/* Instructor Picker */}
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={instructorFilter}
              onValueChange={(value) => setInstructorFilter(value)}
            >
              <Picker.Item label="All Instructors" value="" />
              {instructorOptions.map((opt) => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
          </View>

          <TextInput
            style={styles.filterChip}
            placeholder="Room"
            value={roomFilter}
            onChangeText={setRoomFilter}
          />

          {dayFilter || timeFilter || roomFilter || instructorFilter ? (
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Clear</Text>
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
            <View key={item.id} style={styles.scheduleItem}>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>
                  {formatTimeRange(item.start_time, item.end_time)}
                </Text>
              </View>
              <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>
                    {item.subject_code} | {item.subject}
                  </Text>
                </View>
                <Text style={styles.itemLocation}>Room: {item.room}</Text>
                <Text style={styles.itemLocation}>Block: {item.block}</Text>
                <Text style={styles.itemLocation}>Day: {item.day}</Text>
                <Text style={styles.itemDescription}>
                  Instructor: {item.instructor?.full_name}
                </Text>
                {item.checker && (
                  <Text style={styles.itemDescription}>
                    Checker: {item.checker?.full_name}
                  </Text>
                )}
              </View>

              {/* Delete button full width */}
              <TouchableOpacity
                style={[styles.actionBtnFull, { backgroundColor: '#FF3B30' }]}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
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

  // Card styles
  scheduleItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f3f4',
    flexWrap: 'wrap',
  },
  timeContainer: { marginRight: 16, alignItems: 'center', width: 90 },
  timeText: { fontSize: 14, fontWeight: '600', color: '#007AFF', textAlign: 'center' },
  itemContent: { flex: 1, marginBottom: 12 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  itemTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  itemLocation: { fontSize: 14, color: '#666666', marginBottom: 2 },
  itemDescription: { fontSize: 13, color: '#888888', marginTop: 4 },
  itemChecker: { fontSize: 12, color: '#aaa', marginTop: 2 },

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

  actionBtnFull: {
    width: '100%',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  actionText: { color: '#fff', fontWeight: '600' },
});
