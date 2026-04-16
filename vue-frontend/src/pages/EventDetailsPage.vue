<template>
  <div>
    <div v-if="loading" class="flex-grow-1 d-flex align-items-center justify-content-center" style="min-height:60vh">
      <div class="text-center">
        <div class="spinner-border mb-3" style="color:#d946ef;width:3rem;height:3rem" role="status"></div>
        <p class="text-secondary">Betöltés...</p>
      </div>
    </div>
    <div v-else-if="error" class="flex-grow-1 d-flex align-items-center justify-content-center" style="min-height:60vh">
      <div class="text-center">
        <i class="bi bi-exclamation-triangle display-3 text-secondary d-block mb-3"></i>
        <h4 class="text-white mb-2">Esemény nem található</h4>
        <p class="text-secondary mb-4">Ez az esemény már nem elérhető, vagy nem létezik.</p>
        <router-link to="/" class="btn btn-gradient px-4">Vissza a főoldalra</router-link>
      </div>
    </div>
    <main v-else class="flex-grow-1 container-xl px-3 px-md-4 py-5">
      <div class="row g-5">
        <div class="col-lg-7">
          <div class="position-relative rounded-4 overflow-hidden border border-secondary mb-4" style="max-height:450px">
            <img :src="eventDetails.imageUrl || placeholder" :alt="eventDetails.title" class="w-100" style="object-fit:cover;max-height:450px" />
            <span class="position-absolute top-0 end-0 m-3 badge badge-cat px-3 py-2">{{ eventDetails.category || 'Egyéb' }}</span>
          </div>
          <div class="p-4 rounded-4 border border-secondary border-opacity-25 mb-4" style="background:rgba(30,41,59,.5)">
            <h5 class="text-white fw-bold mb-3"><i class="bi bi-file-text me-2" style="color:#d946ef"></i>Leírás</h5>
            <p class="text-light lh-lg mb-0">{{ eventDetails.description || 'Nincs leírás.' }}</p>
          </div>
          <div v-if="tags.length" class="mb-4">
            <h6 class="text-secondary mb-2"><i class="bi bi-tags me-1" style="color:#d946ef"></i>Címkék</h6>
            <div class="d-flex flex-wrap gap-2"><span v-for="t in tags" :key="t" class="tag-pill">{{ t }}</span></div>
          </div>

          <div class="mt-5 border-top border-secondary pt-4">
            <h5 class="text-white fw-bold mb-4"><i class="bi bi-star me-2 text-warning"></i>Vélemények</h5>

            <div v-if="currentUser && !isOwnEvent && !hasReviewed" class="p-4 rounded-4 border border-secondary border-opacity-25 mb-4" style="background:rgba(30,41,59,.5)">
              <h6 class="text-white mb-3 fw-bold"><i class="bi bi-pencil-square me-2" style="color:#d946ef"></i>Írj értékelést</h6>
              <div class="mb-3 d-flex gap-2">
                <i v-for="i in 5" :key="i" class="bi fs-4 cursor-pointer" :class="reviewRating >= i ? 'bi-star-fill text-warning' : 'bi-star text-secondary opacity-50'" @click="reviewRating = i"></i>
              </div>
                <textarea v-model="reviewComment" class="form-control review-textarea text-white border-secondary border-opacity-25 mb-4 p-3 shadow-none" style="background:rgba(15,23,42,.6); border-radius: 0.75rem; resize: none;" rows="3" placeholder="Oszd meg a tapasztalataidat..."></textarea>
              <div class="d-flex justify-content-end">
                <button class="btn btn-gradient px-4 py-2 fw-semibold rounded-pill" @click="submitReview" :disabled="!reviewRating || !reviewComment.trim() || isSubmittingReview">
                  <i class="bi bi-send me-2"></i>{{ isSubmittingReview ? 'Küldés...' : 'Értékelés beküldése' }}
                </button>
              </div>
            </div>
            
            <div v-else-if="currentUser && !isOwnEvent && hasReviewed" class="p-4 rounded-4 border border-secondary border-opacity-25 mb-4 text-center text-light" style="background:rgba(30,41,59,.5)">
              <i class="bi bi-check-circle text-success fs-1 mb-2 d-block"></i>
              <p class="mb-0">Már értékelted ezt a helyszínt. Köszönjük a visszajelzést!</p>
            </div>

            <div v-if="reviewsLoading" class="text-secondary">Értékelések betöltése...</div>
            <div v-else-if="reviews.length === 0" class="text-secondary py-2">
              Még nincsenek értékelések.
            </div>
            <div v-else class="d-flex flex-column gap-3">
              <div v-for="r in reviews" :key="r.id" class="p-3 rounded-3 border border-secondary border-opacity-25" style="background:rgba(30,41,59,.3)">
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-white fw-bold">{{ r.user?.name || 'Ismeretlen' }}</span>
                  <div class="text-warning">
                    <i v-for="i in 5" :key="i" class="bi" :class="r.rating >= i ? 'bi-star-fill' : 'bi-star'"></i>
                  </div>
                </div>
                <p class="text-light mb-0 small">{{ r.comment }}</p>
                <div class="text-light opacity-50 small mt-2">{{ new Date(r.created_at).toLocaleDateString('hu-HU') }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-5">
          <div class="sticky-top" style="top:5rem">
            <div class="d-flex align-items-start justify-content-between gap-2 mb-3">
              <h1 class="h2 text-white fw-bold mb-0">{{ eventDetails.title }}</h1>
              <div v-if="ratingNum > 0" class="text-warning fw-bold white-space-nowrap d-flex align-items-center gap-1">
                <div class="d-flex text-warning fs-5">
                  <i v-for="i in 5" :key="i" class="bi" :class="getStarClass(i, ratingNum)"></i>
                </div>
                <span class="ms-1 pt-1">{{ ratingNum.toFixed(1) }}</span>
              </div>
            </div>
            <p class="text-secondary mb-4"><i class="bi bi-person me-1" style="color:#d946ef"></i>Szervező: <span class="text-white fw-semibold">{{ eventDetails.organizer || 'Ismeretlen' }}</span></p>
            <div class="d-flex flex-column gap-3 mb-4">
              <div class="d-flex align-items-center gap-3 p-3 rounded-3" style="background:rgba(124,58,237,.15);border:1px solid rgba(124,58,237,.3)"><i class="bi bi-calendar3 fs-5 flex-shrink-0" style="color:#a78bfa"></i><div><div class="text-light opacity-75 small">Dátum</div><div class="text-white fw-bold fs-5">{{ formattedDate }}</div></div></div>
              <div class="d-flex align-items-center gap-3 p-3 rounded-3" style="background:rgba(217,70,239,.15);border:1px solid rgba(217,70,239,.3)"><i class="bi bi-clock fs-5 flex-shrink-0" style="color:#e879f9"></i><div><div class="text-light opacity-75 small">Időpont</div><div class="text-white fw-bold fs-5">{{ formattedTime }}</div></div></div>
              <div class="d-flex align-items-center gap-3 p-3 rounded-3" style="background:rgba(236,72,153,.15);border:1px solid rgba(236,72,153,.3)"><i class="bi bi-geo-alt fs-5 flex-shrink-0" style="color:#f9a8d4"></i><div><div class="text-light opacity-75 small">Helyszín</div><div class="text-white fw-bold fs-5">{{ eventDetails.location || 'Helyszín TBD' }}</div></div></div>
              <div class="d-flex align-items-center gap-3 p-3 rounded-3" style="background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.3)"><i class="bi bi-ticket-perforated fs-5 flex-shrink-0" style="color:#6ee7b7"></i><div><div class="text-light opacity-75 small">Belépő</div><div class="text-white fw-bold fs-5">{{ eventDetails.price || 'Ingyenes' }}</div></div></div>
              <div v-if="eventDetails.contact_phone" class="d-flex align-items-center gap-3 p-3 rounded-3" style="background:rgba(6,182,212,.15);border:1px solid rgba(6,182,212,.3)"><i class="bi bi-telephone fs-5 flex-shrink-0" style="color:#67e8f9"></i><div><div class="text-light opacity-75 small">Kapcsolat</div><div class="text-white fw-bold fs-5">{{ eventDetails.contact_phone }}</div></div></div>
            </div>
              <button class="btn btn-gradient w-100 py-3 fw-semibold" @click="shareEvent"><i class="bi bi-share me-2"></i> Esemény Megosztása</button>
              
              <div v-if="currentUser && !isOwnEvent" class="d-flex align-items-center gap-3 mt-3">
                <div class="input-group flex-nowrap shadow-sm" style="width: 140px;">
                  <button class="btn text-white ps-3 border-0" style="background: rgba(255,255,255,0.1);" type="button" @click="ticketQty > 1 ? ticketQty-- : null" :disabled="ticketQty <= 1"><i class="bi bi-dash-lg"></i></button>
                  <input type="text" class="form-control text-center text-white border-0 fw-bold px-0 fs-5" style="background: rgba(255,255,255,0.05);" :value="ticketQty" readonly>
                  <button class="btn text-white pe-3 border-0" style="background: rgba(255,255,255,0.1);" type="button" @click="ticketQty < 10 ? ticketQty++ : null" :disabled="ticketQty >= 10"><i class="bi bi-plus-lg"></i></button>
                </div>
                <button class="btn btn-warning flex-grow-1 py-3 fw-bold text-dark shadow-sm fs-5 rounded-3 d-flex justify-content-center align-items-center gap-2" @click="handleAddToCart">
                  <i class="bi bi-bag-plus-fill"></i> Kosárba
                </button>
              </div>

            <button v-if="currentUser && !isOwnEvent" class="btn w-100 py-3 mt-3 fw-semibold" :class="isAttending ? 'btn-success' : 'btn-outline-light'" @click="toggleAttendance">
              <i class="bi" :class="isAttending ? 'bi-check-circle-fill' : 'bi-calendar-plus'"></i> 
              {{ isAttending ? 'Ott Leszek! (Kattints a leiratkozáshoz)' : 'Ott Leszek!' }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, inject } from 'vue';
import { useRoute } from 'vue-router';
import { 
  apiFetchEvent, 
  PLACEHOLDER_IMAGE, 
  apiFetchReviews, 
  apiSubmitReview, 
  apiToggleAttendance, 
  apiCheckAttendance, 
  apiBuyTicket 
} from '../services/api.js';
import { useAuth } from '../stores/auth.js';
import { useCart } from '../stores/cart.js';

const route = useRoute();
const showToast = inject('showToast');
const placeholder = PLACEHOLDER_IMAGE;

const loading = ref(true);
const error = ref(false);
const eventDetails = ref({});

const { currentUser } = useAuth();
const { addToCart } = useCart();

const ticketQty = ref(1);

const reviews = ref([]);
const reviewsLoading = ref(true);
const reviewRating = ref(0);
const reviewComment = ref('');
const isSubmittingReview = ref(false);

/**
 * Szűri a hozzászólás szövegét (max 50 karakter, max 2 számjegy).
 */
watch(reviewComment, (newValue, oldValue) => {
  if (!newValue) return;
  
  let validValue = newValue;
  
  // Maximum hossz korlátozás
  if (validValue.length > 50) {
    validValue = validValue.substring(0, 50);
  }
  
  // Maximum számjegy korlátozás
  const digitMatches = validValue.match(/\d/g);
  if (digitMatches && digitMatches.length > 2) {
    validValue = oldValue || '';
  }
  
  // Ha változott az ellenőrzések során, frissítjük az értéket
  if (validValue !== newValue) {
    reviewComment.value = validValue;
  }
});

const isAttending = ref(false);
const isTogglingAttendance = ref(false);
const isBuyingTicket = ref(false);
const alreadyReviewedError = ref(false);

/**
 * Ellenőrzi, hogy a bejelentkezett felhasználó az esemény szervezője-e.
 */
const isOwnEvent = computed(() => {
  const user = currentUser?.value || currentUser;
  const userId = user?.id || user?.value?.id;
  
  if (!userId || !eventDetails.value?.user_id) {
    return false;
  }
  
  return Number(eventDetails.value.user_id) === Number(userId);
});

/**
 * Ellenőrzi, hogy a felhasználó írt-e már értékelést ehhez az eseményhez.
 */
const hasReviewed = computed(() => {
  if (alreadyReviewedError.value) {
    return true;
  }
  
  const user = currentUser?.value || currentUser;
  const userId = user?.id || user?.value?.id;
  
  if (!userId || !reviews.value) {
    return false;
  }
  
  return reviews.value.some(review => 
    Number(review.user_id) === Number(userId) || 
    (review.user && Number(review.user.id) === Number(userId))
  );
});

const ratingNum = computed(() => parseFloat(eventDetails.value.rating) || 0);

const formattedDate = computed(() => {
  if (!eventDetails.value.date) return '';
  try { 
    return new Date(eventDetails.value.date).toLocaleDateString('hu-HU', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric' 
    }); 
  } catch { 
    return eventDetails.value.date; 
  }
});

