import Header from '@/components/ui/Header';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function DashboardScreen() {
  const router = useRouter();

  // Time & Date
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  // Data from database (replace with API fetch later)
  const [attendanceCount, setAttendanceCount] = useState<number>(0);
  const [attendanceRecords, setAttendanceRecords] = useState<{ name: string; status: string }[]>([]);
  const [scheduleList, setScheduleList] = useState<
    { time: string; subject: string; room: string; block: string; day: string; instructor: string }[]
  >([]);

  const navigateToSchedule = () => router.push('/(checker)/schedule');
  const navigateToProfile = () => router.push('/(checker)/profile');

  // Update clock every minute
  useEffect(() => {
    const updateTimeAndDate = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
      setDate(
        now.toLocaleDateString(undefined, {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      );
    };
    updateTimeAndDate();
    const interval = setInterval(updateTimeAndDate, 60000);
    return () => clearInterval(interval);
  }, []);

  // Simulate fetching data from API/DB
  useEffect(() => {
    // Replace with actual API call later
    const fetchDashboardData = async () => {
      // Example static data for now
      setAttendanceCount(7);
      setAttendanceRecords([
        { name: 'Jelson V. Lanto', status: 'Present' },
        { name: 'Yuri Rancudo', status: 'Present' },
      ]);
      setScheduleList([
        {
          time: '8:00AM - 12:00PM',
          subject: 'ITP17 | Advanced Programming',
          room: 'V209',
          block: '33-ITE-01',
          day: 'Monday',
          instructor: 'Jelson V. Lanto',
        },
        {
          time: '8:00AM - 12:00PM',
          subject: 'ITP16 | Information Assurance and Security',
          room: 'V401',
          block: '33-ITE-02',
          day: 'Monday',
          instructor: 'Yuri Rancudo',
        },
      ]);
    };

    fetchDashboardData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Dashboard" onProfilePress={navigateToProfile} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Time & Date */}
        <View style={styles.headerSection}>
          <Text style={styles.timeText}>{time}</Text>
          <Text style={styles.dateText}>{date}</Text>
        </View>

        {/* Attendance Gathered */}
        <View style={styles.attendanceCard}>
          <Text style={styles.sectionTitle}>Attendance Gathered</Text>
          <View style={styles.attendanceInfo}>
            <FontAwesome5
              name="clipboard-list"
              size={64}
              color="#1C2B39"
              style={{ marginRight: 16 }}
            />
            <Text style={styles.attendanceCount}>{attendanceCount}</Text>
          </View>
        </View>

        {/* Attendance Record */}
        <View style={styles.sectionCard}>
          <TouchableOpacity onPress={() => router.push('/attendance-record')}>
            <Text style={styles.sectionTitleBlue}>Attendance Record ➤</Text>
          </TouchableOpacity>
          <View style={styles.recordList}>
            {attendanceRecords.slice(0, 4).map((record, index) => (
              <View key={index} style={styles.recordRow}>
                <Text style={styles.recordName}>{record.name}</Text>
                <Text style={styles.presentLabel}>{record.status}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Schedule */}
        <View style={styles.sectionCard}>
          <TouchableOpacity onPress={navigateToSchedule}>
            <Text style={styles.sectionTitleBlue}>Schedule ➤</Text>
          </TouchableOpacity>
          <View style={styles.scheduleRow}>
            {scheduleList.map((sched, index) => (
              <View key={index} style={styles.scheduleBox}>
                <Text style={styles.timeTextSchedule}>{sched.time}</Text>
                <Text style={styles.subjectCode}>{sched.subject}</Text>
                <Text style={styles.room}>Room: {sched.room}</Text>
                <Text style={styles.block}>Block: {sched.block}</Text>
                <Text style={styles.room}>Day: {sched.day}</Text>
                <Text style={styles.instructor}>Instructor: {sched.instructor}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { padding: 16 },
  headerSection: { alignItems: 'center', marginBottom: 24 },
  timeText: { fontSize: 36, fontWeight: '600', color: '#000000' },
  dateText: { fontSize: 16, color: '#000000' },
  attendanceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#1C2B39' },
  attendanceInfo: { flexDirection: 'row', alignItems: 'center' },
  attendanceCount: { fontSize: 48, fontWeight: '700', color: '#1C2B39' },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitleBlue: { fontSize: 18, fontWeight: '600', color: '#2196F3', marginBottom: 12 },
  recordList: { gap: 10 },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#e1e1e1',
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  recordName: { fontSize: 14, fontWeight: '500', color: '#1a1a1a' },
  presentLabel: { fontSize: 14, color: '#4CAF50', fontWeight: '500' },
  scheduleRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  scheduleBox: {
    backgroundColor: '#AEE1FF',
    width: '48%',
    padding: 12,
    borderRadius: 12,
  },
  timeTextSchedule: { fontSize: 13, fontWeight: '600', color: '#1a1a1a', marginBottom: 4 },
  subjectCode: { fontSize: 13, fontWeight: '500', color: '#333', marginBottom: 4 },
  room: { fontSize: 12, color: '#333', marginBottom: 2 },
  block: { fontSize: 12, color: '#333', marginBottom: 2 },
  instructor: { fontSize: 12, fontWeight: '500', color: '#1a1a1a', marginTop: 4 },
});