import AsyncStorage from '@react-native-async-storage/async-storage';

// Expose public domain here
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
  return res.json();
}

// READ: Get one user by ID
export async function fetchUser(id: number) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
  return res.json();
}

// CREATE: Add new user (with optional photo)
export async function createUser(data: any, photo?: any) {
  const token = await getToken();

  const formData = new FormData();
  formData.append('full_name', data.full_name);
  formData.append('school_id', data.school_id);
  formData.append('email', data.email);
  if (data.phone) formData.append('phone', data.phone);
  formData.append('role', data.role);
  formData.append('password', data.password);

  if (photo && photo.uri) {
    // 👇 lazy-import image manipulator
    const ImageManipulator = require('expo-image-manipulator');

    // Compress + resize before upload
    const manipulated = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ resize: { width: 1280 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );

    const uri = manipulated.uri;
    const ext = uri.split('.').pop()?.toLowerCase() || 'jpg';

    formData.append('photo', {
      uri,
      name: photo.fileName || `photo.${ext}`,
      type: 'image/jpeg',
    } as any);
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Upload failed:", res.status, errorText);
    throw new Error(errorText);
  }

  return res.json();
}

// UPDATE (not used for now — kept for future edit feature)
export async function updateUser(id: number, data: any, photo?: any) {
  const token = await getToken();

  const formData = new FormData();
  if (data.full_name) formData.append('full_name', data.full_name);
  if (data.school_id) formData.append('school_id', data.school_id);
  if (data.email) formData.append('email', data.email);
  if (data.phone) formData.append('phone', data.phone);
  if (data.role) formData.append('role', data.role);
  if (data.password) formData.append('password', data.password);

  if (photo) {
    formData.append('photo', {
      uri: photo.uri,
      name: photo.fileName || 'photo.jpg',
      type: photo.mimeType || 'image/jpeg',
    } as any);
  }

  const res = await fetch(`${API_URL}/${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    body: (() => {
      const fd = formData;
      fd.append('_method', 'PUT');
      return fd;
    })(),
  });

  return res.json();
}

// DELETE: Remove user
export async function deleteUser(id: number) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error('Failed to delete user');
  }

  return res.json();
}
