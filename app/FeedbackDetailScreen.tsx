import Header from '@/components/ui/Header';
import { fetchFeedback, updateFeedback } from '@/services/feedbackApi';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Define the type for FeedbackItem
type FeedbackItem = {
  id: number;
  message: string;
  checker: { full_name: string; email: string };
  status: 'Pending' | 'Accepted' | 'Declined';
  admin_response?: string;
};

export default function AdminFeedbackDetailScreen() {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<FeedbackItem | null>(null);
  const [response, setResponse] = useState('');
  const router = useRouter();

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

  const handleUpdate = async (status: 'Accepted' | 'Declined') => {
    if (!selected) return;
    try {
      setLoading(true);
      await updateFeedback(selected.id, { status, admin_response: response });
      Alert.alert('Success', `Feedback marked as ${status}`);
      setSelected(null);
      loadFeedback();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not update feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const renderItem = ({ item }: { item: FeedbackItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelected(item);
        setResponse(item.admin_response || '');
      }}
    >
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.user}>
        From: {item.checker?.full_name || 'Unknown'}
      </Text>
      <Text style={[styles.status, styles[item.status]]}>{item.status}</Text>

      {/* Show admin response if it exists */}
      {item.admin_response ? (
        <Text style={styles.responseOnList}>
          Response: {item.admin_response}
        </Text>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Manage Feedback" />

      {loading && !selected ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : selected ? (
        <View style={styles.detail}>
          <Text style={styles.label}>From: {selected.checker?.full_name}</Text>
          <Text style={styles.label}>Message:</Text>
          <Text style={styles.message}>{selected.message}</Text>

          <Text style={styles.label}>Admin Response:</Text>
          <TextInput
            style={styles.input}
            value={response}
            onChangeText={setResponse}
            placeholder="Write your response..."
            multiline
          />

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.accept]}
              onPress={() => handleUpdate('Accepted')}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.decline]}
              onPress={() => handleUpdate('Declined')}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setSelected(null)}
          >
            <Text style={styles.addText}>← Back to list</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={feedbackList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
      {/* Bottom Back button with back-or-fallback logic */}
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: '#555' }]}
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/(admin)/profile');
          }
        }}
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
  user: { fontSize: 13, color: '#666', marginBottom: 4 },
  status: { fontSize: 13, fontWeight: '600' },
  Pending: { color: '#FFA500' },
  Accepted: { color: 'green' },
  Declined: { color: 'red' },

  detail: { padding: 20 },
  label: { fontSize: 15, fontWeight: '600', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#f9f9f9',
    marginTop: 8,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  accept: { backgroundColor: 'green' },
  decline: { backgroundColor: 'red' },
  backButton: { marginTop: 20, alignItems: 'center' },
  backText: { color: '#007AFF', fontSize: 15, fontWeight: '600' },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    margin: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  addText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  responseOnList: {
    marginTop: 6,
    fontSize: 13,
    fontStyle: 'italic',
    color: '#444',
  },
});
