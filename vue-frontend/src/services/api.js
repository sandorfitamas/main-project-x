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

// ============================================
// Hitelesítési API hívások
// ============================================

/**
 * Felhasználó regisztrációja a backenden
 */
export async function apiRegister(name, email, password) {
  try {
    const response = await fetch(`${AUTH_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return response.json();
  } catch (error) {
    return { success: false, message: 'Hálózati hiba: Jelenleg nem érhető el a szerver.' };
  }
}

/**
 * Felhasználó bejelentkeztetése email és jelszó alapján
 */
export async function apiLogin(email, password) {
  try {
    const response = await fetch(`${AUTH_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  } catch (error) {
    return { success: false, message: 'Hálózati hiba: Jelenleg nem érhető el a szerver.' };
  }
}

/**
 * Kijelentkezés, ami a háttérben is megsemmisíti a felhasználó egyedi tokenjét
 */
export async function apiLogout() {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (!token) return;

  try {
    await fetch(`${AUTH_BASE}/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    });
  } catch (error) {
    console.error('Kijelentkezési API hiba:', error);
  } finally {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

/**
 * A bejelentkezett felhasználó aktuális adatainak lekérése a meglévő token alapján
 */
export async function apiGetCurrentUser() {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (!token) return null;

  try {
    const response = await fetch(`${AUTH_BASE}/current`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    });
    
    // Ha a token lejárt vagy érvénytelen, töröljük a lokális tárolóból
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

/**
 * Profil adatainak (név, jelszó, profilkép) frissítése
 */
export async function apiUpdateProfile(data) {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (!token) {
    return { success: false, message: 'Nem vagy bejelentkezve' };
  }

  try {
    let requestBody;
    let headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // Ha a kérés FormData (pl. profilkép változott), akkor POST és _method=PUT kell a Laravel miatt
    if (data instanceof FormData) {
      requestBody = data;
    } else {
      headers['Content-Type'] = 'application/json';
      requestBody = JSON.stringify(data);
    }

    const response = await fetch(`${AUTH_BASE}/profile`, {
      method: data instanceof FormData ? 'POST' : 'PUT',
      headers: headers,
      body: requestBody,
    });

    return response.json();
  } catch (error) {
    return { success: false, message: 'Hálózati hiba történt a profil frissítése során.' };
  }
}

// ============================================
// Események API hívások
// ============================================

/**
 * Lekéri az összes aktív eseményt.
 */
export async function apiFetchEvents() {
  try {
    const response = await fetch(`${API_BASE}/events`, { headers: { 'Accept': 'application/json' } });
    const data = await response.json();
    return data.success ? data.events : [];
  } catch (error) {
    console.error('Hiba az események betöltésekor', error);
    return [];
  }
}

/**
 * Lekér egy adott eseményt a megadott azonosító alapján.
 */
export async function apiFetchEvent(id) {
  try {
    const response = await fetch(`${API_BASE}/events/${id}`, { headers: { 'Accept': 'application/json' } });
    return response.json();
  } catch (error) {
    return { success: false };
  }
}

/**
 * Lekéri a bejelentkezett felhasználó által létrehozott eseményeket.
 */
export async function apiFetchMyEvents() {
  try {
    const response = await fetch(`${API_BASE}/events/user/my`, {
      headers: { ...getAuthHeaders(), 'Accept': 'application/json' },
    });
    const data = await response.json();
    return data.success ? data.events : [];
  } catch (error) {
    return [];
  }
}

/**
 * Új esemény létrehozása FormData formátumban (képfeltöltés miatt).
 */
export async function apiCreateEvent(formData) {
  try {
    const response = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Accept': 'application/json' },
      body: formData,
    });
    return response.json();
  } catch (error) {
    return { success: false, message: 'Hálózati hiba történt a létrehozás során.' };
  }
}

/**
 * Meglévő esemény módosítása. _method=PUT hozzáadása a FormData-hoz.
 */
export async function apiUpdateEvent(id, formData) {
  formData.append('_method', 'PUT');
  try {
    const response = await fetch(`${API_BASE}/events/${id}`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Accept': 'application/json' },
      body: formData,
    });
    return response.json();
  } catch (error) {
    return { success: false, message: 'Hálózati hiba történt a módosítás során.' };
  }
}

/**
 * Esemény törlése.
 */
export async function apiDeleteEvent(id) {
  try {
    const response = await fetch(`${API_BASE}/events/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders(), 'Accept': 'application/json' },
    });
    return response.json();
  } catch (error) {
    return { success: false, message: 'Hálózati hiba történt a törlés során.' };
  }
}

