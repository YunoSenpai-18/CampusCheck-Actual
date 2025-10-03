import Header from '@/components/ui/Header';
import {
  fetchCheckers,
  fetchRooms,
  Room,
  updateRoomChecker,
} from '@/services/roomApi';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RoomManagementScreen() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [checkers, setCheckers] = useState<{ id: number; full_name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadData = async () => {
    try {
      setLoading(true);
      const [roomData, checkerData] = await Promise.all([fetchRooms(), fetchCheckers()]);
      setRooms(roomData);

      // ✅ Only include users with role = "Checker"
      const onlyCheckers = (checkerData || []).filter(
        (u: any) => u.role === 'Checker'
      );
      setCheckers(onlyCheckers);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not load rooms or checkers');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignChecker = async (roomId: number, checkerId: number | null) => {
    try {
      setLoading(true);
      await updateRoomChecker(roomId, checkerId);
      loadData(); // reload after update
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not assign checker');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderRoom = ({ item }: { item: Room }) => (
    <View style={styles.card}>
      <Text style={styles.room}>
        {item.room_number} ({item.building?.name})
      </Text>
      <Picker
        selectedValue={item.checker?.id || null}
        style={styles.picker}
        onValueChange={(val) => handleAssignChecker(item.id, val || null)}
      >
        <Picker.Item label="-- Select Checker --" value={null} />
        {checkers.map((c) => (
          <Picker.Item key={c.id} label={c.full_name} value={c.id} />
        ))}
      </Picker>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Room Management" />
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRoom}
          contentContainerStyle={styles.list}
        />
      )}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  list: { padding: 16 },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  room: { fontSize: 15, fontWeight: '600', marginBottom: 8 },
  picker: { height: 50 },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  backText: { color: '#fff', fontSize: 16, marginLeft: 6, fontWeight: '500' },
});
