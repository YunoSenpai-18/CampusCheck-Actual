import AsyncStorage from '@react-native-async-storage/async-storage';

// Expose public domain here
const API_URL = 'https://testingapi.loca.lt/api/feedback';

async function getToken() {
  return await AsyncStorage.getItem('token');
}

// READ: Get feedback (Admin = all, Checker = only theirs)
export async function fetchFeedback() {
  const token = await getToken();
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });

  if (!res.ok) {
    const err = await res.json();
    return Promise.reject(err);
  }

  return res.json();
}

// CREATE: Submit new feedback (Checker)
export async function submitFeedback(message: string) {
  const token = await getToken();
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  const json = await res.json();
  if (!res.ok) {
    return Promise.reject(json);
  }

  return json;
}

// UPDATE: Admin update feedback (status + response)
export async function updateFeedback(
  id: number,
  data: { status: string; admin_response?: string }
) {
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

  const json = await res.json();
  if (!res.ok) {
    return Promise.reject(json);
  }

  return json;
}

// DELETE (optional, for Admin cleanup)
export async function deleteFeedback(id: number) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });

  if (!res.ok) {
    return Promise.reject({ message: 'Failed to delete feedback' });
  }

  return res.json();
}
