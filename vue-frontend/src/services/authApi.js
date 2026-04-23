import { AUTH_BASE, STORAGE_KEYS } from './apiCommon.js';

export async function apiRegister(name, email, password) {
  try {
    const response = await fetch(`${AUTH_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return response.json();
  } catch (error) {
    return { success: false, message: 'Hálózati hiba: Jelenleg nem érhető el a szerver.' };
  }
}

export async function apiLogin(email, password) {
  try {
    const response = await fetch(`${AUTH_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  } catch (error) {
    return { success: false, message: 'Hálózati hiba: Jelenleg nem érhető el a szerver.' };
  }
}

export async function apiLogout() {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (!token) return;

  try {
    await fetch(`${AUTH_BASE}/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
  } catch (error) {
    console.error('Kijelentkezési API hiba:', error);
  } finally {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

export async function apiGetCurrentUser() {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (!token) return null;

  try {
    const response = await fetch(`${AUTH_BASE}/current`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });

    if (!response.ok) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      return null;
    }

    const data = await response.json();
    return data.success ? data.user : null;
  } catch (error) {
    return null;
  }
}

export async function apiUpdateProfile(data) {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (!token) {
    return { success: false, message: 'Nem vagy bejelentkezve' };
  }

  try {
    let requestBody;
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    };

    if (data instanceof FormData) {
      requestBody = data;
    } else {
      headers['Content-Type'] = 'application/json';
      requestBody = JSON.stringify(data);
    }

    const response = await fetch(`${AUTH_BASE}/profile`, {
      method: data instanceof FormData ? 'POST' : 'PUT',
      headers,
      body: requestBody,
    });

    return response.json();
  } catch (error) {
    return { success: false, message: 'Hálózati hiba történt a profil frissítése során.' };
  }
}
