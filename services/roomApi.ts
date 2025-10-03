import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'https://testingapi.loca.lt/api';

export type Checker = {
  id: number;
  full_name: string;
};

export type Building = {
  id: number;
  name: string;
  rooms?: Room[]; // optional because some endpoints may not include rooms
};

export type Room = {
  id: number;
  room_number: string;
  building_id: number;
  checker_id?: number | null;
  building: Building;              // ✅ now strongly typed
  checker?: Checker | null;        // ✅ consistent typing
};

// --- API Calls ---

export const fetchRooms = async (): Promise<Room[]> => {
  const token = await AsyncStorage.getItem('token');
  const res = await axios.get(`${API_URL}/rooms`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data || [];
};

export const updateRoomChecker = async (
  roomId: number,
  checker_id: number | null
): Promise<Room> => {
  const token = await AsyncStorage.getItem('token');
  const res = await axios.put(
    `${API_URL}/rooms/${roomId}`,
    { checker_id },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const fetchCheckers = async (): Promise<Checker[]> => {
  const token = await AsyncStorage.getItem('token');
  const res = await axios.get(`${API_URL}/users?role=Checker`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data || [];
};
