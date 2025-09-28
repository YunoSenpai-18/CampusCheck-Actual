import Header from '@/components/ui/Header';
import { fetchFeedback } from '@/services/feedbackApi';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Define a type for the feedback item
type FeedbackItem = {
  id: number;
  message: string;
  status: 'Pending' | 'Accepted' | 'Declined'; // Assuming these are the valid status values
  admin_response?: string;
};

export default function FeedbackListScreen() {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      const data = await fetchFeedback();
      setFeedbackList(data || []);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not load feedback');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeedback();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: FeedbackItem }) => (
    <View style={styles.card}>
      <Text style={styles.message}>{item.message}</Text>
      <Text
        style={[
          styles.status,
          styles[item.status.toLowerCase() as keyof typeof styles],
        ]}
      >
        {item.status}
      </Text>
      {item.admin_response && (
        <Text style={styles.response}>Admin: {item.admin_response}</Text>
      )}
    </View>
  );

  useFocusEffect(
    useCallback(() => {
      loadFeedback();
    }, [])
  );

  useEffect(() => {
    loadFeedback();
    const interval = setInterval(() => {
      loadFeedback();
    }, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="My Feedback"
        onProfilePress={() => router.push('/(admin)/profile')}
      />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={feedbackList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/CreateFeedbackScreen')}
      >
        <Text style={styles.addText}>Submit Feedback</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: '#555' }]}
        onPress={() => router.replace('/(checker)/profile')}
      >
        <Text style={styles.addText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  list: { padding: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  message: { fontSize: 15, marginBottom: 6, color: '#333' },
  status: { fontSize: 13, fontWeight: '600' },
  pending: { color: '#FFA500' },
  accepted: { color: 'green' },
  declined: { color: 'red' },
  response: { marginTop: 6, fontSize: 13, color: '#555' },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    margin: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  addText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
