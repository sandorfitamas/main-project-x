import { API_BASE, getAuthHeaders } from './apiCommon.js';

export async function apiFetchReviews(eventId) {
  try {
    const response = await fetch(`${API_BASE}/events/${eventId}/reviews`, { headers: { Accept: 'application/json' } });
    const data = await response.json();
    return data.success ? data.reviews : [];
  } catch (error) {
    return [];
  }
}

export async function apiSubmitReview(eventId, rating, comment) {
  try {
    const response = await fetch(`${API_BASE}/events/${eventId}/reviews`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ rating, comment }),
    });
    const data = await response.json();

    if (!response.ok) {
      return { success: false, ...data, message: data.message || 'Hiba történt az értékelés mentése során.' };
    }
    return data;
  } catch (error) {
    return { success: false, message: 'Hálózati hiba.' };
  }
}
