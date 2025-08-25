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

// 🔹 Matches your backend Schedule schema
type ScheduleItem = {
  id: number;
  subject_code: string;
  subject: string;
  room: string;
  block: string;
  day: string;
  time: string;
  instructor_name: string;
};

export default function CampScheduleScreen() {
  const router = useRouter();

  const navigateToProfile = () => {
    router.push('/(admin)/profile');
  };

  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [dayFilter, setDayFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [roomFilter, setRoomFilter] = useState('');
  const [blockFilter, setBlockFilter] = useState('');
  const [instructorFilter, setInstructorFilter] = useState('');

  // 🔹 Simulated API call (replace with Laravel API later)
  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const data: ScheduleItem[] = [
        {
          id: 1,
          subject_code: 'ITP17',
          subject: 'Advanced Programming',
          room: 'V209',
          block: '33-ITE-01',
          day: 'Monday',
          time: '8:00AM - 12:00PM',
          instructor_name: 'Jelson V. Lanto',
        },
        {
          id: 2,
          subject_code: 'ITP16',
          subject: 'Information Assurance and Security',
          room: 'V401',
          block: '33-ITE-02',
          day: 'Monday',
          time: '8:00AM - 12:00PM',
          instructor_name: 'Yuri Rancudo',
        },
        {
          id: 3,
          subject_code: 'ITP18',
          subject: 'Database Systems',
          room: 'V303',
          block: '33-ITE-03',
          day: 'Tuesday',
          time: '1:00PM - 5:00PM',
          instructor_name: 'Alice Santos',
        },
      ];

      setScheduleItems(data);
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  // Generate unique values for filters
  const uniqueTimes = Array.from(new Set(scheduleItems.map((i) => i.time)));
  const uniqueRooms = Array.from(new Set(scheduleItems.map((i) => i.room)));
  const uniqueBlocks = Array.from(new Set(scheduleItems.map((i) => i.block)));
  const uniqueInstructors = Array.from(
    new Set(scheduleItems.map((i) => i.instructor_name))
  );

  // Show **all weekdays** for Day filter
  const allDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  // Apply filters
  const filteredSchedule = scheduleItems.filter((item) => {
    return (
      (dayFilter === '' || item.day === dayFilter) &&
      (timeFilter === '' || item.time === timeFilter) &&
      (roomFilter === '' || item.room.toLowerCase().includes(roomFilter.toLowerCase())) &&
      (blockFilter === '' || item.block.toLowerCase().includes(blockFilter.toLowerCase())) &&
      (instructorFilter === '' ||
        item.instructor_name.toLowerCase().includes(instructorFilter.toLowerCase()))
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Schedule" onProfilePress={navigateToProfile} />

      {/* Filters */}
      <View style={styles.filterBar}>
        {/* Day */}
        <View style={styles.pickerChip}>
          <Picker
            selectedValue={dayFilter}
            onValueChange={(value) => setDayFilter(value)}
            style={styles.picker}
          >
            <Picker.Item label="All Days" value="" />
            {allDays.map((day) => (
              <Picker.Item key={day} label={day} value={day} />
            ))}
          </Picker>
        </View>

        {/* Time */}
        <View style={styles.pickerChip}>
          <Picker
            selectedValue={timeFilter}
            onValueChange={(value) => setTimeFilter(value)}
            style={styles.picker}
          >
            <Picker.Item label="All Times" value="" />
            {uniqueTimes.map((time) => (
              <Picker.Item key={time} label={time} value={time} />
            ))}
          </Picker>
        </View>

        {/* Room (search input) */}
        <TextInput
          style={styles.filterChip}
          placeholder="Room"
          value={roomFilter}
          onChangeText={setRoomFilter}
        />

        {/* Block (search input) */}
        <TextInput
          style={styles.filterChip}
          placeholder="Block"
          value={blockFilter}
          onChangeText={setBlockFilter}
        />

        {/* Instructor (search input) */}
        <TextInput
          style={styles.filterChip}
          placeholder="Instructor"
          value={instructorFilter}
          onChangeText={setInstructorFilter}
        />

        {dayFilter || timeFilter || roomFilter || blockFilter || instructorFilter ? (
          <Text
            style={styles.clearButton}
            onPress={() => {
              setDayFilter('');
              setTimeFilter('');
              setRoomFilter('');
              setBlockFilter('');
              setInstructorFilter('');
            }}
          >
            ✕ Clear
          </Text>
        ) : null}
      </View>

      {/* Schedule List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
        ) : filteredSchedule.length === 0 ? (
          <Text style={styles.noResults}>No schedules found.</Text>
        ) : (
          filteredSchedule.map((item) => (
            <View key={item.id} style={styles.scheduleItem}>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>
                  {item.subject_code} | {item.subject}
                </Text>
                <Text style={styles.itemLocation}>Room: {item.room}</Text>
                <Text style={styles.itemLocation}>Block: {item.block}</Text>
                <Text style={styles.itemLocation}>Day: {item.day}</Text>
                <Text style={styles.itemDescription}>
                  Instructor: {item.instructor_name}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { flex: 1, padding: 20, backgroundColor: '#ffffff' },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
    backgroundColor: '#fafafa',
    flexWrap: 'wrap',
    gap: 8,
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
  picker: { height: 40, width: '100%' },
  clearButton: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  scheduleItem: {
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
  },
  timeContainer: { marginRight: 16, alignItems: 'center', width: 90 },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
  },
  itemContent: { flex: 1 },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  itemLocation: { fontSize: 14, color: '#666666', marginBottom: 2 },
  itemDescription: { fontSize: 13, color: '#888888', marginTop: 2 },
  noResults: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginTop: 40,
  },
});
