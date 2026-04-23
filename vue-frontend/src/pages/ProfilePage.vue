<template>
  <main class="flex-grow-1 container-xl px-3 px-md-4 py-5">
    <div class="row g-4 justify-content-center">
      <!-- Profil Beállítások -->
      <div class="col-12 col-lg-5">
        <div class="p-4 p-md-5 rounded-4 border border-secondary border-opacity-25 h-100 auto-inline-1">
          <h3 class="text-white fw-bold mb-4 text-center">Profil beállítások</h3>
        
        <div v-if="errorMsg" class="alert alert-danger p-3 mb-4">{{ errorMsg }}</div>
        <div v-if="successMsg" class="alert alert-success p-3 mb-4 auto-inline-2">
          {{ successMsg }}
        </div>

        <form @submit.prevent="submitForm">
          <div class="mb-4 text-center">
            <div class="d-inline-block position-relative">
              <img :src="profilePicturePreview || (currentUser?.profile_picture && currentUser.profile_picture !== 'null' ? currentUser.profile_picture : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=8b5cf6&color=fff&size=150`)" alt="Profilkép" class="rounded-circle object-fit-cover shadow auto-inline-3">
              <label for="profilePicInput" class="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 cursor-pointer shadow-sm auto-inline-4">
                <i class="bi bi-camera-fill"></i>
              </label>
              <input type="file" id="profilePicInput" class="d-none" accept="image/*" @change="handleFileChange">
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label text-secondary mb-1">Email cím (nem módosítható)</label>
            <input v-model="form.email" type="email" class="form-control form-dark px-3 py-2 auto-inline-5" disabled />
          </div>
          
          <div class="mb-4">
            <label class="form-label text-secondary mb-1">Felhasználónév</label>
            <input v-model="form.name" type="text" class="form-control form-dark px-3 py-2" required />
          </div>
          
          <div class="mb-5">
            <label class="form-label text-secondary mb-1">Új jelszó</label>
            <input v-model="form.password" type="password" class="form-control form-dark px-3 py-2" placeholder="Hagyd üresen, ha nem változik" />
          </div>
          
          <button type="submit" class="btn btn-gradient w-100 py-3 fw-semibold fs-5 rounded-3" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            Mentés
          </button>
        </form>
      </div>
      </div>
      <!-- Saját Jegyek -->
      <div class="col-12 col-lg-7">
        <div class="p-4 p-md-5 rounded-4 border border-secondary border-opacity-25 h-100 auto-inline-1">
          <h3 class="text-white fw-bold mb-4 text-center">Saját Jegyek</h3>
          <div v-if="loadingTickets" class="text-center text-secondary py-4">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2">Jegyek betöltése...</p>
          </div>
          <div v-else-if="myTickets.length === 0" class="text-center py-5 rounded-3 border border-secondary border-opacity-25 bg-dark">
            <i class="bi bi-ticket-perforated display-4 text-secondary mb-3"></i>
            <p class="text-secondary fs-5 mb-1">Még nincsenek megvásárolt jegyeid</p>
            <button class="btn btn-outline-light mt-3" @click="$router.push('/home')">Események böngészése</button>
          </div>
          <div v-else class="d-flex flex-column gap-3">
            <div v-for="purchase in groupedPurchases" :key="purchase.key" class="rounded-3 overflow-hidden auto-inline-6">
              
              <!-- VÁSÁRLÁS FEJLÉC (kattintható) -->
              <div 
                class="d-flex justify-content-between align-items-center p-3 auto-inline-7" 
               
                @click="togglePurchase(purchase.key)"
                :style="expandedPurchases[purchase.key] ? 'background:rgba(255,255,255,0.05)' : ''"
              >
                <div>
                  <div class="text-white fw-bold mb-1">
                    Vásárlás – {{ formatDate(purchase.date) }}
                  </div>
                  <div class="text-secondary small">
                    {{ purchase.tickets.length }} db jegy &bull; Összesen: {{ parseInt(purchase.totalAmount).toLocaleString('hu-HU') }} Ft
                  </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                  <span class="badge bg-success">{{ purchase.status === 'paid' ? 'Fizetve' : purchase.status }}</span>
                  <i class="bi text-secondary" :class="expandedPurchases[purchase.key] ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                </div>
              </div>

              <!-- JELEN VÁSÁRLÁS JEGYEI (csak lenyitva látszanak) -->
              <div v-if="expandedPurchases[purchase.key]" class="p-3 border-top auto-inline-8">
                <div class="row g-3">
                  <div v-for="ticket in purchase.tickets" :key="ticket.id" class="col-12">
                    <div class="p-3 rounded-3 d-flex flex-column flex-sm-row gap-3 align-items-sm-center auto-inline-9">
                      
                      <!-- QR kód -->
                      <div class="bg-white p-1 rounded d-flex align-items-center justify-content-center mx-auto mx-sm-0 auto-inline-10">
                        <img :src="`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.ticket_code}`" alt="QR Kód" class="w-100 h-100 object-fit-contain">
                      </div>
                      
                      <!-- Jegyek info -->
                      <div class="flex-grow-1 text-center text-sm-start overflow-hidden">
                        <h6 class="text-white mb-2 text-truncate fw-bold">{{ ticket.event?.title || 'Ismeretlen Esemény' }}</h6>
                        <div class="d-flex flex-column flex-sm-row justify-content-between text-secondary small gap-1">
                          <div>
                            <i class="bi bi-calendar-event me-1"></i> {{ ticket.event?.date || '-' }}
                            <span class="d-none d-sm-inline mx-2 text-white-50">|</span>
                            Mennyiség: {{ ticket.quantity }} db
                          </div>
                          <div>
                            Részösszeg: <span class="text-white">{{ ticket.total_price > 0 ? parseInt(ticket.total_price) + ' Ft' : 'Ingyenes' }}</span>
                          </div>
                        </div>
                        <div class="mt-2 small text-secondary">
                          Vonalkód: <strong class="text-white user-select-all fs-6 auto-inline-11">{{ ticket.ticket_code }}</strong>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  </main>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../stores/auth.js';
