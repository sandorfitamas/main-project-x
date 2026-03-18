<template>
  <div class="col">
    <div class="event-card h-100" :data-event-id="event.id">
      <div class="event-card-img">
        <img :src="imgSrc" :alt="event.title || ''" loading="lazy" @error="onImgError" />
        <div class="card-img-gradient"></div>
        <button
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

const imgSrc = computed(() => props.event.imageUrl || PLACEHOLDER_IMAGE);
const rating = computed(() => parseFloat(props.event.rating) || 0);
const isFav = computed(() => isFavorite(props.event.id));

const cleanTags = computed(() => {
  const tags = props.event.tags;
  const list = Array.isArray(tags) ? tags : (tags ? tags.split(',') : []);
  return list.map(t => t.trim()).filter(Boolean).slice(0, 3);
});

const formattedDate = computed(() => {
  if (!props.event.date) return '';
  try {
    const d = new Date(props.event.date);
    return d.toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' });
  } catch { return props.event.date; }
});

const formattedTime = computed(() => {
  return props.event.time ? props.event.time.substring(0, 5) : '';
});

function onImgError(e) {
  e.target.src = PLACEHOLDER_IMAGE;
}

function getStarClass(index, rating) {
  if (rating >= index) return 'bi-star-fill';
  if (rating >= index - 0.5) return 'bi-star-half';
  return 'bi-star';
}

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
