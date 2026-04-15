const API_BASE = '/api';
const AUTH_BASE = '/api/auth';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  CURRENT_USER: 'current_user',
};

export const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&q=80';

export const EventCategory = {
  ALL: 'all',
  HAZIBULI: 'Házibuli',
  KLUB: 'Klub',
  FESZTIVAL: 'Fesztivál',
  RAVE: 'Rave',
  CHILL: 'Chill',
  EGYEB: 'Egyéb',
};

export const CATEGORY_ICONS = {
  'Házibuli': 'bi-house-heart',
  'Klub': 'bi-music-note-beamed',
  'Fesztivál': 'bi-balloon',
  'Rave': 'bi-lightning-charge',
  'Chill': 'bi-cup-hot',
  'Egyéb': 'bi-tag',
};

function getAuthHeaders() {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Regisztráció/Bejelentkezés
export async function apiRegister(name, email, password) {
  try {
    const res = await fetch(`${AUTH_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return res.json();
  } catch {
    return { success: false, message: 'Hálózati hiba' };
  }
}

export async function apiLogin(email, password) {
  try {
    const res = await fetch(`${AUTH_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  } catch {
    return { success: false, message: 'Hálózati hiba' };
  }
}

export async function apiLogout() {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (!token) return;
  await fetch(`${AUTH_BASE}/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
  });
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

export async function apiGetCurrentUser() {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (!token) return null;
  try {
    const res = await fetch(`${AUTH_BASE}/current`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    });
    if (!res.ok) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      return null;
    }
    const data = await res.json();
    return data.success ? data.user : null;
  } catch {
    return null;
  }
}

export async function apiUpdateProfile(data) {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (!token) return { success: false, message: 'Nem vagy bejelentkezve' };
  try {
    let body;
    let headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    if (data instanceof FormData) {
      body = data;
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(data);
    }

    const res = await fetch(`${AUTH_BASE}/profile`, {
      method: data instanceof FormData ? 'POST' : 'PUT', // Laravel needs POST + _method=PUT for FormData
      headers,
      body,
    });
    return res.json();
  } catch {
    return { success: false, message: 'Hálózati hiba' };
  }
}

// Események
export async function apiFetchEvents() {
  try {
    const res = await fetch(`${API_BASE}/events`, { headers: { 'Accept': 'application/json' } });
    const data = await res.json();
    return data.success ? data.events : [];
  } catch {
    return [];
  }
}

export async function apiFetchEvent(id) {
  try {
    const res = await fetch(`${API_BASE}/events/${id}`, { headers: { 'Accept': 'application/json' } });
    return res.json();
  } catch {
    return { success: false };
  }
}

export async function apiFetchMyEvents() {
  try {
    const res = await fetch(`${API_BASE}/events/user/my`, {
      headers: { ...getAuthHeaders(), 'Accept': 'application/json' },
    });
    const data = await res.json();
    return data.success ? data.events : [];
  } catch {
    return [];
  }
}

export async function apiCreateEvent(formData) {
  try {
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Accept': 'application/json' },
      body: formData,
    });
    return res.json();
  } catch {
    return { success: false, message: 'Hálózati hiba' };
  }
}

export async function apiUpdateEvent(id, formData) {
  formData.append('_method', 'PUT');
  try {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Accept': 'application/json' },
      body: formData,
    });
    return res.json();
  } catch {
    return { success: false, message: 'Hálózati hiba' };
  }
}

export async function apiDeleteEvent(id) {
  try {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders(), 'Accept': 'application/json' },
    });
    return res.json();
  } catch {
    return { success: false, message: 'Hálózati hiba' };
  }
}

// Kedvencek
export async function apiFetchFavorites() {
  try {
    const res = await fetch(`${API_BASE}/favorites`, {
      headers: { ...getAuthHeaders(), 'Accept': 'application/json' },
    });
    const data = await res.json();
    return data.success ? data.events : [];
  } catch {
    return [];
  }
}

export async function apiAddFavorite(eventId) {
  try {
    const res = await fetch(`${API_BASE}/favorites`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ event_id: eventId }),
    });
    return res.json();
  } catch {
    return { success: false, message: 'Hálózati hiba' };
  }
}

export async function apiRemoveFavorite(eventId) {
  try {
    const res = await fetch(`${API_BASE}/favorites/${eventId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders(), 'Accept': 'application/json' },
    });
    return res.json();
  } catch {
    return { success: false, message: 'Hálózati hiba' };
  }
}

// Feltöltés
export async function apiUploadImage(file) {
  try {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Accept': 'application/json' },
      body: formData,
    });
    return res.json();
  } catch {
    return { success: false, message: 'Hálózati hiba' };
  }
}

// Felhasználók
export async function apiFetchUsers() {
  try {
    const res = await fetch(`${API_BASE}/users`, { headers: { 'Accept': 'application/json' } });
    const data = await res.json();
    return data.success ? data.users : [];
  } catch {
    return [];
  }
}

