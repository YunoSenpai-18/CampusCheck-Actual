import AsyncStorage from '@react-native-async-storage/async-storage';

// Expose public domain here
const API_URL = 'https://testingapi.loca.lt/api/schedules';

async function getToken() {
  return await AsyncStorage.getItem('token');
}

// Utility: format Date -> "h:mm AM/PM"
function formatTime(value: any) {
  if (value instanceof Date) {
    return value.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
  return value; // already string
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

  const payload = {
    ...data,
    start_time: formatTime(data.start_time),
    end_time: formatTime(data.end_time),
  };

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) {
    return Promise.reject(json); // reject so UI handles it, but no red error spam
  }

  return json;
}

// UPDATE (not used for now — kept for future edit feature)
export async function updateSchedule(id: number, data: any) {
  const token = await getToken();

  const payload = {
    ...data,
    start_time: formatTime(data.start_time),
    end_time: formatTime(data.end_time),
  };

  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) {
    return Promise.reject(json); // reject so UI handles it, but no red error spam
  }

  return json;
}

// DELETE: Remove schedule
export async function deleteSchedule(id: number) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });

  if (!res.ok) {
    return Promise.reject({ message: 'Failed to delete schedule' }); // updated
  }

  return res.json(); // Laravel usually returns { message: "Deleted successfully" }
}

// READ: Get schedules for the logged-in checker (today only)
export async function fetchCheckerSchedules() {
  const token = await getToken();
  // Expose public domain here
  const res = await fetch('https://testingapi.loca.lt/api/checker/schedules', {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });

  if (!res.ok) {
    return Promise.reject({ message: 'Failed to fetch checker schedules' }); // updated
  }

  return res.json();
}
