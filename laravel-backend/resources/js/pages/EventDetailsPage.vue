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
            <img :src="ev.imageUrl || placeholder" :alt="ev.title" class="w-100" style="object-fit:cover;max-height:450px" />
            <span class="position-absolute top-0 end-0 m-3 badge badge-cat px-3 py-2">{{ ev.category || 'Egyéb' }}</span>
          </div>
          <div class="p-4 rounded-4 border border-secondary border-opacity-25 mb-4" style="background:rgba(30,41,59,.5)">
            <h5 class="text-white fw-bold mb-3"><i class="bi bi-file-text me-2" style="color:#d946ef"></i>Leírás</h5>
            <p class="text-light lh-lg mb-0">{{ ev.description || 'Nincs leírás.' }}</p>
          </div>
          <div v-if="tags.length" class="mb-4">
            <h6 class="text-secondary mb-2"><i class="bi bi-tags me-1" style="color:#d946ef"></i>Címkék</h6>
            <div class="d-flex flex-wrap gap-2"><span v-for="t in tags" :key="t" class="tag-pill">{{ t }}</span></div>
          </div>

          <div class="mt-5 border-top border-secondary pt-4">
            <h5 class="text-white fw-bold mb-4"><i class="bi bi-star me-2 text-warning"></i>Vélemények</h5>

            <div v-if="currentUser && !hasReviewed" class="p-4 rounded-4 border border-secondary border-opacity-25 mb-4" style="background:rgba(30,41,59,.5)">
              <h6 class="text-white mb-3 fw-bold"><i class="bi bi-pencil-square me-2" style="color:#d946ef"></i>Írj értékelést</h6>
              <div class="mb-3 d-flex gap-2">
                <i v-for="i in 5" :key="i" class="bi fs-4 cursor-pointer" :class="reviewRating >= i ? 'bi-star-fill text-warning' : 'bi-star text-secondary opacity-50'" @click="reviewRating = i"></i>
              </div>
              <textarea v-model="reviewComment" class="form-control review-textarea text-white border-secondary border-opacity-25 mb-4 p-3 shadow-none" style="background:rgba(15,23,42,.6); border-radius: 0.75rem;" rows="3" placeholder="Oszd meg a tapasztalataidat..."></textarea>
              <div class="d-flex justify-content-end">
                <button class="btn btn-gradient px-4 py-2 fw-semibold rounded-pill" @click="submitReview" :disabled="!reviewRating || !reviewComment.trim() || isSubmittingReview">
                  <i class="bi bi-send me-2"></i>{{ isSubmittingReview ? 'Küldés...' : 'Értékelés beküldése' }}
                </button>
              </div>
            </div>
            
            <div v-else-if="currentUser && hasReviewed" class="p-4 rounded-4 border border-secondary border-opacity-25 mb-4 text-center text-light" style="background:rgba(30,41,59,.5)">
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
              <h1 class="h2 text-white fw-bold mb-0">{{ ev.title }}</h1>
              <div v-if="ratingNum > 0" class="text-warning fw-bold white-space-nowrap d-flex align-items-center gap-1">
                <div class="d-flex text-warning fs-5">
                  <i v-for="i in 5" :key="i" class="bi" :class="getStarClass(i, ratingNum)"></i>
                </div>
                <span class="ms-1 pt-1">{{ ratingNum.toFixed(1) }}</span>
              </div>
            </div>
            <p class="text-secondary mb-4"><i class="bi bi-person me-1" style="color:#d946ef"></i>Szervező: <span class="text-white fw-semibold">{{ ev.organizer || 'Ismeretlen' }}</span></p>
            <div class="d-flex flex-column gap-3 mb-4">
              <div class="d-flex align-items-center gap-3 p-3 rounded-3" style="background:rgba(124,58,237,.15);border:1px solid rgba(124,58,237,.3)"><i class="bi bi-calendar3 fs-5 flex-shrink-0" style="color:#a78bfa"></i><div><div class="text-light opacity-75 small">Dátum</div><div class="text-white fw-bold fs-5">{{ fmtDate }}</div></div></div>
              <div class="d-flex align-items-center gap-3 p-3 rounded-3" style="background:rgba(217,70,239,.15);border:1px solid rgba(217,70,239,.3)"><i class="bi bi-clock fs-5 flex-shrink-0" style="color:#e879f9"></i><div><div class="text-light opacity-75 small">Időpont</div><div class="text-white fw-bold fs-5">{{ fmtTime }}</div></div></div>
              <div class="d-flex align-items-center gap-3 p-3 rounded-3" style="background:rgba(236,72,153,.15);border:1px solid rgba(236,72,153,.3)"><i class="bi bi-geo-alt fs-5 flex-shrink-0" style="color:#f9a8d4"></i><div><div class="text-light opacity-75 small">Helyszín</div><div class="text-white fw-bold fs-5">{{ ev.location || 'Helyszín TBD' }}</div></div></div>
              <div class="d-flex align-items-center gap-3 p-3 rounded-3" style="background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.3)"><i class="bi bi-ticket-perforated fs-5 flex-shrink-0" style="color:#6ee7b7"></i><div><div class="text-light opacity-75 small">Belépő</div><div class="text-white fw-bold fs-5">{{ ev.price || 'Ingyenes' }}</div></div></div>
              <div v-if="ev.contact_phone" class="d-flex align-items-center gap-3 p-3 rounded-3" style="background:rgba(6,182,212,.15);border:1px solid rgba(6,182,212,.3)"><i class="bi bi-telephone fs-5 flex-shrink-0" style="color:#67e8f9"></i><div><div class="text-light opacity-75 small">Kapcsolat</div><div class="text-white fw-bold fs-5">{{ ev.contact_phone }}</div></div></div>
            </div>
            <button class="btn btn-gradient w-100 py-3 fw-semibold" @click="shareEvent"><i class="bi bi-share me-2"></i> Esemény Megosztása</button>
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
import { ref, computed, onMounted, inject } from 'vue';
import { useRoute } from 'vue-router';
import { apiFetchEvent, PLACEHOLDER_IMAGE, apiFetchReviews, apiSubmitReview, apiToggleAttendance, apiCheckAttendance } from '../services/api.js';
import { useAuth } from '../stores/auth.js';

