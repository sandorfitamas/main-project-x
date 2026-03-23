<template>
  <div id="vue-app">
    <ToastContainer />
    <NavBar
      :current-user="currentUser"
      @show-auth="showAuthModal = true"
      @show-home="navigateSection('home')"
      @show-all-events="navigateSection('events')"
      @show-my-events="navigateSection('my-events')"
      @show-favorites="navigateSection('favorites')"
      @show-community="navigateSection('community')"
      @show-profile="router.push('/profile')"
      @logout="handleLogout"
      @create-event="showCreateModal = true"
    />
    <router-view
      :active-section="activeSection"
      :current-user="currentUser"
      @show-auth="showAuthModal = true"
      @show-all-events="navigateSection('events')"
      @show-my-events="navigateSection('my-events')"
      @show-favorites="navigateSection('favorites')"
      @show-community="navigateSection('community')"
      @create-event="showCreateModal = true"
    />
    <FooterBar />

    <!-- Új Buli -->
    <button
      v-if="currentUser"
      class="btn btn-gradient rounded-circle shadow-lg position-fixed create-fab"
      title="Új buli létrehozása"
      @click="showCreateModal = true"
    >
      <i class="bi bi-plus-lg"></i>
    </button>

    <!-- Modal ablakok -->
    <AuthModal
      v-model:visible="showAuthModal"
      @login-success="onLoginSuccess"
      @register-success="onRegisterSuccess"
    />
    <CreateEventModal
      v-model:visible="showCreateModal"
      @created="onEventCreated"
    />
    <EditEventModal
      v-model:visible="showEditModal"
      :event="editingEvent"
      @updated="onEventUpdated"
      @deleted="onEventDeleted"
    />
    <EventDetailsModal
      v-model:visible="showDetailsModal"
      :event="detailEvent"
      @share="shareEvent"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue';
import { useRouter } from 'vue-router';
import NavBar from './components/NavBar.vue';
import FooterBar from './components/FooterBar.vue';
import ToastContainer from './components/ToastContainer.vue';
import AuthModal from './components/AuthModal.vue';
import CreateEventModal from './components/CreateEventModal.vue';
import EditEventModal from './components/EditEventModal.vue';
import EventDetailsModal from './components/EventDetailsModal.vue';
import { useAuth } from './stores/auth.js';
import { useEvents } from './stores/events.js';
import { useFavorites } from './stores/favorites.js';
import { useToast } from './stores/toast.js';

const { currentUser, login, register, logout, restoreSession } = useAuth();
const { loadAllEvents } = useEvents();
const { loadFavoriteIds } = useFavorites();
const { showToast } = useToast();

const activeSection = ref(localStorage.getItem('activeSection') || 'home');
const showAuthModal = ref(false);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDetailsModal = ref(false);
const editingEvent = ref(null);
const detailEvent = ref(null);

const router = useRouter();

function navigateSection(section) {
  activeSection.value = section;
  localStorage.setItem('activeSection', section);
  router.push('/');
}

// Provide global functions to child components
provide('showToast', showToast);
provide('openEditModal', (ev) => {
  editingEvent.value = ev;
  showEditModal.value = true;
});
provide('openDetailsModal', (ev) => {
  detailEvent.value = ev;
  showDetailsModal.value = true;
});
provide('showAuthModal', () => {
  showAuthModal.value = true;
});

async function handleLogout() {
  await logout();
  navigateSection('events');
  showToast('Sikeresen kijelentkeztél', 'info');
}

async function onLoginSuccess(result) {
  showAuthModal.value = false;
  showToast(`Üdv, ${result.user.name}!`, 'success');
  await loadFavoriteIds();
}

async function onRegisterSuccess(result) {
  showAuthModal.value = false;
  showToast('Regisztráció sikeres!', 'success');
  await loadFavoriteIds();
}

async function onEventCreated() {
  showCreateModal.value = false;
  showToast('Esemény sikeresen létrehozva!', 'success');
}

async function onEventUpdated() {
  showEditModal.value = false;
  showToast('Esemény frissítve!', 'success');
}

async function onEventDeleted() {
  showEditModal.value = false;
  showToast('Esemény törölve', 'info');
}

function shareEvent(ev) {
  const url = `${window.location.origin}/event/${ev.id}`;
  if (navigator.share) {
    navigator.share({ title: ev.title, url });
  } else {
    navigator.clipboard.writeText(url).then(() => showToast('Link másolva!', 'success'));
  }
}

onMounted(async () => {
  const user = await restoreSession();
  if (user) {
    await loadFavoriteIds();
  }
  await loadAllEvents();
});
</script>

