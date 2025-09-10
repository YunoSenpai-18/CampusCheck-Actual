import AsyncStorage from '@react-native-async-storage/async-storage';

// Expose public domain here
const API_URL = 'https://benfscwxlf.sharedwithexpose.com/api/instructors';

async function getToken() {
  return await AsyncStorage.getItem('token');
}

// READ: Get all instructors
export async function fetchInstructors() {
  const token = await getToken();
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
  return res.json();
}

// READ: Get one instructor by ID
export async function fetchInstructor(id: number) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
  return res.json();
}

// CREATE: Add new instructor
export async function createInstructor(data: any) {
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
export async function updateInstructor(id: number, data: any) {
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

// DELETE: Remove instructor
export async function deleteInstructor(id: number) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error('Failed to delete instructor');
  }

  // Laravel usually returns { message: "Deleted successfully" }
  return res.json();
}
