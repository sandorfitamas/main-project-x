<template>
  <div>
    <div v-if="activeSection === 'home' || !activeSection">
      <!-- Hero rész -->
      <div class="py-5 position-relative overflow-hidden auto-inline-1">

        <div class="position-absolute rounded-circle auto-inline-2"></div>
        <div class="position-absolute rounded-circle auto-inline-3"></div>

        <div class="container-xl position-relative py-5 my-md-4 auto-inline-4">
          <div class="row align-items-center">
            <div class="col-md-10 col-lg-8 mx-auto text-center">
              <span class="badge rounded-pill bg-light bg-opacity-10 text-white mb-3 px-3 py-2 border border-white border-opacity-25 shadow-sm auto-inline-5">
                Project X – Minden ami bulizás
              </span>
              <h1 class="display-3 fw-bolder text-white mb-4 lh-sm auto-inline-6">Fedezd fel a legjobb<br>eseményeket</h1>
              
              <!-- Keresés -->
              <div class="p-2 bg-white bg-opacity-10 rounded-pill shadow-lg mt-4 mx-auto auto-inline-7">
                <div class="d-flex align-items-center">
                  <i class="bi bi-search text-white ms-3 fs-5"></i>
                  <input v-model="localSearch" @keyup.enter="$emit('show-all-events')" @input="setSearch(localSearch)" type="text" class="form-control custom-search-input bg-transparent border-0 text-white shadow-none py-3 px-3 fs-5" placeholder="Keress egy jó bulit..." />
                  <button class="btn btn-gradient rounded-pill px-4 py-2 me-1 fw-bold text-white shadow-sm" @click="$emit('show-all-events')">Keresés</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Kategóriák grid -->
      <div class="container-xl py-5 mt-2">
        <h3 class="fw-bold text-white mb-4">Válassz stílust</h3>
        <div class="row g-3">
          <div class="col-6 col-md-3">
             <div class="rounded-4 p-4 text-center position-relative overflow-hidden auto-inline-8" @click="setCategory('Klub'); $emit('show-all-events')">
               <i class="bi bi-music-note-list display-5 mb-3 d-block auto-inline-9"></i>
               <h5 class="text-white mb-0 fw-semibold">Klubok</h5>
             </div>
          </div>
          <div class="col-6 col-md-3">
             <div class="rounded-4 p-4 text-center position-relative overflow-hidden auto-inline-8" @click="setCategory('Házibuli'); $emit('show-all-events')">
               <i class="bi bi-house-heart display-5 mb-3 d-block auto-inline-10"></i>
               <h5 class="text-white mb-0 fw-semibold">Házibulik</h5>
             </div>
          </div>
          <div class="col-6 col-md-3">
             <div class="rounded-4 p-4 text-center position-relative overflow-hidden auto-inline-8" @click="setCategory('Fesztivál'); $emit('show-all-events')">
               <i class="bi bi-speaker display-5 mb-3 d-block auto-inline-11"></i>
               <h5 class="text-white mb-0 fw-semibold">Fesztiválok</h5>
             </div>
          </div>
          <div class="col-6 col-md-3">
             <div class="rounded-4 p-4 text-center position-relative overflow-hidden auto-inline-8" @click="setCategory('Chill'); $emit('show-all-events')">
               <i class="bi bi-music-player-fill display-5 mb-3 d-block auto-inline-12"></i>
               <h5 class="text-white mb-0 fw-semibold">Chill</h5>
             </div>
          </div>
        </div>
      </div>

      <!-- Felkapott -->
      <div class="container-xl py-5 my-3">
        <div class="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h2 class="h2 fw-bold text-white mb-1"><i class="bi bi-fire text-warning me-2"></i>Felkapott Események</h2>
            <p class="text-secondary mb-0">Ezekre a bulikra pörög most mindenki</p>
          </div>
          <button class="btn btn-link text-fuchsia text-decoration-none d-none d-sm-block fw-bold" @click="$emit('show-all-events')">
            Összes mutatása <i class="bi bi-arrow-right"></i>
          </button>
        </div>
        <div v-if="filteredEvents.length" class="row row-cols-1 row-cols-md-3 g-4">
          <EventCard v-for="event in filteredEvents.slice(0, 3)" :key="'trending-'+event.id" :event="event" @details="openDetails" @edit="openEdit" />
        </div>
        <div v-else class="text-center py-5 rounded-4 auto-inline-13">
          <p class="text-secondary mb-0">Jelenleg nincsenek aktív események.</p>
        </div>
      </div>

      <!-- Értékelések -->
      <div class="container-xl pb-5 mb-5 mt-4" v-if="testimonials.length > 0">
        <h3 class="fw-bold text-white mb-4 text-center">Vélemények az eseményekről</h3>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div v-for="(testimonial, testimonialIndex) in (showAllTestimonials ? testimonials : testimonials.slice(0, 3))" :key="testimonialIndex" class="col">
            <div class="rounded-4 p-4 h-100 d-flex flex-column auto-inline-14">
              <div class="d-flex text-warning mb-3 fs-5">
                <i v-for="star in 5" :key="star" class="bi" :class="star <= testimonial.stars ? 'bi-star-fill' : (star - 0.5 === testimonial.stars ? 'bi-star-half' : 'bi-star')"></i>
              </div>
              <p class="text-light opacity-75 fst-italic mb-4">"{{ testimonial.text }}"</p>
              <div class="d-flex align-items-center gap-3 mt-auto">
                <img v-if="testimonial.profile_picture" :src="testimonial.profile_picture" alt="Profilkép" class="rounded-circle shadow object-fit-cover auto-inline-15">
                <div v-else class="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow" :style="{ width: '40px', height: '40px', background: testimonial.color }">{{ testimonial.initial }}</div>
                <div>
                  <h6 class="text-white mb-0">{{ testimonial.name }}</h6>
                  <small class="text-light opacity-50">{{ testimonial.location }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-end mt-4">
          <button @click="showAllTestimonials = !showAllTestimonials" class="btn btn-outline-light shadow-sm auto-inline-16">
            {{ showAllTestimonials ? 'Kevesebb' : 'Több vélemény' }}
            <i class="bi" :class="showAllTestimonials ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Események oldal -->
    <main v-if="activeSection === 'events'" class="flex-grow-1 container-xl px-3 px-md-4 py-4 pt-5 auto-inline-17">
      <div class="mb-4 text-center">
        <h1 class="h2 fw-bold text-white mb-2">Böngészés & Keresés</h1>
        <p class="text-secondary">Találd meg a stílusodnak megfelelő bulit</p>
      </div>

      <!-- Keresőmező -->
      <div class="mx-auto mb-5 auto-inline-18">
        <div class="position-relative shadow-sm rounded-pill p-1 auto-inline-19">
          <i class="bi bi-search position-absolute text-secondary auto-inline-20"></i>
          <input v-model="localSearch" type="text" class="form-control custom-search-input bg-transparent border-0 text-white py-2 ps-5 shadow-none" placeholder="Keress eseményt, helyszínt vagy hangulatot..." @input="setSearch(localSearch)" />
        </div>
      </div>

      <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <h2 class="h4 fw-bold mb-0"><i class="bi bi-funnel-fill me-2 auto-inline-21"></i>Minden Esemény</h2>
        <div class="d-flex gap-2 flex-wrap">
          <button v-for="cat in availableCategories" :key="cat" :class="['filter-btn', { active: activeCategory === cat }]" @click="setCategory(cat)">
            {{ cat === 'all' ? 'Összes' : cat }}
          </button>
        </div>
      </div>
      <div v-if="filteredEvents.length" class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
        <EventCard v-for="event in filteredEvents" :key="event.id" :event="event" @details="openDetails" @edit="openEdit" />
      </div>
      <div v-else class="text-center py-5 rounded-4 border border-secondary border-opacity-25 mt-4">
        <p class="text-secondary fs-5 mb-1">Nem találtunk ilyen bulit...</p>
        <p class="text-muted small">Próbálj más keresőszót, vagy szervezz te egyet!</p>
      </div>
    </main>

    <!-- Saját események -->
    <section v-if="activeSection === 'my-events'" class="flex-grow-1 container-xl px-3 px-md-4 py-5">
      <div class="mb-4">
        <h2 class="h3 fw-bold mb-1"><i class="bi bi-person-fill me-2 auto-inline-21"></i>Saját események</h2>
        <p class="text-secondary small">Itt láthatod és szerkesztheted az általad létrehozott eseményeket</p>
      </div>
      <div v-if="myEvents.length" class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
        <EventCard v-for="event in myEvents" :key="event.id" :event="event" :is-mine="true" @details="openDetails" @edit="openEdit" />
      </div>
      <div v-else class="text-center py-5 rounded-4 border border-secondary border-opacity-25 mt-3">
          <p class="text-white fs-5 mb-1">Még nincs eseményed</p>
          <p class="text-light opacity-75 small mb-3">Hozz létre az első bulidat!</p>
        <button class="btn btn-gradient px-4 py-2 fw-semibold" @click="$emit('create-event')"><i class="bi bi-plus-lg me-1"></i> Új buli létrehozása</button>
      </div>
    </section>

    <!-- Kedvencek rész -->
    <section v-if="activeSection === 'favorites'" class="flex-grow-1 container-xl px-3 px-md-4 py-5">
      <div class="mb-4">
        <h2 class="h3 fw-bold mb-1"><i class="bi bi-heart-fill text-danger me-2"></i>Kedvenc események</h2>
        <p class="text-secondary small">A kedvenceid közé mentett események</p>
      </div>
      <div v-if="favoriteEvents.length" class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
        <EventCard v-for="event in favoriteEvents" :key="event.id" :event="event" @details="openDetails" @edit="openEdit" />
      </div>
      <div v-else class="text-center py-5 rounded-4 border border-secondary border-opacity-25 mt-3">
        <i class="bi bi-heart display-3 text-white-50 d-block mb-3"></i>
        <p class="text-light fs-5 mb-1">Még nincs kedvenc eseményed</p>
        <p class="text-white-50 small mb-3">Az események melletti szív ikonra kattintva adhatsz hozzá kedvenceket</p>
        <button class="btn btn-gradient px-4 py-2 fw-semibold" @click="$emit('show-all-events')">Események böngészése</button>
      </div>
    </section>

    <!-- Közösség -->
    <section v-if="activeSection === 'community'" class="flex-grow-1 container-xl px-3 px-md-4 py-5">
      <div class="mb-4">
        <h2 class="h3 fw-bold mb-1"><i class="bi bi-people-fill me-2 auto-inline-21"></i>Közösség</h2>
        <p class="text-secondary small">Fedezd fel a buliközösség tagjait és aktivitását</p>
      </div>
      <div class="row g-4 mb-5">
        <div class="col-md-4"><div class="stat-card stat-violet"><div class="d-flex align-items-center justify-content-between"><div><p class="text-secondary small mb-1">Aktív tagok</p><p class="h3 fw-bold text-white mb-0">{{ communityUsers.length }}</p></div><div class="rounded-3 p-2 auto-inline-22"><i class="bi bi-people-fill fs-3 auto-inline-23"></i></div></div></div></div>
        <div class="col-md-4"><div class="stat-card stat-fuchsia"><div class="d-flex align-items-center justify-content-between"><div><p class="text-secondary small mb-1">Összes esemény</p><p class="h3 fw-bold text-white mb-0">{{ communityEventCount }}</p></div><div class="rounded-3 p-2 auto-inline-24"><i class="bi bi-calendar-event-fill fs-3 auto-inline-25"></i></div></div></div></div>
        <div class="col-md-4"><div class="stat-card stat-pink"><div class="d-flex align-items-center justify-content-between"><div><p class="text-secondary small mb-1">Közösségi aktivitás</p><p class="h3 fw-bold text-white mb-0">🔥 {{ totalCommunityActivity }}</p></div><div class="rounded-3 p-2 auto-inline-26"><i class="bi bi-lightning-fill fs-3 auto-inline-27"></i></div></div></div></div>
      </div>
      <h5 class="fw-bold mb-3"><i class="bi bi-star-fill text-warning me-2"></i>Legjobb szervezők</h5>
      <div v-if="topOrganizers.length" class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4 mb-5">
        <div v-for="org in topOrganizers" :key="org.user.id" class="col">
          <div class="p-4 rounded-4 text-center auto-inline-28">
            <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white fs-5 mx-auto mb-3 auto-inline-29">{{ (org.user.name||'?').substring(0,2).toUpperCase() }}</div>
            <p class="text-white fw-semibold mb-0 text-truncate">{{ org.user.name }}</p>
            <p class="text-secondary small mb-2">{{ org.user.email }}</p>
            <span class="badge rounded-pill auto-inline-30"><i class="bi bi-people-fill me-1"></i>{{ org.count }} résztvevő</span>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-4 rounded-3 border border-secondary border-opacity-25 mb-5"><p class="text-secondary">Még nincs szervező a közösségben</p></div>
      <h5 class="fw-bold mb-3"><i class="bi bi-activity me-2 auto-inline-21"></i>Közösségi aktivitás</h5>
      <div v-if="recentActivity.length" class="d-flex flex-column gap-3">
        <div v-for="(act, i) in recentActivity" :key="i" class="d-flex align-items-center gap-3 p-3 rounded-3 auto-inline-31">
          <div class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 auto-inline-32"><i class="bi bi-calendar-plus auto-inline-25"></i></div>
          <span class="text-secondary small" v-html="act"></span>
        </div>
      </div>
      <div v-else class="text-center py-4 rounded-3 border border-secondary border-opacity-25"><p class="text-secondary">Még nincs aktivitás</p></div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, inject } from 'vue';