const formattedTime = computed(() => {
  return eventDetails.value.time ? eventDetails.value.time.substring(0, 5) : 'Nincs megadva';
});

const tags = computed(() => {
  const eventTags = eventDetails.value.tags;
  const tagsList = Array.isArray(eventTags) ? eventTags : (eventTags ? eventTags.split(',') : []);
  return tagsList.map(tag => tag.trim()).filter(Boolean);
});

/**
 * Megosztja az esemény linkjét a natív megosztó ablakkal vagy vágólapra másolja.
 */
function shareEvent() {
  const currentUrl = window.location.href;
  if (navigator.share) { 
    navigator.share({ title: eventDetails.value.title, url: currentUrl }); 
  } else { 
    navigator.clipboard.writeText(currentUrl).then(() => {
      showToast('Link másolva!', 'success');
    }); 
  }
}

/**
 * Jegy hozzáadása bevásárlókosárhoz.
 */
function handleAddToCart() {
  if (!currentUser) {
    return showToast('Kérjük jelentkezz be a vásárláshoz!', 'error');
  }
  addToCart(eventDetails.value, ticketQty.value);
  showToast(`${ticketQty.value} db jegy hozzáadva a kosárhoz!`, 'success');
  ticketQty.value = 1; // Visszaállás az alap alapértékre
}

