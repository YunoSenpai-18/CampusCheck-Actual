import AsyncStorage from '@react-native-async-storage/async-storage';

// Expose public domain here
const API_URL = 'https://testingapi.loca.lt/api/schedules';

async function getToken() {
  return await AsyncStorage.getItem('token');
}

// READ: Get all schedules
export async function fetchSchedules() {
  const token = await getToken();
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
  return res.json();
}

// READ: Get one schedule
export async function fetchSchedule(id: number) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
  return res.json();
}

// CREATE: Add new schedule
export async function createSchedule(data: any) {
  const token = await getToken();
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

// UPDATE (not used for now — kept for future edit feature)
export async function updateSchedule(id: number, data: any) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

// DELETE: Remove schedule
export async function deleteSchedule(id: number) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error('Failed to delete schedule');
  }

  return res.json(); // Laravel usually returns { message: "Deleted successfully" }
}
