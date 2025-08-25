import Header from '@/components/ui/Header';
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

  // Simulated API call — replace this with your DB/API call later
  const fetchSchedule = async () => {
    try {
      setLoading(true);
      // Example static data (kept the same visible strings to preserve UI)
      const data: ScheduleItem[] = [
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
      ];
      // TODO: Replace above with real fetch, e.g.:
      // const res = await fetch('https://your-api/schedule');
      // const data: ScheduleItem[] = await res.json();

      setScheduleItems(data);
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
        ) : (
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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