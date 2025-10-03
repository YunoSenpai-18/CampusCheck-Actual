import Header from '@/components/ui/Header';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

export default function DashboardScreen() {
  const router = useRouter();

  // Time & Date
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  // Attendance
  const [attendanceCount, setAttendanceCount] = useState<number>(0);

  // Schedule
  const [scheduleList, setScheduleList] = useState<
    {
      start_time: string;
      end_time: string;
      subjectCode: string;
      subject: string;
      room: { room_number: string; building: { name: string } }; // ✅ room is an object
      block: string;
      day: string;
      instructor: string;
    }[]
  >([]);
  const [loadingSchedules, setLoadingSchedules] = useState(true);

  const navigateToSchedule = () => router.push('/(checker)/schedule');
  const navigateToProfile = () => router.push('/(checker)/profile');

  // Update clock every minute
  useEffect(() => {
    const updateTimeAndDate = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
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

  // Fetch schedules dynamically
  const fetchCheckerSchedules = async () => {
    try {
      setLoadingSchedules(true);

      // Get token
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.warn('No token found, redirecting to login...');
        router.replace('/login');
        return;
      }

      // Fetch schedules for checker
      const res = await axios.get('https://testingapi.loca.lt/api/checker/schedules', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Map API data to dashboard format and slice first 4 items
      const schedules = res.data
        .map((item: any) => ({
          start_time: item.start_time,
          end_time: item.end_time,
          subjectCode: item.subject_code,
          subject: item.subject,
          room: {
            room_number: item.room.room_number,
            building: item.room.building,
          }, // ✅ keep only what you need
          block: item.block,
          day: item.day,
          instructor: item.instructor.full_name,
        }))
        .slice(0, 4);

      setScheduleList(schedules);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    } finally {
      setLoadingSchedules(false);
    }
  };

  // Simulate fetching attendance for now
  useEffect(() => {
    setAttendanceCount(7);
    fetchCheckerSchedules();
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

        {/* Schedule */}
        <View style={styles.sectionCard}>
          <TouchableOpacity onPress={navigateToSchedule}>
            <Text style={styles.sectionTitleBlue}>Schedule ➤</Text>
          </TouchableOpacity>

          {loadingSchedules ? (
            <ActivityIndicator size="small" color="#007AFF" style={{ marginTop: 12 }} />
          ) : scheduleList.length > 0 ? (
            <View style={styles.scheduleRow}>
              {scheduleList.map((sched, index) => (
                <View key={index} style={styles.scheduleBox}>
                  <Text style={styles.timeTextSchedule}>{formatTimeRange(sched.start_time, sched.end_time)}</Text>
                  <Text style={styles.subjectCode}>{sched.subjectCode} | {sched.subject}</Text>
                  <Text style={styles.room}>
                    Room: {sched.room.room_number} ({sched.room.building?.name})
                  </Text>
                  <Text style={styles.block}>Block: {sched.block}</Text>
                  <Text style={styles.room}>Day: {sched.day}</Text>
                  <Text style={styles.instructor}>Instructor: {sched.instructor}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 12, color: '#666' }}>
              No schedules for today 🎉
            </Text>
          )}
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