/**
 * Résztvevőként jelentkezés vagy leiratkozás az eseményről.
 */
async function toggleAttendance() {
  if (!currentUser) {
    return showToast('Kérjük jelentkezz be a folytatáshoz!', 'error');
  }
  if (isTogglingAttendance.value) return;
  
  isTogglingAttendance.value = true;
  try {
    const response = await apiToggleAttendance(eventDetails.value.id);
    if (response.success !== false) {
      isAttending.value = response.attending;
      if (response.attendees_count !== undefined) {
        eventDetails.value.attendees_count = response.attendees_count;
      }
      showToast(response.message || (response.attending ? 'Sikeresen jelezted részvételed!' : 'Visszavontad a részvételed.'), 'success');
    }
  } catch (error) {
    console.error('Attendance toggle error:', error);
  } finally {
    isTogglingAttendance.value = false;
  }
}

/**
 * Visszaadja a megfelelő csillag ikon osztálynevet (pl. tört értékek esetén).
 */
function getStarClass(index, currentRating) {
  if (currentRating >= index) return 'bi-star-fill';
  if (currentRating >= index - 0.5) return 'bi-star-half';
  return 'bi-star';
}

/**
 * Betölti az eseményhez tartozó összes véleményt az API-ból.
 */
async function loadReviews(eventId) {
  reviewsLoading.value = true;
  try {
    const data = await apiFetchReviews(eventId);
    reviews.value = data || [];
  } catch (error) {
    console.error('Reviews load error:', error);
  } finally {
    reviewsLoading.value = false;
  }
}

