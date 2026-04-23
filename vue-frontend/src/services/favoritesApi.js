import { API_BASE, getAuthHeaders } from './apiCommon.js';

export async function apiFetchFavorites() {
  try {
    const response = await fetch(`${API_BASE}/favorites`, {
      headers: { ...getAuthHeaders(), Accept: 'application/json' },
    });
    const data = await response.json();
    return data.success ? data.events : [];
  } catch (error) {
    console.error('Hiba a kedvencek lekérésekor', error);
    return [];
  }
}

export async function apiAddFavorite(eventId) {
  try {
    const response = await fetch(`${API_BASE}/favorites`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ event_id: eventId }),
    });
    return response.json();
  } catch (error) {
    return { success: false, message: 'Hálózati hiba: Jelenleg nem érhető el a szerver.' };
  }
}

export async function apiRemoveFavorite(eventId) {
  try {
    const response = await fetch(`${API_BASE}/favorites/${eventId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders(), Accept: 'application/json' },
    });
    return response.json();
  } catch (error) {
    return { success: false, message: 'Hálózati hiba: Jelenleg nem érhető el a szerver.' };
  }
}
