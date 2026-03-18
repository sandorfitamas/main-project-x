<template>
  <div>
    <!-- Hero -->
    <div class="hero py-5 mb-0">
      <div class="hero-bg"></div>
      <div class="hero-overlay"></div>
      <div class="container-xl position-relative text-center py-5">
        <h1 class="hero-title text-white mb-3">Találd meg a ma esti<br><span class="hero-accent">VIBE-ot</span></h1>
        <p class="text-secondary fs-5 mb-4 mx-auto" style="max-width:600px">A Project X a legjobb hely, hogy megtaláld a környék legvadabb bulijait, vagy megszervezd a sajátodat.</p>
        <div class="mx-auto" style="max-width:600px">
          <div class="position-relative">
            <i class="bi bi-search position-absolute" style="left:14px;top:50%;transform:translateY(-50%);color:#94a3b8;z-index:5"></i>
            <input v-model="localSearch" type="text" class="form-control search-box py-3 ps-5" placeholder="Keress eseményt, helyszínt vagy hangulatot..." @input="setSearch(localSearch)" />
          </div>
        </div>
      </div>
    </div>

    <!-- All Events -->
    <main v-if="activeSection === 'events'" class="flex-grow-1 container-xl px-3 px-md-4 py-5">
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <h2 class="h4 fw-bold mb-0"><i class="bi bi-funnel-fill me-2" style="color:#d946ef"></i>Közelgő Események</h2>
        <div class="d-flex gap-2 flex-wrap">
          <button v-for="cat in availableCategories" :key="cat" :class="['filter-btn', { active: activeCategory === cat }]" @click="setCategory(cat)">
            {{ cat === 'all' ? 'Összes' : cat }}
          </button>
        </div>
      </div>
      <div v-if="filteredEvents.length" class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
        <EventCard v-for="ev in filteredEvents" :key="ev.id" :event="ev" @details="openDetails" @edit="openEdit" />
      </div>
      <div v-else class="text-center py-5 rounded-4 border border-secondary border-opacity-25 mt-4">
        <p class="text-secondary fs-5 mb-1">Nem találtunk ilyen bulit...</p>
        <p class="text-muted small">Próbálj más keresőszót, vagy szervezz te egyet!</p>
      </div>
    </main>

    <!-- My Events -->
    <section v-if="activeSection === 'my-events'" class="flex-grow-1 container-xl px-3 px-md-4 py-5">
      <div class="mb-4">
        <h2 class="h3 fw-bold mb-1"><i class="bi bi-person-fill me-2" style="color:#d946ef"></i>Saját események</h2>
        <p class="text-secondary small">Itt láthatod és szerkesztheted az általad létrehozott eseményeket</p>
      </div>
      <div v-if="myEvents.length" class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
        <EventCard v-for="ev in myEvents" :key="ev.id" :event="ev" :is-mine="true" @details="openDetails" @edit="openEdit" />
      </div>
      <div v-else class="text-center py-5 rounded-4 border border-secondary border-opacity-25 mt-3">
        <p class="text-secondary fs-5 mb-1">Még nincs eseményed</p>
        <p class="text-muted small mb-3">Hozz létre az első bulidat!</p>
        <button class="btn btn-gradient px-4 py-2 fw-semibold" @click="$emit('create-event')"><i class="bi bi-plus-lg me-1"></i> Új buli létrehozása</button>
      </div>
    </section>

    <!-- Favorites -->
    <section v-if="activeSection === 'favorites'" class="flex-grow-1 container-xl px-3 px-md-4 py-5">
      <div class="mb-4">
        <h2 class="h3 fw-bold mb-1"><i class="bi bi-heart-fill text-danger me-2"></i>Kedvenc események</h2>
        <p class="text-secondary small">A kedvenceid közé mentett események</p>
      </div>
      <div v-if="favoriteEvents.length" class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
        <EventCard v-for="ev in favoriteEvents" :key="ev.id" :event="ev" @details="openDetails" @edit="openEdit" />
      </div>
      <div v-else class="text-center py-5 rounded-4 border border-secondary border-opacity-25 mt-3">
        <i class="bi bi-heart display-3 text-secondary d-block mb-3"></i>
        <p class="text-secondary fs-5 mb-1">Még nincs kedvenc eseményed</p>
        <p class="text-muted small mb-3">Az események melletti szív ikonra kattintva adhatsz hozzá kedvenceket</p>
        <button class="btn btn-gradient px-4 py-2 fw-semibold" @click="$emit('show-all-events')">Események böngészése</button>
      </div>
    </section>

    <!-- Community -->
    <section v-if="activeSection === 'community'" class="flex-grow-1 container-xl px-3 px-md-4 py-5">
      <div class="mb-4">
        <h2 class="h3 fw-bold mb-1"><i class="bi bi-people-fill me-2" style="color:#d946ef"></i>Közösség</h2>
        <p class="text-secondary small">Fedezd fel a buliközösség tagjait és aktivitását</p>
      </div>
      <div class="row g-4 mb-5">
        <div class="col-md-4"><div class="stat-card stat-violet"><div class="d-flex align-items-center justify-content-between"><div><p class="text-secondary small mb-1">Aktív tagok</p><p class="h3 fw-bold text-white mb-0">{{ communityUsers.length }}</p></div><div class="rounded-3 p-2" style="background:rgba(124,58,237,.3)"><i class="bi bi-people-fill fs-3" style="color:#a78bfa"></i></div></div></div></div>
        <div class="col-md-4"><div class="stat-card stat-fuchsia"><div class="d-flex align-items-center justify-content-between"><div><p class="text-secondary small mb-1">Összes esemény</p><p class="h3 fw-bold text-white mb-0">{{ communityEventCount }}</p></div><div class="rounded-3 p-2" style="background:rgba(217,70,239,.3)"><i class="bi bi-calendar-event-fill fs-3" style="color:#e879f9"></i></div></div></div></div>
        <div class="col-md-4"><div class="stat-card stat-pink"><div class="d-flex align-items-center justify-content-between"><div><p class="text-secondary small mb-1">Közösségi aktivitás</p><p class="h3 fw-bold text-white mb-0">🔥</p></div><div class="rounded-3 p-2" style="background:rgba(236,72,153,.3)"><i class="bi bi-lightning-fill fs-3" style="color:#f9a8d4"></i></div></div></div></div>
      </div>
      <h5 class="fw-bold mb-3"><i class="bi bi-star-fill text-warning me-2"></i>Legjobb szervezők</h5>
      <div v-if="topOrganizers.length" class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4 mb-5">
        <div v-for="org in topOrganizers" :key="org.user.id" class="col">
          <div class="p-4 rounded-4 text-center" style="background:rgba(30,41,59,.5);border:1px solid rgba(71,85,105,.5)">
            <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white fs-5 mx-auto mb-3" style="width:56px;height:56px;background:linear-gradient(135deg,#7c3aed,#d946ef)">{{ (org.user.name||'?').substring(0,2).toUpperCase() }}</div>
            <p class="text-white fw-semibold mb-0 text-truncate">{{ org.user.name }}</p>
            <p class="text-secondary small mb-2">{{ org.user.email }}</p>
            <span class="badge rounded-pill" style="background:rgba(217,70,239,.2);color:#e879f9;border:1px solid rgba(217,70,239,.3)"><i class="bi bi-calendar-event me-1"></i>{{ org.count }} esemény</span>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-4 rounded-3 border border-secondary border-opacity-25 mb-5"><p class="text-secondary">Még nincs szervező a közösségben</p></div>
      <h5 class="fw-bold mb-3"><i class="bi bi-activity me-2" style="color:#d946ef"></i>Közösségi aktivitás</h5>
      <div v-if="recentActivity.length" class="d-flex flex-column gap-3">
        <div v-for="(act, i) in recentActivity" :key="i" class="d-flex align-items-center gap-3 p-3 rounded-3" style="background:rgba(30,41,59,.5);border:1px solid rgba(71,85,105,.3)">
          <div class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style="width:36px;height:36px;background:rgba(217,70,239,.2)"><i class="bi bi-calendar-plus" style="color:#e879f9"></i></div>
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
import { apiFetchUsers, apiFetchEvents } from '../services/api.js';

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
const communityUsers = ref([]);
const communityEventCount = ref(0);
const topOrganizers = ref([]);
const recentActivity = ref([]);

const availableCategories = computed(() => {
  const cats = ['all', ...new Set(allEvents.value.map(e => e.category).filter(Boolean))];
  return cats;
});

const filteredEvents = computed(() => {
  const q = (searchQuery.value || '').toLowerCase().trim();
  let list = activeCategory.value === 'all' ? allEvents.value : allEvents.value.filter(e => e.category === activeCategory.value);
  if (q) {
    list = list.filter(e =>
      (e.title||'').toLowerCase().includes(q) ||
      (e.location||'').toLowerCase().includes(q) ||
      (e.description||'').toLowerCase().includes(q)
    );
  }
  return list;
});

const router = useRouter();

function openDetails(ev) {
  router.push(`/event/${ev.id}`);
}
function openEdit(ev) { openEditModal(ev); }

function escapeHtml(str) {
  if (typeof str !== 'string') return String(str ?? '');
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

watch(() => props.activeSection, async (sec) => {
  if (sec === 'my-events') {
    if (!props.currentUser) { showAuthModal(); emit('show-all-events'); return; }
    await loadMyEvents();
  } else if (sec === 'favorites') {
    if (!props.currentUser) { showAuthModal(); emit('show-all-events'); return; }
    await loadFavorites();
  } else if (sec === 'community') {
    await loadCommunityData();
  }
});

async function loadCommunityData() {
  const [users, events] = await Promise.all([apiFetchUsers(), apiFetchEvents()]);
  communityUsers.value = users;
  communityEventCount.value = events.length;
  const byUser = {};
  events.forEach(ev => { if (ev.user_id) byUser[ev.user_id] = (byUser[ev.user_id]||0)+1; });
  topOrganizers.value = users
    .filter(u => byUser[u.id] > 0)
    .sort((a,b) => (byUser[b.id]||0) - (byUser[a.id]||0))
    .slice(0, 8)
    .map(u => ({ user: u, count: byUser[u.id]||0 }));
  const recent = [...events].sort((a,b) => new Date(b.created_at||0) - new Date(a.created_at||0)).slice(0, 10);
  recentActivity.value = recent.map(ev =>
    `Új esemény: <strong class="text-white">${escapeHtml(ev.title)}</strong> — ${escapeHtml(ev.location||'')}`
  );
}
</script>