import { useRouter } from 'vue-router';
import EventCard from '../components/EventCard.vue';
import { useEvents } from '../stores/events.js';
import { useFavorites } from '../stores/favorites.js';
import { useAuth } from '../stores/auth.js';
import { apiFetchUsers, apiFetchEvents, apiFetchRecentAttendances, apiFetchRecentReviews } from '../services/api.js';

const props = defineProps({
  activeSection: { type: String, default: 'events' },
  currentUser: { type: Object, default: null },
});
const emit = defineEmits(['show-auth','show-all-events','show-my-events','show-favorites','show-community','create-event']);

const openEditModal = inject('openEditModal');
const openDetailsModal = inject('openDetailsModal');
const showAuthModal = inject('showAuthModal');
const showToast = inject('showToast');

const { allEvents, myEvents, activeCategory, searchQuery, loadAllEvents, loadMyEvents, setCategory, setSearch } = useEvents();
const { favoriteEvents, loadFavorites } = useFavorites();
const { currentUser: authUser } = useAuth();

const localSearch = ref('');
const showAllTestimonials = ref(false);
const communityUsers = ref([]);
const communityEventCount = ref(0);
const totalCommunityActivity = ref(0);
const topOrganizers = ref([]);
const recentActivity = ref([]);
const testimonials = ref([]);

