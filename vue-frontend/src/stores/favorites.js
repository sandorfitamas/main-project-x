
import { reactive, toRefs } from 'vue';
import { apiFetchFavorites, apiAddFavorite, apiRemoveFavorite } from '../services/api.js';

/**
 * Globális állapotkezelő a kedvenc eseményekhez.
 */
const favoritesState = reactive({
  favoriteEventIds: new Set(),
  favoriteEvents: [],
});

/**
 * Favorites store Composition API hook.
 * @returns {Object} - Kedvencek állapota és műveletek.
 */
export function useFavorites() {
  /**
   * Betölti a kedvenc események azonosítóit az API-ból.
   */
  async function loadFavoriteIds() {
    const favorites = await apiFetchFavorites();
    favoritesState.favoriteEventIds = new Set(favorites.map(event => event.id));
  }

  /**
   * Betölti a teljes kedvenc esemény objektumokat az API-ból.
   */
  async function loadFavorites() {
    const favorites = await apiFetchFavorites();
    favoritesState.favoriteEvents = favorites;
    favoritesState.favoriteEventIds = new Set(favorites.map(event => event.id));
  }

  /**
   * Ellenőrzi, hogy egy esemény a kedvencek között van-e.
   * @param {number|string} eventId
   * @returns {boolean}
   */
  function isFavorite(eventId) {
    return favoritesState.favoriteEventIds.has(eventId);
  }

  /**
   * Esemény hozzáadása vagy eltávolítása a kedvencek közül.
   * @param {number|string} eventId
   * @returns {Promise<{added?: boolean, removed?: boolean}>}
   */
  async function toggleFavorite(eventId) {
    const alreadyFavorite = favoritesState.favoriteEventIds.has(eventId);
    if (alreadyFavorite) {
      await apiRemoveFavorite(eventId);
      favoritesState.favoriteEventIds.delete(eventId);
      return { removed: true };
    } else {
      await apiAddFavorite(eventId);
      favoritesState.favoriteEventIds.add(eventId);
      return { added: true };
    }
  }

  return {
    ...toRefs(favoritesState),
    loadFavoriteIds,
    loadFavorites,
    isFavorite,
    toggleFavorite,
  };
}
