import { API_BASE, getAuthHeaders } from './apiCommon.js';

export async function apiGetAdminDashboard() {
  try {
    const response = await fetch(`${API_BASE}/admin/dashboard`, { headers: { ...getAuthHeaders(), Accept: 'application/json' } });
    return await response.json();
  } catch (error) {
    return { success: false };
  }
}

export async function apiGetAdminUsers() {
  try {
    const response = await fetch(`${API_BASE}/admin/users`, { headers: { ...getAuthHeaders(), Accept: 'application/json' } });
    return await response.json();
  } catch (error) {
    return { success: false };
  }
}

export async function apiDeleteAdminUser(id) {
  try {
    const response = await fetch(`${API_BASE}/admin/users/${id}`, { method: 'DELETE', headers: { ...getAuthHeaders(), Accept: 'application/json' } });
    return await response.json();
  } catch (error) {
    return { success: false };
  }
}

export async function apiSuspendAdminUser(id, days) {
  try {
    const response = await fetch(`${API_BASE}/admin/users/${id}/suspend`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ days }),
    });
    return await response.json();
  } catch (error) {
    return { success: false };
  }
}

export async function apiGetAdminEvents() {
  try {
    const response = await fetch(`${API_BASE}/admin/events`, { headers: { ...getAuthHeaders(), Accept: 'application/json' } });
    return await response.json();
  } catch (error) {
    return { success: false };
  }
}

export async function apiDeleteAdminEvent(id) {
  try {
    const response = await fetch(`${API_BASE}/admin/events/${id}`, { method: 'DELETE', headers: { ...getAuthHeaders(), Accept: 'application/json' } });
    return await response.json();
  } catch (error) {
    return { success: false };
  }
}

export async function apiSuspendAdminEvent(id, days) {
  try {
    const response = await fetch(`${API_BASE}/admin/events/${id}/suspend`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ days }),
    });
    return await response.json();
  } catch (error) {
    return { success: false };
  }
}

export async function apiGetAdminReviews() {
  try {
    const response = await fetch(`${API_BASE}/admin/reviews`, { headers: getAuthHeaders() });
    return await response.json();
  } catch (error) {
    return { success: false };
  }
}

export async function apiDeleteAdminReview(id) {
  try {
    const response = await fetch(`${API_BASE}/admin/reviews/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    return await response.json();
  } catch (error) {
    return { success: false };
  }
}
