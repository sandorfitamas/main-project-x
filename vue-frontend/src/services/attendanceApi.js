import { API_BASE, getAuthHeaders } from './apiCommon.js';

export async function apiCheckAttendance(eventId) {
  try {
    const response = await fetch(`${API_BASE}/events/${eventId}/attend`, {
      headers: { ...getAuthHeaders(), Accept: 'application/json' },
    });
    return await response.json();
  } catch (error) {
    return { success: false };
  }
}

export async function apiToggleAttendance(eventId, status) {
  try {
    const response = await fetch(`${API_BASE}/events/${eventId}/attend`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ status }),
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Hálózati hiba a részvétel mentésekor.' };
  }
}
