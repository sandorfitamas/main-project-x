import { reactive, toRefs } from 'vue';
import { apiLogin, apiRegister, apiLogout, apiGetCurrentUser, apiUpdateProfile, STORAGE_KEYS } from '../services/api.js';

const state = reactive({
  currentUser: null,
});

export function useAuth() {
  async function login(email, password) {
    const result = await apiLogin(email, password);
    if (result.success) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, result.token);
      state.currentUser = result.user;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(result.user));
    }
    return result;
  }

  async function register(name, email, password) {
    const result = await apiRegister(name, email, password);
    if (result.success) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, result.token);
      state.currentUser = result.user;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(result.user));
    }
    return result;
  }

  async function logout() {
    await apiLogout();
    state.currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  async function restoreSession() {
    const user = await apiGetCurrentUser();
    state.currentUser = user;
    return user;
  }

  async function updateProfile(data) {
    const result = await apiUpdateProfile(data);
    if (result.success) {
      state.currentUser = result.user;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(result.user));
    }
    return result;
  }

  return {
    ...toRefs(state),
    login,
    register,
    logout,
    restoreSession,
    updateProfile,
  };
}
