import { API_BASE, getAuthHeaders } from './apiCommon.js';

export async function apiFetchEvents() {
  try {
    const response = await fetch(`${API_BASE}/events`, { headers: { Accept: 'application/json' } });
    const data = await response.json();
    return data.success ? data.events : [];
  } catch (error) {
    console.error('Hiba az események betöltésekor', error);
    return [];
  }
}

export async function apiFetchEvent(id) {
  try {
    const response = await fetch(`${API_BASE}/events/${id}`, { headers: { Accept: 'application/json' } });
    return response.json();
  } catch (error) {
    return { success: false };
  }
}

export async function apiFetchMyEvents() {
  try {
    const response = await fetch(`${API_BASE}/events/user/my`, {
      headers: { ...getAuthHeaders(), Accept: 'application/json' },
    });
    const data = await response.json();
    return data.success ? data.events : [];
  } catch (error) {
    return [];
  }
}

export async function apiCreateEvent(formData) {
  try {
    const response = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), Accept: 'application/json' },
      body: formData,
    });
    return response.json();
  } catch (error) {
    return { success: false, message: 'Hálózati hiba történt a létrehozás során.' };
  }
}

export async function apiUpdateEvent(id, formData) {
  formData.append('_method', 'PUT');
  try {
    const response = await fetch(`${API_BASE}/events/${id}`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), Accept: 'application/json' },
      body: formData,
    });
    return response.json();
  } catch (error) {
    return { success: false, message: 'Hálózati hiba történt a módosítás során.' };
  }
}

export async function apiDeleteEvent(id) {
  try {
    const response = await fetch(`${API_BASE}/events/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders(), Accept: 'application/json' },
    });
    return response.json();
  } catch (error) {
    return { success: false, message: 'Hálózati hiba történt a törlés során.' };
  }
}
