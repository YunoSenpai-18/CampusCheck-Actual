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

type AttendanceRecord = {
  time: string;
  subject: string;
  room: string;
  block: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
  instructor: string;
  day: string;
};

export default function AttendanceRecordScreen() {
  const router = useRouter();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [roomFilter, setRoomFilter] = useState('');
  const [blockFilter, setBlockFilter] = useState('');
  const [instructorFilter, setInstructorFilter] = useState('');
  const [dayFilter, setDayFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const navigateToProfile = () => {
    router.push('/(admin)/profile');
  };

  // Simulated API call
  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      const data: AttendanceRecord[] = [
        {
          time: '8:00AM - 12:00PM',
          subject: 'ITP17 | Advanced Programming',
          room: 'V209',
          block: '33-ITE-01',
          date: 'August 4, 2025',
          status: 'Present',
          instructor: 'Jelson V. Lanto',
          day: 'Monday',
        },
        {
          time: '8:00AM - 12:00PM',
          subject: 'ITP16 | Information Assurance and Security',
          room: 'V401',
          block: '33-ITE-02',
          date: 'August 4, 2025',
          status: 'Absent',
          instructor: 'Yuri Rancudo',
          day: 'Tuesday',
        },
      ];
      setAttendanceRecords(data);
    } catch (error) {
      console.error('Failed to fetch attendance records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  // Apply filters
  const filteredRecords = attendanceRecords.filter((record) => {
    return (
      (roomFilter === '' || record.room.toLowerCase().includes(roomFilter.toLowerCase())) &&
      (blockFilter === '' || record.block.toLowerCase().includes(blockFilter.toLowerCase())) &&
      (instructorFilter === '' ||
        record.instructor.toLowerCase().includes(instructorFilter.toLowerCase())) &&
      (dayFilter === '' || record.day === dayFilter) &&
      (statusFilter === '' || record.status === statusFilter) &&
      (dateFilter === '' || record.date.toLowerCase().includes(dateFilter.toLowerCase()))
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Attendance Record" onProfilePress={navigateToProfile} />

      {/* Filter Bar */}
      <View style={styles.filterBar}>
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
        <TextInput
          style={styles.filterChip}
          placeholder="Date"
          value={dateFilter}
          onChangeText={setDateFilter}
        />

        <View style={styles.pickerChip}>
          <Picker selectedValue={dayFilter} onValueChange={setDayFilter} style={styles.picker}>
            <Picker.Item label="All Day" value="" />
            <Picker.Item label="Monday" value="Monday" />
            <Picker.Item label="Tuesday" value="Tuesday" />
            <Picker.Item label="Wednesday" value="Wednesday" />
            <Picker.Item label="Thursday" value="Thursday" />
            <Picker.Item label="Friday" value="Friday" />
            <Picker.Item label="Saturday" value="Saturday" />
          </Picker>
        </View>

        <View style={styles.pickerChip}>
          <Picker selectedValue={statusFilter} onValueChange={setStatusFilter} style={styles.picker}>
            <Picker.Item label="All Status" value="" />
            <Picker.Item label="Present" value="Present" />
            <Picker.Item label="Absent" value="Absent" />
            <Picker.Item label="Late" value="Late" />
          </Picker>
        </View>

        {(roomFilter || blockFilter || instructorFilter || dateFilter || dayFilter || statusFilter) && (
          <Text
            style={styles.clearButton}
            onPress={() => {
              setRoomFilter('');
              setBlockFilter('');
              setInstructorFilter('');
              setDateFilter('');
              setDayFilter('');
              setStatusFilter('');
            }}
          >
            ✕ Clear
          </Text>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
        ) : filteredRecords.length === 0 ? (
          <Text style={styles.noResults}>No attendance records found.</Text>
        ) : (
          filteredRecords.map((record, index) => (
            <View key={index} style={styles.recordItem}>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{record.time}</Text>
                <Text
                  style={[
                    styles.statusText,
                    record.status === 'Present' ? styles.statusPresent : styles.statusAbsent,
                  ]}
                >
                  {record.status}
                </Text>
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{record.subject}</Text>
                <Text style={styles.itemLocation}>Room: {record.room}</Text>
                <Text style={styles.itemLocation}>Block: {record.block}</Text>
                <Text style={styles.itemLocation}>Day: {record.day}</Text>
                <Text style={styles.itemLocation}>Date: {record.date}</Text>
                <Text style={styles.itemDescription}>Instructor: {record.instructor}</Text>
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
    flexWrap: 'wrap',
    gap: 8,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
    backgroundColor: '#fafafa',
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
    minWidth: 100,
    marginBottom: 6,
  },
  pickerChip: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    backgroundColor: '#fff',
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
  noResults: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginTop: 40,
  },
  recordItem: {
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
  },
  timeContainer: { marginRight: 16, alignItems: 'center', width: 90 },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  statusPresent: { backgroundColor: '#e0f8e9', color: '#2e7d32' },
  statusAbsent: { backgroundColor: '#fdecea', color: '#c62828' },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 4 },
  itemLocation: { fontSize: 14, color: '#666666', marginBottom: 2 },
  itemDescription: { fontSize: 13, color: '#888888', marginTop: 4 },
});