const availableCategories = computed(() => {
  const categoryList = ['all', ...new Set(allEvents.value.map(event => event.category).filter(Boolean))];
  return categoryList;
});

const filteredEvents = computed(() => {
  const searchText = (searchQuery.value || '').toLowerCase().trim();
  let eventList = activeCategory.value === 'all' ? allEvents.value : allEvents.value.filter(event => event.category === activeCategory.value);
  if (searchText) {
    eventList = eventList.filter(event =>
      (event.title || '').toLowerCase().startsWith(searchText)
    );
  }
  return eventList;
});

const router = useRouter();

onMounted(async () => {
  await loadAllEvents();
});

function openDetails(event) {
  router.push(`/event/${event.id}`);
}
function openEdit(event) { openEditModal(event); }

function escapeHtml(text) {
  if (typeof text !== 'string') return String(text ?? '');
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

watch(() => props.activeSection, async (sec) => {
  const hasToken = !!localStorage.getItem('auth_token');

  // Automatikus frissítés
  if (sec === 'events' || sec === 'home' || !sec) {
    await loadAllEvents();
  }

  if (sec === 'events') {
    localSearch.value = '';
    setSearch('');
  } else if (!sec || sec === 'home') {
    await loadTestimonials();
  } else if (sec === 'my-events') {
    if (!props.currentUser && !hasToken) { showAuthModal(); emit('show-all-events'); return; }
    await loadMyEvents();
  } else if (sec === 'favorites') {
    if (!props.currentUser && !hasToken) { showAuthModal(); emit('show-all-events'); return; }
    await loadFavorites();
  } else if (sec === 'community') {
    await loadCommunityData();
  }
}, { immediate: true });

async function loadTestimonials() {
  const reviews = await apiFetchRecentReviews();
  if (Array.isArray(reviews)) {
    testimonials.value = reviews.map(review => {
      const userName = review.user?.name || 'Ismeretlen';
      return {
        stars: parseFloat(review.rating) || 0,
        text: review.comment,
        initial: userName.substring(0, 2).toUpperCase(),
        name: userName,
        profile_picture: review.user?.profile_picture ? (review.user.profile_picture.startsWith('http') ? review.user.profile_picture : 'http://localhost:8000/storage/' + review.user.profile_picture) : null,
        location: review.event?.title || 'Esemény',
        color: 'linear-gradient(135deg, #7c3aed, #d946ef)'
      };
    });
  }
}

/**
 * Közösség fül adatainak letöltése és feldolgozása.
 */
async function loadCommunityData() {
  const [users, events, attendances, reviews] = await Promise.all([
    apiFetchUsers(), 
    apiFetchEvents(), 
    apiFetchRecentAttendances(), 
    apiFetchRecentReviews()
  ]);
  
  communityUsers.value = users;
  communityEventCount.value = events.length;
  
  let totalActivity = 0;
  const organizerMap = {};
  
  events.forEach(event => { 
    totalActivity += (event.attendees_count || 0);
    let organizerName = event.organizer ? event.organizer.trim() : '';
    let organizerEmail = '';
    
    if (event.user_id) {
      const user = users.find(u => u.id === event.user_id);
      if (user) {
        if (!organizerName) organizerName = user.name;
        organizerEmail = user.email;
      }
    }
    if (!organizerName) organizerName = 'Ismeretlen szervező';
    
    if (!organizerMap[organizerName]) {
      organizerMap[organizerName] = { name: organizerName, email: event.organizer ? '' : organizerEmail, count: 0 };
    }
    organizerMap[organizerName].count += (event.attendees_count || 0);
  });

  topOrganizers.value = Object.values(organizerMap)
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)
    .map((item, index) => ({
      user: { id: 'org_' + index, name: item.name, email: item.email || 'Klub / Egyéni szervező' },
      count: item.count
    }));

  totalCommunityActivity.value = totalActivity;

  const activityList = [];
  const todayString = new Date().toDateString();

  const rawAttendances = attendances.attendances || attendances;
  if (Array.isArray(rawAttendances)) {
    rawAttendances.forEach(attendance => {
      const date = new Date(attendance.created_at || 0);
      if (date.toDateString() === todayString) {
        activityList.push({
          time: date,
          html: `<strong class="text-info">${escapeHtml(attendance.user_name)}</strong> jelezte, hogy ott lesz: <strong class="text-white">${escapeHtml(attendance.event_title)}</strong>`
        });
      }
    });
  }

  activityList.sort((a, b) => b.time - a.time);
  recentActivity.value = activityList.slice(0, 10).map(activity => activity.html);
}


