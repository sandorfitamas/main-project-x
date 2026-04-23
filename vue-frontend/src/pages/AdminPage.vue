<template>
  <div class="container-xl py-5">
    <h2 class="fw-bold mb-4"><i class="bi bi-shield-lock text-warning me-2"></i>Admin Panel</h2>
    
    <div v-if="!currentUser?.is_admin" class="alert alert-danger">
      Nincs jogosultságod az admin felülethez!
    </div>
    <div v-else>
      <div class="row g-4 mb-5">
        <div class="col-md-4">
          <div class="p-4 rounded-4 stat-card auto-inline-1">
            <h5 class="text-secondary">Összes felhasználó</h5>
            <h2 class="text-white">{{ stats?.users_count || 0 }}</h2>
          </div>
        </div>
        <div class="col-md-4">
          <div class="p-4 rounded-4 stat-card auto-inline-1">
            <h5 class="text-secondary">Összes esemény</h5>
            <h2 class="text-white">{{ stats?.events_count || 0 }}</h2>
          </div>
        </div>
        <div class="col-md-4">
          <div class="p-4 rounded-4 stat-card auto-inline-1">
            <h5 class="text-secondary">Összes vélemény</h5>
            <h2 class="text-white">{{ stats?.reviews_count || 0 }}</h2>
          </div>
        </div>
      </div>

      <div class="mb-5">
        <h4 class="fw-bold mb-3">Felhasználók kezelése</h4>
        <div class="table-responsive">
          <table class="table table-dark table-hover align-middle text-nowrap">
            <thead>
              <tr>
                <th>ID</th>
                <th>Név</th>
                <th>Email</th>
                <th>Regisztrált</th>
                <th>Műveletek</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in users" :key="user.id">
                <td>{{ index + 1 }}</td>
                <td>{{ user.name }} <span v-if="user.is_admin" class="badge bg-warning text-dark">ADMIN</span></td>
                <td>{{ user.email }}</td>
                <td>{{ new Date(user.created_at).toLocaleDateString() }}</td>
                <td>
                  <div class="d-flex flex-column flex-md-row gap-2">
                    <button v-if="!user.is_admin" class="btn btn-sm btn-outline-warning" @click="suspendUser(user)">
                      <i class="bi" :class="user.suspended_until ? 'bi-play-circle' : 'bi-pause-circle'"></i> 
                      {{ user.suspended_until ? 'Feloldás' : 'Felfüggesztés' }}
                    </button>
                    <button v-if="!user.is_admin" class="btn btn-sm btn-outline-danger" @click="deleteUser(user.id)">
                      <i class="bi bi-trash"></i> Törlés
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h4 class="fw-bold mb-3">Események moderálása</h4>
        <div class="table-responsive">
          <table class="table table-dark table-hover align-middle text-nowrap">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cím</th>
                <th>Létrehozó</th>
                <th>Dátum</th>
                <th>Műveletek</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(event, index) in events" :key="event.id">
                <td>{{ index + 1 }}</td>
                <td>{{ event.title }}</td>
                <td>{{ event.creator_name }}</td>
                <td>{{ event.date }}</td>
                <td>
                  <div class="d-flex flex-column flex-md-row gap-2">
                    <button class="btn btn-sm btn-outline-info" @click="openEditModal(event)">
                      <i class="bi bi-pencil"></i> Szerkesztés
                    </button>
                    <button class="btn btn-sm btn-outline-warning" @click="suspendEvent(event)">
                      <i class="bi" :class="event.suspended_until ? 'bi-eye' : 'bi-eye-slash'"></i> 
                      {{ event.suspended_until ? 'Megjelenítés' : 'Elrejtés' }}
                    </button>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteEvent(event.id)">
                      <i class="bi bi-trash"></i> Törlés
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-5">
        <h4 class="fw-bold mb-3">Vélemények moderálása</h4>
        <div class="table-responsive">
          <table class="table table-dark table-hover align-middle text-nowrap">
            <thead>
              <tr>
                <th>ID</th>
                <th>Szerző</th>
                <th>Esemény</th>
                <th>Értékelés</th>
                <th>Vélemény</th>
                <th>Műveletek</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(review, index) in reviews" :key="review.id">
                <td>{{ index + 1 }}</td>
                <td>{{ review.user_name }}</td>
                <td>{{ review.event_title }}</td>
                <td>
                  <span class="text-warning">
                    <i class="bi bi-star-fill" v-for="n in review.rating" :key="n"></i>
                    <i class="bi bi-star" v-for="n in 5 - review.rating" :key="n + 5"></i>
                  </span>
                </td>
                <td :title="review.comment" class="auto-inline-2">{{ review.comment }}</td>
                <td>
                  <div class="d-flex flex-column flex-md-row gap-2">
                    <button v-if="!review.user_is_admin" class="btn btn-sm btn-outline-warning" @click="suspendUserByReview(review)">
                      <i class="bi" :class="review.user_suspended_until ? 'bi-play-circle' : 'bi-pause-circle'"></i> 
                      {{ review.user_suspended_until ? 'Feloldás' : 'Felfüggesztés' }}
                    </button>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteReview(review.id)">
                      <i class="bi bi-trash"></i> Törlés
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="reviews.length === 0">
                <td colspan="6" class="text-center text-secondary py-3">Még nincsenek vélemények.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../stores/auth.js';