import { apiFetchMyTickets } from '../services/api.js';

const router = useRouter();
const { currentUser, updateProfile } = useAuth();

const form = ref({ name: '', email: '', password: '' });
const loading = ref(false);
const loadingTickets = ref(true);
const myTickets = ref([]);

const errorMsg = ref('');
const successMsg = ref('');

const profilePictureFile = ref(null);
const profilePicturePreview = ref(null);

const expandedPurchases = reactive({});

/**
 * Lenyitja vagy bezárja a vásárláshoz tartozó jegyek lenyíló listáját.
 * 
 * @param {string} key - A vásárlás egyedi azonosító kulcsa.
 */
function togglePurchase(key) {
  expandedPurchases[key] = !expandedPurchases[key];
}

/**
 * Szebben formázott dátumvisszaadás a vásárlás idejéhez.
 * 
 * @param {string} dateString - Az eredeti dátum sztring.
 * @returns {string} Lokalizált (magyar) pontos dátum és idő.
 */
function formatDate(dateString) {
  if (!dateString) return '';
  const dateObj = new Date(dateString);
  return dateObj.toLocaleString('hu-HU', {
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit', 
    minute: '2-digit'
  });
}

/**
 * Csoportosítja a jegyeket a vásárlás dátuma alapján.
 * Ezzel elkerülhető, hogy azonos időben vásárolt jegyek külön tételként jelenjenek meg.
 */
