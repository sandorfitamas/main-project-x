
import { reactive, toRefs } from 'vue';
import { apiFetchEvents, apiFetchMyEvents, apiCreateEvent, apiUpdateEvent, apiDeleteEvent, apiUploadImage } from '../services/api.js';

/**
 * Globális állapotkezelő az eseményekhez (összes, saját, keresés, kategória).
 */
const eventsState = reactive({
  allEvents: [],
  myEvents: [],
  activeCategory: 'all',
  searchQuery: '',
});

/**
 * Events store Composition API hook.
 * @returns {Object} - Események állapota és CRUD műveletek.
 */
export function useEvents() {
  /**
   * Betölti az összes eseményt az API-ból.
   */
  async function loadAllEvents() {
    eventsState.allEvents = await apiFetchEvents();
  }

  /**
   * Betölti a bejelentkezett felhasználó saját eseményeit.
   */
  async function loadMyEvents() {
    eventsState.myEvents = await apiFetchMyEvents();
  }

  /**
   * Új esemény létrehozása (opcionális képfeltöltéssel).
   * @param {FormData} formData
   * @param {File|null} imageFile
   * @returns {Promise<Object>} API válasz
   */
  async function createEvent(formData, imageFile) {
    if (imageFile) {
      const uploadResult = await apiUploadImage(imageFile);
      if (uploadResult.success) formData.set('image_url', uploadResult.url);
      formData.delete('image');
    }
    const response = await apiCreateEvent(formData);
    if (response.success) {
      await loadAllEvents();
      await loadMyEvents();
    }
    return response;
  }

  /**
   * Esemény szerkesztése (opcionális képfeltöltéssel vagy meglévő kép megtartásával).
   * @param {number|string} id
   * @param {FormData} formData
   * @param {File|null} imageFile
   * @param {string|null} existingImageUrl
   * @returns {Promise<Object>} API válasz
   */
  async function updateEvent(id, formData, imageFile, existingImageUrl) {
    if (imageFile) {
      const uploadResult = await apiUploadImage(imageFile);
      if (uploadResult.success) formData.set('image_url', uploadResult.url);
      formData.delete('image');
    } else if (existingImageUrl) {
      formData.set('image_url', existingImageUrl);
    }
    const response = await apiUpdateEvent(id, formData);
    if (response.success) {
      await loadMyEvents();
      await loadAllEvents();
    }
    return response;
  }

  /**
   * Esemény törlése.
   * @param {number|string} id
   * @returns {Promise<Object>} API válasz
   */
  async function deleteEvent(id) {
    const response = await apiDeleteEvent(id);
    if (response.success) {
      await loadMyEvents();
      await loadAllEvents();
    }
    return response;
  }

  /**
   * Aktív kategória beállítása a szűréshez.
   * @param {string} category
   */
  function setCategory(category) {
    eventsState.activeCategory = category;
  }

  /**
   * Keresési lekérdezés beállítása.
   * @param {string} query
   */
  function setSearch(query) {
    eventsState.searchQuery = query;
  }

  return {
    ...toRefs(eventsState),
    loadAllEvents,
    loadMyEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    setCategory,
    setSearch,
  };
}
