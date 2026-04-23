import { API_BASE } from './apiCommon.js';

export async function apiFetchUsers() {
  try {
    const response = await fetch(`${API_BASE}/users`, { headers: { Accept: 'application/json' } });
    const data = await response.json();
    return data.success ? data.users : [];
  } catch (error) {
    return [];
  }
}

export async function apiFetchRecentReviews() {
  try {
    const response = await fetch(`${API_BASE}/reviews/recent`, { headers: { Accept: 'application/json' } });
    const data = await response.json();
    return data.success ? data.reviews : [];
  } catch (error) {
    return [];
  }
}

export async function apiFetchRecentAttendances() {
  try {
    const response = await fetch(`${API_BASE}/attendances/recent`, {
      headers: { Accept: 'application/json' },
    });
    const data = await response.json();
    return data.success ? data.attendances : [];
  } catch (error) {
    return [];
  }
}