// ============================================
// Kedvencek API hívások
// ============================================

/**
 * Lekéri a bejelentkezett felhasználó kedvenc eseményeinek listáját.
 */
export async function apiFetchFavorites() {
  try {
    const response = await fetch(`${API_BASE}/favorites`, {
      headers: { ...getAuthHeaders(), 'Accept': 'application/json' },
    });
    const data = await response.json();
    return data.success ? data.events : [];
  } catch (error) {
    console.error('Hiba a kedvencek lekérésekor', error);
    return [];
  }
}

/**
 * Esemény hozzáadása a kedvencekhez.
 */
export async function apiAddFavorite(eventId) {
  try {
    const response = await fetch(`${API_BASE}/favorites`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ event_id: eventId }),
    });
    return response.json();
  } catch (error) {
    return { success: false, message: 'Hálózati hiba: Jelenleg nem érhető el a szerver.' };
  }
}

/**
 * Esemény eltávolítása a kedvencek közül.
 */
export async function apiRemoveFavorite(eventId) {
  try {
    const response = await fetch(`${API_BASE}/favorites/${eventId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders(), 'Accept': 'application/json' },
    });
    return response.json();
  } catch (error) {
    return { success: false, message: 'Hálózati hiba: Jelenleg nem érhető el a szerver.' };
  }
}

// ============================================
// Feltöltések és egyéb API hívások
// ============================================

/**
 * Kép feltöltése a szerverre profilképhez vagy eseményhez.
 */
export async function apiUploadImage(file) {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Accept': 'application/json' },
      body: formData,
    });
    return response.json();
  } catch (error) {
    return { success: false, message: 'Hálózati hiba: Kép feltöltése sikertelen.' };
  }
}

/**
 * Publikus felhasználók lekérése.
 */
export async function apiFetchUsers() {
  try {
    const response = await fetch(`${API_BASE}/users`, { headers: { 'Accept': 'application/json' } });
    const data = await response.json();
    return data.success ? data.users : [];
  } catch (error) {
    return [];
  }
}

// ============================================
// Értékelések, Vásárlás és Részvétel API hívások
// ============================================

/**
 * Adott eseményhez tartozó vélemények lekérése.
 */

export async function apiFetchReviews(eventId) {
  try {
    const response = await fetch(`${API_BASE}/events/${eventId}/reviews`, { headers: { 'Accept': 'application/json' } });
    const data = await response.json();
    return data.success ? data.reviews : [];
  } catch (error) {
    return [];
  }
}

/**
 * Platformszinten a legutóbbi értékelések lekérése (vélhetően a főoldali Közösség fülhöz).
 */

export async function apiFetchRecentReviews() {
  try {
    const response = await fetch(`${API_BASE}/reviews/recent`, { headers: { 'Accept': 'application/json' } });
    const data = await response.json();
    return data.success ? data.reviews : [];
  } catch (error) {
    return [];
  }
}

/**
 * Bejelentkezett felhasználó vásárolt jegyeinek lekérése.
 */
export async function apiFetchMyTickets() {
  try {
    const response = await fetch(`${API_BASE}/tickets`, {
      headers: { ...getAuthHeaders(), 'Accept': 'application/json' }
    });
    const data = await response.json();
    return data.success ? data.tickets : [];
  } catch (error) {
    return [];
  }
}

/**
 * Esemény jegyvásárlás folyamata, közvetlenül 1 elemre
 */
export async function apiBuyTicket(eventId, quantity = 1) {
  try {
    const response = await fetch(`${API_BASE}/events/${eventId}/buy`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ quantity })
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Hálózati hiba: A jegyvásárlás nem sikerült.' };
  }
}

/**
 * Kosár véglegesítése (Checkout folyamat futtatása) és fizetési adatok beküldése
 */
export async function apiCheckoutCart(items, customer = {}) {
  try {
    const response = await fetch(`${API_BASE}/checkout`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ items, customer })
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Hálózati hiba a fizetés feldolgozásakor.' };
  }
}

/**
 * Értékelés / Vélemény beküldése egy eseményről a részvétel után
 */
export async function apiSubmitReview(eventId, rating, comment) {
  try {
    const response = await fetch(`${API_BASE}/events/${eventId}/reviews`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ rating, comment }),
    });
    const data = await response.json();
    
    // Ha a HTTP kód nem sikeres és nem oké, kezeljük le
    if (!response.ok) {
        return { success: false, ...data, message: data.message || 'Hiba történt az értékelés mentése során.' };
    }
    return data;
  } catch (error) {
    return { success: false, message: 'Hálózati hiba.' };
  }
}

/**
 * A rendszerben lévő legutolsó becsekkolások (részvételek) lekérése
 */
export async function apiFetchRecentAttendances() {
  try {
    const response = await fetch(`${API_BASE}/attendances/recent`, {
      headers: { 'Accept': 'application/json' }
    });
    const data = await response.json();
    return data.success ? data.attendances : [];
  } catch (error) {
    return [];
  }
}

/**
 * Lekéri, hogy a bejelentkezett felhasználó becsekkolt-e (részt vesz-e) a megadott eseményen
 */
export async function apiCheckAttendance(eventId) {
  try {
    const response = await fetch(`${API_BASE}/events/${eventId}/attend`, {
      headers: { ...getAuthHeaders(), 'Accept': 'application/json' }
    });
    return await response.json();
  } catch (error) {
    return { success: false };
  }
}

/**
 * Részvétel (attendance) státusz állítása aktívra vagy inaktívra
 */
export async function apiToggleAttendance(eventId, status) {
  try {
    const response = await fetch(`${API_BASE}/events/${eventId}/attend`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Hálózati hiba a részvétel mentésekor.' };
  }
}


// ============================================
// Adminisztrációs felület API hívások
// ============================================

export async function apiGetAdminDashboard() {
  try {
    const response = await fetch(`${API_BASE}/admin/dashboard`, { headers: { ...getAuthHeaders(), 'Accept': 'application/json' } });
    return await response.json();
  } catch (error) {
    return { success: false };
  }
}

export async function apiGetAdminUsers() {
  try {
    const response = await fetch(`${API_BASE}/admin/users`, { headers: { ...getAuthHeaders(), 'Accept': 'application/json' } });
    return await response.json();
  } catch (error) {
    return { success: false };
  }
}

export async function apiDeleteAdminUser(id) {
  try {
    const response = await fetch(`${API_BASE}/admin/users/${id}`, { method: 'DELETE', headers: { ...getAuthHeaders(), 'Accept': 'application/json' } });
    return await response.json();
  } catch (error) {
    return { success: false };
  }
}

export async function apiGetAdminEvents() {
  try {
    const response = await fetch(`${API_BASE}/admin/events`, { headers: { ...getAuthHeaders(), 'Accept': 'application/json' } });
    return await response.json();
  } catch (error) {
    return { success: false };
  }
}

export async function apiDeleteAdminEvent(id) {
  try {
    const response = await fetch(`${API_BASE}/admin/events/${id}`, { method: 'DELETE', headers: { ...getAuthHeaders(), 'Accept': 'application/json' } });
    return await response.json();
  } catch (error) {
    return { success: false };
  }
}

export async function apiSuspendAdminUser(id, days) {
  try {
    const response = await fetch(`${API_BASE}/admin/users/${id}/suspend`, {
        method: 'POST', 
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ days })
    });
    return await response.json();
  } catch (error) {
    return { success: false };
  }
}

export async function apiSuspendAdminEvent(id, days) {
  try {
    const response = await fetch(`${API_BASE}/admin/events/${id}/suspend`, {
        method: 'POST', 
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ days })
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

