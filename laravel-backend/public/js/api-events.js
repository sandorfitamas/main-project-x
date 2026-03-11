async function apiFetchEvents() {
  const res = await fetch(`${API_BASE}/events`, {
    headers: { 'Accept': 'application/json' },
  });
  const data = await res.json();
  return data.success ? data.events : [];
}

async function apiFetchEvent(id) {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    headers: { 'Accept': 'application/json' },
  });
  return res.json();
}

async function apiFetchMyEvents() {
  const res = await fetch(`${API_BASE}/events/user/my`, {
    headers: { ...getAuthHeaders(), 'Accept': 'application/json' },
  });
  const data = await res.json();
  return data.success ? data.events : [];
}

async function apiCreateEvent(formData) {
  const res = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Accept': 'application/json' },
    body: formData,
  });
  return res.json();
}

async function apiUpdateEvent(id, formData) {
  formData.append('_method', 'PUT');
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Accept': 'application/json' },
    body: formData,
  });
  return res.json();
}

async function apiDeleteEvent(id) {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders(), 'Accept': 'application/json' },
  });
  return res.json();
}

async function apiFetchFavorites() {
  const res = await fetch(`${API_BASE}/favorites`, {
    headers: { ...getAuthHeaders(), 'Accept': 'application/json' },
  });
  const data = await res.json();
  return data.success ? data.favorites : [];
}

async function apiAddFavorite(eventId) {
  const res = await fetch(`${API_BASE}/favorites`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ event_id: eventId }),
  });
  return res.json();
}

async function apiRemoveFavorite(eventId) {
  const res = await fetch(`${API_BASE}/favorites/${eventId}`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders(), 'Accept': 'application/json' },
  });
  return res.json();
}

async function apiUploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Accept': 'application/json' },
    body: formData,
  });
  return res.json();
}

async function apiFetchUsers() {
  const res = await fetch(`${API_BASE}/users`, {
    headers: { 'Accept': 'application/json' },
  });
  const data = await res.json();
  return data.success ? data.users : [];
}
