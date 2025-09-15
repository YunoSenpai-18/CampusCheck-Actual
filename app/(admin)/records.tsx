import Header from '@/components/ui/Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

type AttendanceRecord = {
  time: string;
  subject: string;
  room: string;
  block: string;
  date: string;
  status: 'Present' | 'Late';
  instructor: string;
  checker: string;
};

export default function AttendanceRecordScreen() {
  const router = useRouter();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [roomFilter, setRoomFilter] = useState('');
  const [blockFilter, setBlockFilter] = useState('');
  const [instructorFilter, setInstructorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Dropdown state
  const [openStatus, setOpenStatus] = useState(false);

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
          checker: 'Laurence P. Dingle',
        },
        {
          time: '8:00AM - 12:00PM',
          subject: 'ITP16 | Information Assurance and Security',
          room: 'V401',
          block: '33-ITE-02',
          date: 'August 4, 2025',
          status: 'Late',
          instructor: 'Yuri Rancudo',
          checker: 'Laurence P. Dingle',
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
      (statusFilter === '' || record.status === statusFilter) &&
      (dateFilter === '' || record.date.toLowerCase().includes(dateFilter.toLowerCase()))
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Attendance Record" onProfilePress={navigateToProfile} />

      {/* Filters */}
      <View style={styles.filterWrapper}>
        <View style={{ flexDirection: 'column', gap: 10 }}>
          {/* Status Dropdown */}
          <View style={{ zIndex: 2000 }}>
            <DropDownPicker
              open={openStatus}
              value={statusFilter}
              items={[
                { label: 'All Status', value: '' },
                { label: 'Present', value: 'Present' },
                { label: 'Late', value: 'Late' },
              ]}
              setOpen={setOpenStatus}
              setValue={(cb) => setStatusFilter(cb(statusFilter))}
              placeholder="Select Status"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownMenu}
              zIndex={2000}
              zIndexInverse={2000}
            />
          </View>

          {/* Date */}
          <TouchableOpacity
            style={styles.filterChip}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: dateFilter ? '#000' : '#888' }}>
              {dateFilter || 'Select Date'}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dateFilter ? new Date(dateFilter) : new Date()}
              mode="date"
              display="calendar"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  const formatted = selectedDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  });
                  setDateFilter(formatted);
                }
              }}
            />
          )}

          {/* Room */}
          <TextInput
            style={styles.filterChip}
            placeholder="Room"
            value={roomFilter}
            onChangeText={setRoomFilter}
          />

          {/* Block */}
          <TextInput
            style={styles.filterChip}
            placeholder="Block"
            value={blockFilter}
            onChangeText={setBlockFilter}
          />

          {/* Instructor */}
          <TextInput
            style={styles.filterChip}
            placeholder="Instructor"
            value={instructorFilter}
            onChangeText={setInstructorFilter}
          />
          
          {/* Clear Button */}
          {(roomFilter || blockFilter || instructorFilter || dateFilter || statusFilter) && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setRoomFilter('');
                setBlockFilter('');
                setInstructorFilter('');
                setDateFilter('');
                setStatusFilter('');
              }}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
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
                <Text style={styles.itemLocation}>Date: {record.date}</Text>
                <Text style={styles.itemDescription}>Instructor: {record.instructor}</Text>
                <Text style={styles.itemDescription}>Checker: {record.checker}</Text>
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