</script>

<style scoped>
.custom-search-input::placeholder {
  color: rgba(255, 255, 255, 0.6) !important;
}
.auto-inline-1 { background: linear-gradient(rgba(15, 23, 42, 0.75), rgba(59, 7, 100, 0.85)), url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80') center/cover no-repeat;; }
.auto-inline-2 { width: 600px; height: 600px; background: radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%); top: -200px; right: -100px;; }
.auto-inline-3 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(217,70,239,0.1) 0%, transparent 70%); bottom: -150px; left: -100px;; }
.auto-inline-4 { z-index: 2;; }
.auto-inline-5 { font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase;; }
.auto-inline-6 { text-shadow: 0 4px 15px rgba(0,0,0,0.2);; }
.auto-inline-7 { backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.2); max-width: 600px;; }
.auto-inline-8 { background: linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9)); border: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: transform 0.2s;; }
.auto-inline-8:hover { transform: scale(1.05); }
.auto-inline-9 { color: #c084fc;; }
.auto-inline-10 { color: #f472b6;; }
.auto-inline-11 { color: #38bdf8;; }
.auto-inline-12 { color: #818cf8;; }
.auto-inline-13 { background: rgba(30,41,59,0.3); border: 1px dashed rgba(71,85,105,0.5);; }
.auto-inline-14 { background: rgba(30,41,59,0.5); border: 1px solid rgba(71,85,105,0.5);; }
.auto-inline-15 { width: 40px; height: 40px; border: 2px solid rgba(139,92,246,0.5);; }
.auto-inline-16 { border-radius: 20px;; }
.auto-inline-17 { min-height: 80vh;; }
.auto-inline-18 { max-width: 700px;; }
.auto-inline-19 { background: #1e293b; border: 1px solid #334155;; }
.auto-inline-20 { left: 20px; top: 50%; transform: translateY(-50%);; }
.auto-inline-21 { color:#d946ef; }
.auto-inline-22 { background:rgba(124,58,237,.3); }
.auto-inline-23 { color:#a78bfa; }
.auto-inline-24 { background:rgba(217,70,239,.3); }
.auto-inline-25 { color:#e879f9; }
.auto-inline-26 { background:rgba(236,72,153,.3); }
.auto-inline-27 { color:#f9a8d4; }
.auto-inline-28 { background:rgba(30,41,59,.5);border:1px solid rgba(71,85,105,.5); }
.auto-inline-29 { width:56px;height:56px;background:linear-gradient(135deg,#7c3aed,#d946ef); }
.auto-inline-30 { background:rgba(217,70,239,.2);color:#e879f9;border:1px solid rgba(217,70,239,.3); }
.auto-inline-31 { background:rgba(30,41,59,.5);border:1px solid rgba(71,85,105,.3); }
.auto-inline-32 { width:36px;height:36px;background:rgba(217,70,239,.2); }
</style>
