import { reactive, toRefs } from 'vue';
import { apiFetchEvents, apiFetchMyEvents, apiCreateEvent, apiUpdateEvent, apiDeleteEvent, apiUploadImage } from '../services/api.js';

const state = reactive({
  allEvents: [],
  myEvents: [],
  activeCategory: 'all',
  searchQuery: '',
});

export function useEvents() {
  async function loadAllEvents() {
    state.allEvents = await apiFetchEvents();
  }

  async function loadMyEvents() {
    state.myEvents = await apiFetchMyEvents();
  }

  async function createEvent(formData, imageFile) {
    if (imageFile) {
      const up = await apiUploadImage(imageFile);
      if (up.success) formData.set('image_url', up.url);
      formData.delete('image');
    }
    const result = await apiCreateEvent(formData);
    if (result.success) {
      await loadAllEvents();
      await loadMyEvents();
    }
    return result;
  }

  async function updateEvent(id, formData, imageFile, existingImageUrl) {
    if (imageFile) {
      const up = await apiUploadImage(imageFile);
      if (up.success) formData.set('image_url', up.url);
      formData.delete('image');
    } else if (existingImageUrl) {
      formData.set('image_url', existingImageUrl);
    }
    const result = await apiUpdateEvent(id, formData);
    if (result.success) {
      await loadMyEvents();
      await loadAllEvents();
    }
    return result;
  }

  async function deleteEvent(id) {
    const result = await apiDeleteEvent(id);
    if (result.success) {
      await loadMyEvents();
      await loadAllEvents();
    }
    return result;
  }

  function setCategory(cat) {
    state.activeCategory = cat;
  }

  function setSearch(query) {
    state.searchQuery = query;
  }

  return {
    ...toRefs(state),
    loadAllEvents,
    loadMyEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    setCategory,
    setSearch,
  };
}
