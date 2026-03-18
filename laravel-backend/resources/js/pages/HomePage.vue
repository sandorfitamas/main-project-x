<template>
  <div>
    <!-- ======= HOME PAGE ======= -->
    <div v-if="activeSection === 'home' || !activeSection">
      <!-- High-Quality Graphic Hero -->
      <div class="py-5 position-relative overflow-hidden" style="background: linear-gradient(rgba(15, 23, 42, 0.75), rgba(59, 7, 100, 0.85)), url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80') center/cover no-repeat;">
        <!-- Abstract CSS Graphic overlays -->
        <div class="position-absolute rounded-circle" style="width: 600px; height: 600px; background: radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%); top: -200px; right: -100px;"></div>
        <div class="position-absolute rounded-circle" style="width: 500px; height: 500px; background: radial-gradient(circle, rgba(217,70,239,0.1) 0%, transparent 70%); bottom: -150px; left: -100px;"></div>

        <div class="container-xl position-relative py-5 my-md-4" style="z-index: 2;">
          <div class="row align-items-center">
            <div class="col-md-10 col-lg-8 mx-auto text-center">
              <span class="badge rounded-pill bg-light bg-opacity-10 text-white mb-3 px-3 py-2 border border-white border-opacity-25 shadow-sm" style="font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase;">
                Project X – Minden ami bulizás
              </span>
              <h1 class="display-3 fw-bolder text-white mb-4 lh-sm" style="text-shadow: 0 4px 15px rgba(0,0,0,0.2);">Fedezd fel a legjobb<br>eseményeket</h1>
              
              <!-- Quick Search Bar (Functional) -->
              <div class="p-2 bg-white bg-opacity-10 rounded-pill shadow-lg mt-4 mx-auto" style="backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.2); max-width: 600px;">
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

      <!-- Kategóriák Grid -->
      <div class="container-xl py-5 mt-2">
        <h3 class="fw-bold text-white mb-4">Válassz stílust</h3>
        <div class="row g-3">
          <div class="col-6 col-md-3">
             <div class="rounded-4 p-4 text-center position-relative overflow-hidden" @click="setCategory('Klub'); $emit('show-all-events')" style="background: linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9)); border: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
               <i class="bi bi-music-note-list display-5 mb-3 d-block" style="color: #c084fc;"></i>
               <h5 class="text-white mb-0 fw-semibold">Klubok</h5>
             </div>
          </div>
          <div class="col-6 col-md-3">
             <div class="rounded-4 p-4 text-center position-relative overflow-hidden" @click="setCategory('Házibuli'); $emit('show-all-events')" style="background: linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9)); border: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
               <i class="bi bi-house-heart display-5 mb-3 d-block" style="color: #f472b6;"></i>
               <h5 class="text-white mb-0 fw-semibold">Házibulik</h5>
             </div>
          </div>
          <div class="col-6 col-md-3">
             <div class="rounded-4 p-4 text-center position-relative overflow-hidden" @click="setCategory('Fesztivál'); $emit('show-all-events')" style="background: linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9)); border: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
               <i class="bi bi-speaker display-5 mb-3 d-block" style="color: #38bdf8;"></i>
               <h5 class="text-white mb-0 fw-semibold">Fesztiválok</h5>
             </div>
          </div>
          <div class="col-6 col-md-3">
             <div class="rounded-4 p-4 text-center position-relative overflow-hidden" @click="setCategory('Chill'); $emit('show-all-events')" style="background: linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9)); border: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
               <i class="bi bi-music-player-fill display-5 mb-3 d-block" style="color: #818cf8;"></i>
               <h5 class="text-white mb-0 fw-semibold">Chill</h5>
             </div>
          </div>
        </div>
      </div>

      <!-- Felkapott Section (Top 3) -->
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
          <EventCard v-for="ev in filteredEvents.slice(0, 3)" :key="'trending-'+ev.id" :event="ev" @details="openDetails" @edit="openEdit" />
        </div>
        <div v-else class="text-center py-5 rounded-4" style="background: rgba(30,41,59,0.3); border: 1px dashed rgba(71,85,105,0.5);">
          <p class="text-secondary mb-0">Jelenleg nincsenek aktív események.</p>
        </div>
      </div>

      <!-- Testimonials / Értékelések (Replaces Create Event Promo) -->
      <div class="container-xl pb-5 mb-5 mt-4">
        <h3 class="fw-bold text-white mb-4 text-center">Mit mondanak rólunk?</h3>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div v-for="(t, i) in (showAllTestimonials ? testimonials : testimonials.slice(0, 3))" :key="i" class="col">
            <div class="rounded-4 p-4 h-100 d-flex flex-column" style="background: rgba(30,41,59,0.5); border: 1px solid rgba(71,85,105,0.5);">
              <div class="d-flex text-warning mb-3 fs-5">
                <i v-for="s in 5" :key="s" class="bi" :class="s <= t.stars ? 'bi-star-fill' : (s - 0.5 === t.stars ? 'bi-star-half' : 'bi-star')"></i>
              </div>
              <p class="text-light opacity-75 fst-italic mb-4">"{{ t.text }}"</p>
              <div class="d-flex align-items-center gap-3 mt-auto">
                <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow" :style="{ width: '40px', height: '40px', background: t.color }">{{ t.initial }}</div>
                <div>
                  <h6 class="text-white mb-0">{{ t.name }}</h6>
                  <small class="text-light opacity-50">{{ t.location }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-end mt-4">
          <button @click="showAllTestimonials = !showAllTestimonials" class="btn btn-outline-light shadow-sm" style="border-radius: 20px;">
            {{ showAllTestimonials ? 'Kevesebb' : 'Több vélemény' }}
            <i class="bi" :class="showAllTestimonials ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- ======= EVENTS PAGE (Események) ======= -->
    <main v-if="activeSection === 'events'" class="flex-grow-1 container-xl px-3 px-md-4 py-4 pt-5" style="min-height: 80vh;">
      <div class="mb-4 text-center">
        <h1 class="h2 fw-bold text-white mb-2">Böngészés & Keresés</h1>
        <p class="text-secondary">Találd meg a stílusodnak megfelelő bulit</p>
      </div>

      <!-- Keresőmező -->
      <div class="mx-auto mb-5" style="max-width: 700px;">
        <div class="position-relative shadow-sm rounded-pill p-1" style="background: #1e293b; border: 1px solid #334155;">
          <i class="bi bi-search position-absolute text-secondary" style="left: 20px; top: 50%; transform: translateY(-50%);"></i>
          <input v-model="localSearch" type="text" class="form-control custom-search-input bg-transparent border-0 text-white py-2 ps-5 shadow-none" placeholder="Keress eseményt, helyszínt vagy hangulatot..." @input="setSearch(localSearch)" />
        </div>
      </div>

      <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <h2 class="h4 fw-bold mb-0"><i class="bi bi-funnel-fill me-2" style="color:#d946ef"></i>Minden Esemény</h2>
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
import { apiFetchUsers, apiFetchEvents, apiFetchRecentAttendances } from '../services/api.js';

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
}, { immediate: true });

