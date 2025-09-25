import AsyncStorage from '@react-native-async-storage/async-storage';

// Expose public domain here
const API_URL = 'https://testingapi.loca.lt/api/instructors';

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

// CREATE: Add new instructor (with optional photo)
export async function createInstructor(data: any, photo?: any) {
  const token = await getToken();

  const formData = new FormData();
  formData.append('full_name', data.full_name);
  formData.append('instructor_id', data.instructor_id);
  formData.append('department', data.department);
  formData.append('email', data.email);
  formData.append('phone', data.phone);

  if (photo && photo.uri) {
    // 👇 lazy-import image manipulator (only runs if photo is passed)
    const ImageManipulator = require('expo-image-manipulator');

    // Compress + resize before upload
    const manipulated = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ resize: { width: 1280 } }], // resize down
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );

    const uri = manipulated.uri;
    const ext = uri.split('.').pop()?.toLowerCase() || 'jpg';

    formData.append('photo', {
      uri,
      name: photo.fileName || `photo.${ext}`,
      type: 'image/jpeg', // force JPEG
    } as any);
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      // ❌ let fetch set the boundary Content-Type automatically
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
export async function updateInstructor(id: number, data: any, photo?: any) {
  const token = await getToken();

  const formData = new FormData();
  if (data.full_name) formData.append('full_name', data.full_name);
  if (data.instructor_id) formData.append('instructor_id', data.instructor_id);
  if (data.department) formData.append('department', data.department);
  if (data.email) formData.append('email', data.email);
  if (data.phone) formData.append('phone', data.phone);

  if (photo) {
    formData.append('photo', {
      uri: photo.uri,
      name: photo.fileName || 'photo.jpg',
      type: photo.mimeType || 'image/jpeg',
    } as any);
  }

  const res = await fetch(`${API_URL}/${id}`, {
    method: 'POST', // Laravel accepts PUT but fetch+FormData often requires POST + _method
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    body: (() => {
      const fd = formData;
      fd.append('_method', 'PUT'); // spoof method for Laravel
      return fd;
    })(),
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

  return res.json(); // Laravel usually returns { message: "Deleted successfully" }
}
