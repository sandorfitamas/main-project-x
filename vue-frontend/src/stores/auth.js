
import { reactive, toRefs } from 'vue';
import { apiLogin, apiRegister, apiLogout, apiGetCurrentUser, apiUpdateProfile, STORAGE_KEYS } from '../services/api.js';

/**
 * Globális állapotkezelő a bejelentkezett felhasználóhoz.
 */
const authState = reactive({
  currentUser: null,
});

/**
 * Auth store Composition API hook.
 * @returns {Object} - Auth state és műveletek.
 */
export function useAuth() {
  /**
   * Felhasználó bejelentkeztetése.
   * Sikeres azonosítás esetén elmenti a kapott tokent és a user adatokat.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} API válasz
   */
  async function login(email, password) {
    const response = await apiLogin(email, password);
    if (response.success) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(response.user));
      authState.currentUser = response.user;
    }
    return response;
  }

  /**
   * Új felhasználó regisztrációja és automatikus bejelentkeztetés.
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} API válasz
   */
  async function register(name, email, password) {
    const response = await apiRegister(name, email, password);
    if (response.success) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(response.user));
      authState.currentUser = response.user;
    }
    return response;
  }

  /**
   * Kijelentkezteti a felhasználót, törli a session adatokat.
   * @returns {Promise<void>}
   */
  async function logout() {
    await apiLogout();
    authState.currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  /**
   * Oldal újratöltésekor visszaállítja a felhasználót a backend token alapján.
   * @returns {Promise<Object>} - Aktuális user vagy null
   */
  async function restoreSession() {
    const user = await apiGetCurrentUser();
    authState.currentUser = user;
    return user;
  }

  /**
   * Profil adatok frissítése (pl. jelszó, név, profilkép módosítás).
   * @param {Object|FormData} data
   * @returns {Promise<Object>} API válasz
   */
  async function updateProfile(data) {
    const response = await apiUpdateProfile(data);
    if (response.success) {
      authState.currentUser = response.user;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(response.user));
    }
    return response;
  }

  return {
    ...toRefs(authState),
    login,
    register,
    logout,
    restoreSession,
    updateProfile,
  };
}
