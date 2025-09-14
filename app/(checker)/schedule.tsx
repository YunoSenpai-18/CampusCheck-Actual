import Header from '@/components/ui/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

type ScheduleItem = {
  time: string;
  subject: string;
  room: string;
  block: string;
  day: string;
  instructor: string;
};

export default function ScheduleScreen() {
  const router = useRouter();

  const navigateToProfile = () => {
    router.push('/(checker)/profile');
  };

  const [day, setDay] = useState('');
  const [date, setDate] = useState('');
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedule = async () => {
    try {
      setLoading(true);

      // Retrieve token
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.warn('No token found, redirecting to login...');
        router.replace('/login');
        return;
      }

      // Fetch today's schedules from backend
      const res = await axios.get('http://10.0.2.2:8000/api/checker/schedules/today', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setScheduleItems(res.data);
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
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

    fetchSchedule();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Schedule" onProfilePress={navigateToProfile} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>Today</Text>
          <Text style={styles.dateSubtext}>
            {day}, {date}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
        ) : scheduleItems.length > 0 ? (
          scheduleItems.map((item, index) => (
            <View key={index} style={styles.scheduleItem}>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
              <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{item.subject}</Text>
                </View>
                <Text style={styles.itemLocation}>Room: {item.room}</Text>
                <Text style={styles.itemLocation}>Block: {item.block}</Text>
                <Text style={styles.itemLocation}>Day: {item.day}</Text>
                <Text style={styles.itemDescription}>Instructor: {item.instructor}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
            No schedules for today 🎉
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  dateContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  dateText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  dateSubtext: {
    fontSize: 16,
    color: '#333333',
  },
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
  },
  timeContainer: {
    marginRight: 16,
    alignItems: 'center',
    width: 90,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  itemLocation: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 13,
    color: '#888888',
    marginTop: 4,
  },
});
