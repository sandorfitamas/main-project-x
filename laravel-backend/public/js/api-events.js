async function apiFetchEvents() {
  try {
    const res = await fetch(`${API_BASE}/events`, { headers: { 'Accept': 'application/json' } });
    const data = await res.json();
    return data.success ? data.events : [];
  } catch {
    return [];
  }
}

async function apiFetchEvent(id) {
  try {
    const res = await fetch(`${API_BASE}/events/${id}`, { headers: { 'Accept': 'application/json' } });
    return res.json();
  } catch {
    return { success: false };
  }
}

async function apiFetchMyEvents() {
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

async function apiCreateEvent(formData) {
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

async function apiUpdateEvent(id, formData) {
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

async function apiDeleteEvent(id) {
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

async function apiFetchFavorites() {
  try {
    const res = await fetch(`${API_BASE}/favorites`, {
      headers: { ...getAuthHeaders(), 'Accept': 'application/json' },
    });
    const data = await res.json();
    return data.success ? data.favorites : [];
  } catch {
    return [];
  }
}

async function apiAddFavorite(eventId) {
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

async function apiRemoveFavorite(eventId) {
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

async function apiUploadImage(file) {
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

async function apiFetchUsers() {
  try {
    const res = await fetch(`${API_BASE}/users`, { headers: { 'Accept': 'application/json' } });
    const data = await res.json();
    return data.success ? data.users : [];
  } catch {
    return [];
  }
}
