import Header from '@/components/ui/Header';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

type AttendanceRecord = {
  time: string;
  subject: string;
  room: string;
  block: string;
  date: string;
  status: 'Present' | 'Absent';
  instructor: string;
};

export default function AttendanceRecordScreen() {
  const router = useRouter();
  const [day, setDay] = useState('');
  const [date, setDate] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const navigateToProfile = () => {
    router.push('/(checker)/profile');
  };

  // Simulated API call (replace with your DB fetch later)
  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      // This is where your API or database call will go
      // Example: const response = await fetch("https://your-api/attendance");
      // const data = await response.json();
      const data: AttendanceRecord[] = [
        {
          time: '8:00AM - 12:00PM',
          subject: 'ITP17 | Advanced Programming',
          room: 'V209',
          block: '33-ITE-01',
          date: 'August 4, 2025',
          status: 'Present',
          instructor: 'Jelson V. Lanto',
        },
        {
          time: '8:00AM - 12:00PM',
          subject: 'ITP16 | Information Assurance and Security',
          room: 'V401',
          block: '33-ITE-02',
          date: 'August 4, 2025',
          status: 'Absent',
          instructor: 'Yuri Rancudo',
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
    const now = new Date();
    setDay(now.toLocaleDateString(undefined, { weekday: 'long' }));
    setDate(
      now.toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    );
    fetchAttendanceRecords();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Attendance Record" onProfilePress={navigateToProfile} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>Today</Text>
          <Text style={styles.dateSubtext}>
            {day}, {date}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
        ) : (
          attendanceRecords.map((record, index) => (
            <View key={index} style={styles.recordItem}>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{record.time}</Text>
                <Text
                  style={[
                    styles.statusText,
                    record.status === 'Present'
                      ? styles.statusPresent
                      : styles.statusAbsent,
                  ]}
                >
                  {record.status}
                </Text>
              </View>
              <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{record.subject}</Text>
                </View>
                <Text style={styles.itemLocation}>Room: {record.room}</Text>
                <Text style={styles.itemLocation}>Block: {record.block}</Text>
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
  dateContainer: { alignItems: 'center', marginBottom: 24 },
  dateText: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 4 },
  dateSubtext: { fontSize: 16, color: '#333333' },
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
  timeText: { fontSize: 14, fontWeight: '600', color: '#007AFF', textAlign: 'center', marginBottom: 6 },
  statusText: { fontSize: 12, fontWeight: '600', textAlign: 'center', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4 },
  statusPresent: { backgroundColor: '#e0f8e9', color: '#2e7d32' },
  statusAbsent: { backgroundColor: '#fdecea', color: '#c62828' },
  itemContent: { flex: 1 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  itemTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  itemLocation: { fontSize: 14, color: '#666666', marginBottom: 2 },
  itemDescription: { fontSize: 13, color: '#888888', marginTop: 4 },
});