const groupedPurchases = computed(() => {
  const purchaseGroups = {};
  
  myTickets.value.forEach(ticket => {
    const timestampStr = ticket.created_at || '';
    // Ha nincs időbélyeg (pl teszt adat), kap egy véletlenszerű kulcsot. Különben percre pontosan csoportosít.
    const groupKey = timestampStr ? timestampStr.substring(0, 16) : Math.random().toString(36).substring(7);
    
    if (!purchaseGroups[groupKey]) {
      purchaseGroups[groupKey] = {
        date: timestampStr,
        key: groupKey,
        tickets: [],
        totalAmount: 0,
        status: ticket.status
      };
    }
    
    purchaseGroups[groupKey].tickets.push(ticket);
    purchaseGroups[groupKey].totalAmount += parseFloat(ticket.total_price || 0);
  });
  
  // Rendezi a csoportokat a legújabb elől logikával
  return Object.values(purchaseGroups).sort((first, second) => {
    return new Date(second.date).getTime() - new Date(first.date).getTime();
  });
});

/**
 * Feldolgozza a képfeltöltés bemeneti mező változását (Profilkép előnézet).
 */
function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    profilePictureFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      profilePicturePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

/**
 * Betölti a bejelentkezett felhasználó adatait az űrlapba.
 */
function loadUserData() {
  if (currentUser.value) {
    form.value.name = currentUser.value.name || '';
    form.value.email = currentUser.value.email || '';
    form.value.password = '';
    fetchTickets();
  }
}

/**
 * Lekéri a saját vásárolt jegyeket az adatbázisból.
 */
async function fetchTickets() {
  loadingTickets.value = true;
  try {
    const data = await apiFetchMyTickets();
    myTickets.value = data || [];
  } catch (error) {
    console.error('Hiba a jegyek lekérésekor:', error);
  } finally {
    loadingTickets.value = false;
  }
}

onMounted(() => {
  loadUserData();
});

watch(currentUser, () => {
  loadUserData();
});

/**
 * Beküldi a profil módosításokat (név, jelszó, profilkép) a szerver felé.
 */
async function submitForm() {
  loading.value = true;
  errorMsg.value = '';
  successMsg.value = '';
  
  let updatePayload;
  
  if (profilePictureFile.value) {
    updatePayload = new FormData();
    updatePayload.append('name', form.value.name);
    
    if (form.value.password) {
      updatePayload.append('password', form.value.password);
    }
    
    updatePayload.append('profile_picture', profilePictureFile.value);
    
    // Laravel PUT request workaround FormData esetén
    updatePayload.append('_method', 'PUT'); 
  } else {
    updatePayload = { name: form.value.name };
    if (form.value.password) {
      updatePayload.password = form.value.password;
    }
  }
  
  const result = await updateProfile(updatePayload);
  loading.value = false;
  
  if (result && result.success) {
    successMsg.value = 'Profil sikeresen frissítve!';
    form.value.password = '';
    profilePictureFile.value = null;
    
    // Alapértelmezett bemeneti mező resetelése
    const fileInput = document.getElementById('profilePicInput');
    if (fileInput) {
       fileInput.value = '';
    }
  } else {
    errorMsg.value = result?.message || result?.error || 'Hálózati hiba történt a mentés során.';
  }
}
</script>

<style scoped>
.auto-inline-1 { background:rgba(30,41,59,.5); }
.auto-inline-2 { background-color:rgba(22, 163, 74, 0.2); color:#4ade80; border-color:#22c55e;; }
.auto-inline-3 { width: 120px; height: 120px; border: 3px solid #8b5cf6;; }
.auto-inline-4 { cursor: pointer; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;; }
.auto-inline-5 { background-color:#0f172a !important; color:#94a3b8 !important; cursor:not-allowed;; }
.auto-inline-6 { background:rgba(15,23,42,.6);border:1px solid rgba(71,85,105,.5); }
.auto-inline-7 { cursor: pointer; transition: background 0.2s;; }
.auto-inline-8 { border-color: rgba(71,85,105,.5) !important;; }
.auto-inline-9 { background:rgba(30,41,59,0.8); border:1px solid rgba(255,255,255,0.05);; }
.auto-inline-10 { width: 80px; height: 80px; flex-shrink: 0;; }
.auto-inline-11 { letter-spacing: 1px;; }
</style>