<style>
body { background: #0f172a; color: #e2e8f0; min-height: 100vh; display: flex; flex-direction: column; }
#vue-app { display: flex; flex-direction: column; min-height: 100vh; }

.navbar-custom { background: rgba(15,23,42,.85); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,.08); }
.logo-icon { background: linear-gradient(135deg,#7c3aed,#d946ef); border-radius: 8px; padding: 6px 8px; }
.logo-text { background: linear-gradient(90deg,#a78bfa,#e879f9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 900; font-size: 1.3rem; letter-spacing: -.04em; }
.btn-gradient { background: linear-gradient(90deg,#7c3aed,#d946ef) !important; color: #fff !important; border: none !important; }
.btn-gradient:hover { background: linear-gradient(90deg,#6d28d9,#c026d3) !important; }
.hero { position: relative; overflow: hidden; }
.hero-bg { position: absolute; inset: 0; background: url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2074&q=80') center/cover; opacity: .2; }
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top,#0f172a,rgba(15,23,42,.5) 50%,transparent); }
.hero-title { font-size: clamp(2rem,6vw,4.5rem); font-weight: 900; letter-spacing: -.04em; }
.hero-accent { background: linear-gradient(90deg,#a855f7,#ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.search-box { background: rgba(30,41,59,.8) !important; border: 1px solid #334155 !important; color: #e2e8f0 !important; border-radius: 12px !important; }
.search-box:focus { background: #1e293b !important; border-color: #d946ef !important; box-shadow: 0 0 0 .2rem rgba(217,70,239,.25) !important; }
.search-box::placeholder { color: #94a3b8; }
.event-card { background: rgba(30,41,59,.5); border: 1px solid rgba(71,85,105,.5); border-radius: 16px; overflow: hidden; transition: all .3s; display: flex; flex-direction: column; height: 100%; }
.event-card:hover { border-color: rgba(217,70,239,.5); box-shadow: 0 20px 40px rgba(139,92,246,.15); }
.event-card-img { height: 220px; overflow: hidden; position: relative; }
.event-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s; }
.event-card:hover .event-card-img img { transform: scale(1.07); }
.card-img-gradient { position: absolute; inset: 0; background: linear-gradient(to top,#0f172a 0%,transparent 60%); }
.badge-cat { font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; background: rgba(217,70,239,.85) !important; color: #fff !important; border-radius: 6px; }
.event-card-body { background: rgba(30,41,59,.5); padding: 1.25rem; flex: 1; display: flex; flex-direction: column; }
.tag-pill { background: rgba(217,70,239,.12); border: 1px solid rgba(217,70,239,.3); color: #e879f9; font-size: .7rem; border-radius: 20px; padding: 2px 10px; }
.filter-btn { background: #1e293b; color: #94a3b8; border: none; border-radius: 20px; padding: 6px 16px; font-size: .85rem; transition: all .2s; cursor: pointer; }
.filter-btn.active, .filter-btn:hover { background: #d946ef; color: #fff; }
.modal-dark .modal-content { background: #0f172a; border: 1px solid #334155; color: #e2e8f0; border-radius: 16px; }
.modal-dark .modal-header { border-bottom: 1px solid #1e293b; }
.modal-dark .modal-footer { border-top: 1px solid #1e293b; }
.form-dark { background: #1e293b !important; border: 1px solid #334155 !important; color: #e2e8f0 !important; border-radius: 8px !important; }
.form-dark:focus { background: #1e293b !important; border-color: #a855f7 !important; box-shadow: 0 0 0 .2rem rgba(168,85,247,.25) !important; color: #e2e8f0 !important; }
.form-dark::placeholder { color: #64748b; }
.form-dark option { background: #1e293b; }
.stat-card { border-radius: 16px; padding: 1.5rem; }
.stat-violet { background: linear-gradient(135deg,rgba(124,58,237,.2),rgba(124,58,237,.05)); border: 1px solid rgba(124,58,237,.3); }
.stat-fuchsia { background: linear-gradient(135deg,rgba(217,70,239,.2),rgba(217,70,239,.05)); border: 1px solid rgba(217,70,239,.3); }
.stat-pink { background: linear-gradient(135deg,rgba(236,72,153,.2),rgba(236,72,153,.05)); border: 1px solid rgba(236,72,153,.3); }
.upload-area { border: 2px dashed #334155; border-radius: 10px; cursor: pointer; background: rgba(30,41,59,.5); transition: background .2s; }
.upload-area:hover { background: #1e293b; }
.toast-wrap { position: fixed; top: 5rem; right: 1rem; z-index: 9999; display: flex; flex-direction: column; gap: .75rem; min-width: 320px; }
.toast-item { border-radius: 10px; padding: .85rem 1rem; box-shadow: 0 8px 24px rgba(0,0,0,.4); display: flex; align-items: flex-start; gap: .75rem; transition: opacity .4s; }
.toast-success { background: linear-gradient(90deg,#16a34a,#059669); border-left: 4px solid #22c55e; }
.toast-error { background: linear-gradient(90deg,#dc2626,#e11d48); border-left: 4px solid #f87171; }
.toast-warning { background: linear-gradient(90deg,#d97706,#ea580c); border-left: 4px solid #fbbf24; }
.toast-info { background: linear-gradient(90deg,#7c3aed,#d946ef); border-left: 4px solid #a78bfa; }
.hidden { display: none !important; }
.nav-link-dark { color: #94a3b8 !important; text-decoration: none !important; font-size: .875rem; font-weight: 500; transition: color .2s; cursor: pointer; }
.nav-link-dark:hover { color: #fff !important; }
.user-dropdown { position: absolute; right: 0; top: calc(100% + 8px); min-width: 220px; background: #1e293b; border: 1px solid #334155; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,.4); z-index: 1050; overflow: hidden; }
.user-dropdown-btn { width: 100%; text-align: left; padding: .75rem 1rem; background: transparent; border: none; color: #cbd5e1; transition: background .15s; cursor: pointer; display: flex; align-items: center; gap: .75rem; }
.user-dropdown-btn:hover { background: rgba(255,255,255,.05); color: #fff; }
.favorite-btn { position: absolute; top: .75rem; right: .75rem; z-index: 10; background: rgba(15,23,42,.8); border: none; border-radius: 50%; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); transition: all .2s; color: #94a3b8; cursor: pointer; }
.favorite-btn:hover, .favorite-btn.active { background: rgba(220,38,38,.8); color: #fca5a5; }
.favorite-btn.active i { color: #ef4444; }
.create-fab { bottom: 2rem; right: 2rem; width: 56px; height: 56px; font-size: 1.5rem; z-index: 1000; display: flex; align-items: center; justify-content: center; }
footer { background: #0f172a; border-top: 1px solid #1e293b; }
.loading-skeleton { background: linear-gradient(90deg,#1e293b 25%,#334155 50%,#1e293b 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
@keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
</style>