import { apiGetAdminDashboard, apiGetAdminUsers, apiDeleteAdminUser, apiGetAdminEvents, apiDeleteAdminEvent, apiSuspendAdminUser, apiSuspendAdminEvent, apiGetAdminReviews, apiDeleteAdminReview } from '../services/api.js';

const props = defineProps({
  currentUser: { type: Object, default: null }
});

const router = useRouter();
const showToast = inject('showToast');
const openEditModal = inject('openEditModal');
const { restoreSession } = useAuth();

const stats = ref({ users_count: 0, events_count: 0 });
const users = ref([]);
const events = ref([]);
const reviews = ref([]);

onMounted(async () => {
  let user = props.currentUser;
  if (!user) {
    user = await restoreSession();
  }
  
  if (!user?.is_admin) {
    router.push('/');
    return;
  }
  await loadData();
  window.addEventListener('app-event-updated', loadData);
});

onUnmounted(() => {
  window.removeEventListener('app-event-updated', loadData);
});

async function loadData() {
  const dashResponse = await apiGetAdminDashboard();
  if (dashResponse.success) {
    stats.value = dashResponse.stats;
  }

  const usersResponse = await apiGetAdminUsers();
  if (usersResponse.success) {
    users.value = usersResponse.users;
  }

  const eventsResponse = await apiGetAdminEvents();
  if (eventsResponse.success) {
    events.value = eventsResponse.events;
  }

  const reviewsResponse = await apiGetAdminReviews();
  if (reviewsResponse.success) {
    reviews.value = reviewsResponse.reviews;
  }
}

/**
 * Felhasználó törlése az admin panelről.
 */
async function deleteUser(id) {
  if (!confirm('Biztosan törlöd a felhasználót?')) {
    return;
  }

  const response = await apiDeleteAdminUser(id);
  if (response.success) {
    showToast('Felhasználó sikeresen törölve!', 'success');
    loadData();
  } else {
    showToast(response.error || 'Hiba történt a törlés során', 'error');
  }
}

/**
 * Felhasználó felfüggesztésének kezelése.
 */
async function suspendUser(user) {
  if (user.suspended_until) {
    if (!confirm('Biztosan feloldod a felhasználó felfüggesztését?')) {
      return;
    }
    
    const response = await apiSuspendAdminUser(user.id, 0);
    if (response.success) {
      showToast('Felhasználó feloldva!', 'success');
      loadData();
    }
    return;
  }
  
  const days = prompt('Hány napra függeszted fel a felhasználót?');
  if (days === null) {
    return;
  }
  
  const parsedDays = days === '' ? 36500 : parseInt(days, 10);
  const response = await apiSuspendAdminUser(user.id, parsedDays);
  
  if (response.success) {
    showToast('Felhasználó sikeresen felfüggesztve!', 'success');
    loadData();
  }
}

/**
 * Esemény törlése az admin panelről.
 */
async function deleteEvent(id) {
  if (!confirm('Biztosan törlöd az eseményt?')) {
    return;
  }

  const response = await apiDeleteAdminEvent(id);
  if (response.success) {
    showToast('Esemény sikeresen törölve!', 'success');
    loadData();
  } else {
    showToast(response.error || 'Hiba történt a törlés során', 'error');
  }
}

/**
 * Esemény elrejtésének/felfüggesztésének kezelése.
 */
async function suspendEvent(event) {
  if (event.suspended_until) {
    if (!confirm('Biztosan újra láthatóvá teszed az eseményt?')) {
      return;
    }
    
    const response = await apiSuspendAdminEvent(event.id, 0);
    if (response.success) {
      showToast('Esemény újra aktív!', 'success');
      loadData();
    }
    return;
  }
  
  const days = prompt('Hány napra rejtjük el az eseményt (pl. vizsgálat idejére)?');
  if (days === null) {
    return;
  }
  
  const parsedDays = days === '' ? 36500 : parseInt(days, 10);
  const response = await apiSuspendAdminEvent(event.id, parsedDays);
  
  if (response.success) {
    showToast('Esemény sikeresen elrejtve a publikum elől!', 'success');
    loadData();
  }
}

/**
 * Vélemény törlése.
 */
async function deleteReview(id) {
  if (!confirm('Biztosan törlöd a véleményt?')) {
    return;
  }

  const response = await apiDeleteAdminReview(id);
  if (response.success) {
    showToast('Vélemény sikeresen törölve!', 'success');
    loadData();
  } else {
    showToast(response.error || 'Hiba történt a törlés során', 'error');
  }
}

/**
 * Felhasználó felfüggesztése az írt véleménye alapján.
 */
async function suspendUserByReview(review) {
  if (review.user_suspended_until) {
    if (!confirm('Biztosan feloldod a felhasználó felfüggesztését?')) {
      return;
    }
    
    const response = await apiSuspendAdminUser(review.user_id, 0);
    if (response.success) {
      showToast('Felhasználó feloldva!', 'success');
      loadData();
    }
    return;
  }
  
  const days = prompt(`Hány napra függeszted fel a vélemény íróját (${review.user_name})?`);
  if (days === null) {
    return;
  }
  
  const parsedDays = days === '' ? 36500 : parseInt(days, 10);
  const response = await apiSuspendAdminUser(review.user_id, parsedDays);
  
  if (response.success) {
    showToast('Felhasználó sikeresen felfüggesztve!', 'success');
    loadData();
  }
}
</script>

<style scoped>
.auto-inline-1 { background:rgba(30,41,59,.5);border:1px solid rgba(71,85,105,.5); }
.auto-inline-2 { max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;; }
</style>
