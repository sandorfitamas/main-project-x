function getAuthHeaders() {
  const token = localStorage.getItem('auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function apiRegister(name, email, password) {
  const res = await fetch(`${AUTH_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}

async function apiLogin(email, password) {
  const res = await fetch(`${AUTH_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

async function apiLogout() {
  const token = localStorage.getItem('auth_token');
  if (!token) return;
  await fetch(`${AUTH_BASE}/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
  });
  localStorage.removeItem('auth_token');
  localStorage.removeItem('current_user');
}

async function apiGetCurrentUser() {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  try {
    const res = await fetch(`${AUTH_BASE}/current`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    });
    if (!res.ok) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
      return null;
    }
    const data = await res.json();
    return data.success ? data.user : null;
  } catch {
    return null;
  }
}