// Vélemények
export async function apiFetchReviews(eventId) {
  try {
    const res = await fetch(`${API_BASE}/events/${eventId}/reviews`, { headers: { 'Accept': 'application/json' } });
    return await res.json();
  } catch {
    return [];
  }
}

export async function apiFetchRecentReviews() {
  try {
    const res = await fetch(`${API_BASE}/reviews/recent`, { headers: { 'Accept': 'application/json' } });
    return await res.json();
  } catch {
    return [];
  }
}

export async function apiFetchMyTickets() {
  try {
    const res = await fetch(`${API_BASE}/tickets`, {
      headers: { ...getAuthHeaders(), 'Accept': 'application/json' }
    });
    const data = await res.json();
    return data.success ? data.tickets : [];
  } catch {
    return [];
  }
}

export async function apiBuyTicket(eventId, quantity = 1) {
  try {
    const res = await fetch(`${API_BASE}/events/${eventId}/buy`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ quantity })
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Hálózati hiba' };
  }
}

export async function apiCheckoutCart(items, customer = {}) {
  try {
    const res = await fetch(`${API_BASE}/checkout`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ items, customer })
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Hálózati hiba' };
  }
}

export async function apiSubmitReview(eventId, rating, comment) {
  try {
    const res = await fetch(`${API_BASE}/events/${eventId}/reviews`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ rating, comment }),
    });
    const data = await res.json();
    if (!res.ok) {
        return { success: false, ...data, message: data.message || 'Hiba történt a mentés során' };
    }
    return data;
  } catch {
    return { success: false, message: 'Hálózati hiba' };
  }
}

export async function apiFetchRecentAttendances() { try { const res = await fetch(API_BASE + '/attendances/recent', { headers: { 'Accept': 'application/json' } }); const data = await res.json(); return data.success ? data.attendances : []; } catch { return []; } } export async function apiCheckAttendance(eventId) { try { const res = await fetch(API_BASE + '/events/' + eventId + '/attend', { headers: { ...getAuthHeaders(), 'Accept': 'application/json' } }); return await res.json(); } catch { return { success: false }; } } export async function apiToggleAttendance(eventId, status) { try { const res = await fetch(API_BASE + '/events/' + eventId + '/attend', { method: 'POST', headers: { ...getAuthHeaders(), 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ status }) }); return await res.json(); } catch { return { success: false, message: 'Halozati hiba' }; } }


// -- ADMIN --
export async function apiGetAdminDashboard() {
  try {
    const res = await fetch(API_BASE + '/admin/dashboard', { headers: { ...getAuthHeaders(), 'Accept': 'application/json' } });
    return await res.json();
  } catch { return { success: false }; }
}

export async function apiGetAdminUsers() {
  try {
    const res = await fetch(API_BASE + '/admin/users', { headers: { ...getAuthHeaders(), 'Accept': 'application/json' } });
    return await res.json();
  } catch { return { success: false }; }
}

export async function apiDeleteAdminUser(id) {
  try {
    const res = await fetch(API_BASE + '/admin/users/' + id, { method: 'DELETE', headers: { ...getAuthHeaders(), 'Accept': 'application/json' } });
    return await res.json();
  } catch { return { success: false }; }
}

export async function apiGetAdminEvents() {
  try {
    const res = await fetch(API_BASE + '/admin/events', { headers: { ...getAuthHeaders(), 'Accept': 'application/json' } });
    return await res.json();
  } catch { return { success: false }; }
}

export async function apiDeleteAdminEvent(id) {
  try {
    const res = await fetch(API_BASE + '/admin/events/' + id, { method: 'DELETE', headers: { ...getAuthHeaders(), 'Accept': 'application/json' } });
    return await res.json();
  } catch { return { success: false }; }
}


export async function apiSuspendAdminUser(id, days) {
  try {
    const res = await fetch(API_BASE + '/admin/users/' + id + '/suspend', {
        method: 'POST', 
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ days })
    });
    return await res.json();
  } catch { return { success: false }; }
}

export async function apiSuspendAdminEvent(id, days) {
  try {
    const res = await fetch(API_BASE + '/admin/events/' + id + '/suspend', {
        method: 'POST', 
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ days })
    });
    return await res.json();
  } catch { return { success: false }; }
}

export async function apiGetAdminReviews() {
  try {
    const res = await fetch(API_BASE + '/admin/reviews', { headers: getAuthHeaders() });
    return await res.json();
  } catch { return { success: false }; }
}

export async function apiDeleteAdminReview(id) {
  try {
    const res = await fetch(API_BASE + '/admin/reviews/' + id, { method: 'DELETE', headers: getAuthHeaders() });
    return await res.json();
  } catch { return { success: false }; }
}

