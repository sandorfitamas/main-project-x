<template>
  <div class="col">
    <div class="event-card h-100" :data-event-id="event.id" @click="$emit('details', event)" style="cursor: pointer;">
      <div class="event-card-img">
        <img :src="imgSrc" :alt="event.title || ''" loading="lazy" @error="onImgError" />
        <div class="card-img-gradient"></div>
        <button
          v-if="!isOwnEvent"
          :class="['favorite-btn', { active: isFav }]"
          :title="isFav ? 'Eltávolítás a kedvencekből' : 'Kedvencekhez adás'"
          @click.stop="onFavoriteClick"
        >
          <i :class="['bi', isFav ? 'bi-heart-fill' : 'bi-heart']"></i>
        </button>
        <span class="position-absolute bottom-0 start-0 m-3 badge badge-cat px-3 py-2">{{ event.category || 'Egyéb' }}</span>
      </div>
      <div class="event-card-body">
        <div class="d-flex align-items-start justify-content-between gap-2 mb-2">
          <h5 class="text-white fw-bold mb-0 lh-sm" style="font-size:1.05rem">{{ event.title || '' }}</h5>
          <div v-if="rating > 0" class="d-flex align-items-center text-warning fs-6 gap-1 flex-shrink-0">
            <div class="d-flex">
              <i v-for="i in 5" :key="i" class="bi" :class="getStarClass(i, rating)" style="font-size: 0.8rem"></i>
            </div>
            <span class="small fw-bold">{{ rating.toFixed(1) }}</span>
          </div>
        </div>
        <div class="d-flex align-items-center gap-1 text-secondary mb-1" style="font-size:.8rem">
          <i class="bi bi-geo-alt-fill" style="color:#d946ef"></i>
          <span>{{ event.location || '' }}</span>
        </div>
        <div class="d-flex align-items-center gap-3 text-secondary mb-3" style="font-size:.8rem">
          <span><i class="bi bi-calendar3 me-1"></i>{{ formattedDate }}</span>
          <span><i class="bi bi-clock me-1"></i>{{ formattedTime }}</span>
        </div>
        <div v-if="cleanTags.length" class="d-flex flex-wrap gap-1 mb-3">
          <span v-for="tag in cleanTags" :key="tag" class="tag-pill">{{ tag }}</span>
        </div>
        <div class="d-flex align-items-center gap-2 mt-auto">
          <button class="btn btn-gradient btn-sm flex-grow-1" @click.stop="$emit('details', event)">
            <i class="bi bi-info-circle me-1"></i>Részletek
          </button>
          <button
            v-if="isMine"
            class="btn btn-sm btn-outline-light ms-auto"
            style="font-size:.75rem;padding:3px 10px"
            @click.stop="$emit('edit', event)"
          >
            <i class="bi bi-pencil me-1"></i>Szerkesztés
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue';
import { PLACEHOLDER_IMAGE } from '../services/api.js';
import { useFavorites } from '../stores/favorites.js';
import { useAuth } from '../stores/auth.js';

const props = defineProps({
  event: { type: Object, required: true },
  isMine: { type: Boolean, default: false },
});

const emit = defineEmits(['details', 'edit']);

const { currentUser } = useAuth();
const { isFavorite, toggleFavorite } = useFavorites();

const showAuthModal = inject('showAuthModal');
const showToast = inject('showToast');

/**
 * Számított tulajdonságok a kártya megjelenítéséhez.
 */
const imgSrc = computed(() => props.event.imageUrl || PLACEHOLDER_IMAGE);
const rating = computed(() => parseFloat(props.event.rating) || 0);

/**
 * Ellenőrzi, hogy az adott esemény a bejelentkezett felhasználó kedvencei között van-e.
 */
const isFav = computed(() => isFavorite(props.event.id));

/**
 * Ellenőrzi, hogy a bejelentkezett felhasználó a létrehozója-e az eseménynek.
 */
const isOwnEvent = computed(() => {
  return currentUser.value && String(props.event.user_id) === String(currentUser.value.id);
});

/**
 * Legfeljebb 3 tisztított címkét (tag-et) ad vissza az eseményből a kártyán való megjelenítéshez.
 */
const cleanTags = computed(() => {
  const eventTags = props.event.tags;
  const tagsList = Array.isArray(eventTags) ? eventTags : (eventTags ? eventTags.split(',') : []);
  return tagsList.map(tag => tag.trim()).filter(Boolean).slice(0, 3);
});

/**
 * Formázott dátumvisszaadás (pl. Jan 01) a rövidebb kártya formátumhoz.
 */
const formattedDate = computed(() => {
  if (!props.event.date) return '';
  try {
    const dateObj = new Date(props.event.date);
    return dateObj.toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' });
  } catch { 
    return props.event.date; 
  }
});

/**
 * Formázott idő (Óra:Perc formátum).
 */
const formattedTime = computed(() => {
  return props.event.time ? props.event.time.substring(0, 5) : '';
});

/**
 * Kép betöltési hiba esetén beállítja az alapértelmezett helyettesítő képet.
 */
function onImgError(event) {
  event.target.src = PLACEHOLDER_IMAGE;
}

/**
 * Visszaadja a megfelelő csillag ikon osztályt (pl. tört csillagok esetén) a kártyához.
 */
function getStarClass(index, currentRating) {
  if (currentRating >= index) return 'bi-star-fill';
  if (currentRating >= index - 0.5) return 'bi-star-half';
  return 'bi-star';
}

/**
 * Kezeli a Kedvencek gomb kattintását.
 * Nem bejelentkezett felhasználó esetén megjeleníti a bejelentkezési modalt.
 */
async function onFavoriteClick() {
  if (!currentUser.value) {
    showAuthModal();
    return;
  }
  
  const result = await toggleFavorite(props.event.id);
  
  if (result.removed) {
    showToast('Eltávolítva a kedvencekből', 'info');
  } else {
    showToast('Kedvencekhez adva!', 'success');
  }
}
</script>
