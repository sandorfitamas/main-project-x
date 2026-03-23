import { reactive, toRefs } from 'vue';
import { apiFetchFavorites, apiAddFavorite, apiRemoveFavorite } from '../services/api.js';

const state = reactive({
  favoriteEventIds: new Set(),
  favoriteEvents: [],
});

export function useFavorites() {
  async function loadFavoriteIds() {
    const favs = await apiFetchFavorites();
    state.favoriteEventIds = new Set(favs.map(f => f.id));
  }

  async function loadFavorites() {
    const favs = await apiFetchFavorites();
    state.favoriteEvents = favs;
    state.favoriteEventIds = new Set(favs.map(f => f.id));
  }

  function isFavorite(eventId) {
    return state.favoriteEventIds.has(eventId);
  }

  async function toggleFavorite(eventId) {
    const isFav = state.favoriteEventIds.has(eventId);
    if (isFav) {
      await apiRemoveFavorite(eventId);
      state.favoriteEventIds.delete(eventId);
      return { removed: true };
    } else {
      await apiAddFavorite(eventId);
      state.favoriteEventIds.add(eventId);
      return { added: true };
    }
  }

  return {
    ...toRefs(state),
    loadFavoriteIds,
    loadFavorites,
    isFavorite,
    toggleFavorite,
  };
}