async function loadCommunityData() {
  const [users, events, attendances] = await Promise.all([apiFetchUsers(), apiFetchEvents(), apiFetchRecentAttendances()]);
  communityUsers.value = users;
  communityEventCount.value = events.length;
  const byUser = {};
  events.forEach(ev => { if (ev.user_id) byUser[ev.user_id] = (byUser[ev.user_id]||0)+1; });
  topOrganizers.value = users
    .filter(u => byUser[u.id] > 0)
    .sort((a,b) => (byUser[b.id]||0) - (byUser[a.id]||0))
    .slice(0, 8)
    .map(u => ({ user: u, count: byUser[u.id]||0 }));

  const activityList = [];

  const rawAttendances = attendances.attendances || attendances;
  if (Array.isArray(rawAttendances)) {
    rawAttendances.forEach(att => {
      activityList.push({
        time: new Date(att.created_at || 0),
        html: `<strong class="text-info">${escapeHtml(att.user_name)}</strong> jelezte, hogy ott lesz: <strong class="text-white">${escapeHtml(att.event_title)}</strong>`
      });
    });
  }

  activityList.sort((a, b) => b.time - a.time);
  recentActivity.value = activityList.slice(0, 10).map(a => a.html);
}

const testimonials = [
  { text: "A legjobb bulikat itt találtam! Végre nem kell 5 különböző Facebook csoportot bújnom, ha hétvégén csinálnék valamit.", name: "Bence", location: "Budapest", stars: 5, initial: "B", color: "linear-gradient(135deg, #3b82f6, #2dd4bf)" },
  { text: "A házibuli funkció zseniális. Így sokkal könnyebb volt embereket hívni egyetemi buliba, és a szervezés is rögtön átláthatóbb lett!", name: "Anna", location: "Szeged", stars: 5, initial: "A", color: "linear-gradient(135deg, #ec4899, #f43f5e)" },
  { text: "Nagyon király a dizájn, könnyű használni és rögtön értem mi hol van. Életmentő app a péntek estékhez.", name: "Dávid", location: "Debrecen", stars: 4, initial: "D", color: "linear-gradient(135deg, #8b5cf6, #c084fc)" },
  { text: "Sosem tudtam, merre induljak szombat este. A Project X feldobta a legközelebbi underground bulikat is!", name: "Péter", location: "Győr", stars: 5, initial: "P", color: "linear-gradient(135deg, #10b981, #34d399)" },
  { text: "Egyszerűen imádom! A kedvenc funkciómmal egy helyen gyűjthetem a fesztiválokat.", name: "Lilla", location: "Budapest", stars: 5, initial: "L", color: "linear-gradient(135deg, #f59e0b, #fbbf24)" },
  { text: "Végre egy olyan oldal ami nem néz ki úgy mint a 2010-es évek elején. Modern, gyors, szexi.", name: "Karesz", location: "Miskolc", stars: 5, initial: "K", color: "linear-gradient(135deg, #6366f1, #818cf8)" },
  { text: "Én leginkább csak chill eseményeket kerestem, de még úgy is szuper kávéházi akusztikus koncerteket dobott fel.", name: "Eszter", location: "Pécs", stars: 4, initial: "E", color: "linear-gradient(135deg, #14b8a6, #2dd4bf)" },
  { text: "Egy saját DJ szettet szerveztem be és kb 50-en eljöttek innen. Nagyon adja a közösség!", name: "Zsolti", location: "Szombathely", stars: 5, initial: "Z", color: "linear-gradient(135deg, #ef4444, #f87171)" },
  { text: "Brutális amit az applikáció tud. Egyszer mindenkinek ki kell próbálnia!", name: "Réka", location: "Budapest", stars: 5, initial: "R", color: "linear-gradient(135deg, #d946ef, #e879f9)" },
];
</script>

<style scoped>
.custom-search-input::placeholder {
  color: rgba(255, 255, 255, 0.6) !important;
}
</style>
