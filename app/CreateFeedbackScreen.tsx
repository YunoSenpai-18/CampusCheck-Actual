import Header from '@/components/ui/Header';
import { submitFeedback } from '@/services/feedbackApi';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateFeedbackScreen() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert('Validation Error', 'Message cannot be empty');
      return;
    }

    try {
      setLoading(true);
      await submitFeedback(message);
      Alert.alert('Success', 'Feedback submitted');
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Create Feedback"
        onProfilePress={() => router.push('/(admin)/profile')}
      />

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Type your feedback here..."
          value={message}
          onChangeText={setMessage}
          multiline
        />

        {/* Save Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.submitText}>{loading ? 'Submitting...' : 'Submit'}</Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity style={[styles.submitButton, styles.cancelButton]} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  form: { padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f1f1f1',
    marginTop: 8,
  },
  cancelText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
});
