import { API_BASE, getAuthHeaders } from './apiCommon.js';

export async function apiFetchMyTickets() {
  try {
    const response = await fetch(`${API_BASE}/tickets`, {
      headers: { ...getAuthHeaders(), Accept: 'application/json' },
    });
    const data = await response.json();
    return data.success ? data.tickets : [];
  } catch (error) {
    return [];
  }
}

export async function apiBuyTicket(eventId, quantity = 1) {
  try {
    const response = await fetch(`${API_BASE}/events/${eventId}/buy`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Hálózati hiba: A jegyvásárlás nem sikerült.' };
  }
}

export async function apiCheckoutCart(items, customer = {}) {
  try {
    const response = await fetch(`${API_BASE}/checkout`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ items, customer }),
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Hálózati hiba a fizetés feldolgozásakor.' };
  }
}