/**
 * Új értékelés beküldése az API-nak.
 */
async function submitReview() {
  if (!reviewRating.value || !reviewComment.value.trim() || isSubmittingReview.value) return;
  
  isSubmittingReview.value = true;
  alreadyReviewedError.value = false;
  
  try {
    const response = await apiSubmitReview(eventDetails.value.id, reviewRating.value, reviewComment.value);
    
    if (response.success !== false) {
      showToast('Értékelés sikeresen beküldve!', 'success');
      reviewRating.value = 0;
      reviewComment.value = '';
      alreadyReviewedError.value = true;
      
      await loadReviews(eventDetails.value.id);
      if (response.new_average) {
        eventDetails.value.rating = response.new_average;
      }
    } else {
      if (response.already_reviewed || (response.message && response.message.includes('rt') && response.message.includes('kelted'))) {
        alreadyReviewedError.value = true;
      } else {
        showToast(response.message || 'Hiba történt a beküldés során', 'error');
      }
    }
  } catch (error) {
    showToast('Hálózati vagy szerverhiba történt az értékeléskor', 'error');
  } finally {
    isSubmittingReview.value = false;
  }
}

onMounted(async () => {
  const eventId = route.params.id;
  
  if (!eventId || isNaN(Number(eventId))) { 
    error.value = true; 
    loading.value = false; 
    return; 
  }
  
  try {
    const data = await apiFetchEvent(eventId);
    if (!data.success || !data.event) { 
      error.value = true; 
    } else { 
      eventDetails.value = data.event; 
      document.title = `${data.event.title || 'Esemény'} - Project X`; 
      
      await loadReviews(eventId);
      
      if (currentUser?.value || currentUser) {
        const attendanceResponse = await apiCheckAttendance(eventId);
        if (attendanceResponse.success !== false) {
          isAttending.value = attendanceResponse.attending;
        }
      }
    }
  } catch (err) { 
    console.error(err);
    error.value = true; 
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.review-textarea::placeholder {
  color: rgba(255, 255, 255, 0.6) !important;
}
</style>



