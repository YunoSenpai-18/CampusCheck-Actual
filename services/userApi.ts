import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://testingapi.loca.lt/api/users';

async function getToken() {
  return await AsyncStorage.getItem('token');
}

// READ: Get all users
export async function fetchUsers() {
  const token = await getToken();
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }

  return res.json();
}