const route = useRoute();
const showToast = inject('showToast');
const placeholder = PLACEHOLDER_IMAGE;
const loading = ref(true);
const error = ref(false);
const ev = ref({});

const { currentUser } = useAuth();
const reviews = ref([]);
const reviewsLoading = ref(true);
const reviewRating = ref(0);
const reviewComment = ref('');
const isSubmittingReview = ref(false);
const isAttending = ref(false);
const isTogglingAttendance = ref(false);

const hasReviewed = computed(() => {
  if (!currentUser.value || !reviews.value) return false;
  return reviews.value.some(r => r.user_id === currentUser.value.id);
});

const ratingNum = computed(() => parseFloat(ev.value.rating) || 0);
const fmtDate = computed(() => {
  if (!ev.value.date) return '';
  try { return new Date(ev.value.date).toLocaleDateString('hu-HU', { year:'numeric',month:'long',day:'numeric' }); } catch { return ev.value.date; }
});
const fmtTime = computed(() => ev.value.time ? ev.value.time.substring(0,5) : 'Nincs megadva');
const tags = computed(() => {
  const t = ev.value.tags;
  const l = Array.isArray(t) ? t : (t ? t.split(',') : []);
  return l.map(x => x.trim()).filter(Boolean);
});

function shareEvent() {
  const url = window.location.href;
  if (navigator.share) { navigator.share({ title: ev.value.title, url }); }
  else { navigator.clipboard.writeText(url).then(() => showToast('Link másolva!', 'success')); }
}

async function toggleAttendance() {
  if (!currentUser) return showToast('Kérjük jelentkezz be a folytatáshoz!', 'error');
  if (isTogglingAttendance.value) return;
  isTogglingAttendance.value = true;
  try {
    const res = await apiToggleAttendance(ev.value.id);
    if (res.success !== false) {
      isAttending.value = res.attending;
      if(res.attendees_count !== undefined) ev.value.attendees_count = res.attendees_count;
      showToast(res.message || (res.attending ? 'Sikeresen jelezted részvételed!' : 'Visszavontad a részvételed.'), 'success');
    }
  } catch(e) {}
  isTogglingAttendance.value = false;
}

function getStarClass(index, rating) {
  if (rating >= index) return 'bi-star-fill';
  if (rating >= index - 0.5) return 'bi-star-half';
  return 'bi-star';
}

async function loadReviews(id) {
  reviewsLoading.value = true;
  try {
    const data = await apiFetchReviews(id);
    reviews.value = data || [];
  } catch(e) {}
  reviewsLoading.value = false;
}

async function submitReview() {
  if (!reviewRating.value || !reviewComment.value.trim() || isSubmittingReview.value) return;
  isSubmittingReview.value = true;
  try {
    const res = await apiSubmitReview(ev.value.id, reviewRating.value, reviewComment.value);
    if (res.success !== false) {
      showToast('Értékelés sikeresen beküldve!', 'success');
      reviewRating.value = 0;
      reviewComment.value = '';
      await loadReviews(ev.value.id);
      if (res.new_average) {
          ev.value.rating = res.new_average;
      }
    } else {
      showToast(res.message || 'Hiba történt', 'error');
    }
  } catch (err) {
    showToast('Hiba történt', 'error');
  }
  isSubmittingReview.value = false;
}

onMounted(async () => {
  const id = route.params.id;
  if (!id || isNaN(Number(id))) { error.value = true; loading.value = false; return; }
  try {
    const data = await apiFetchEvent(id);
    if (!data.success || !data.event) { 
        error.value = true; 
    } else { 
        ev.value = data.event; 
        document.title = `${data.event.title || 'Esemény'} - Project X`; 
        await loadReviews(id);
        if (currentUser && currentUser.value) {
          const attRes = await apiCheckAttendance(id);
          if (attRes.success !== false) isAttending.value = attRes.attending;
        }
    }
  } catch { error.value = true; }
  loading.value = false;
});
</script>

<style scoped>
.review-textarea::placeholder {
  color: rgba(255, 255, 255, 0.6) !important;
}
</style>


