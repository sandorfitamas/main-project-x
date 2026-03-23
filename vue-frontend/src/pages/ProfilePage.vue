<template>
  <main class="flex-grow-1 container-xl px-3 px-md-4 py-5 d-flex justify-content-center align-items-center">
    <div class="col-12 col-md-8 col-lg-6">
      <div class="p-4 p-md-5 rounded-4 border border-secondary border-opacity-25" style="background:rgba(30,41,59,.5)">
        <h3 class="text-white fw-bold mb-4 text-center">Profil beállítások</h3>
        
        <div v-if="errorMsg" class="alert alert-danger p-3 mb-4">{{ errorMsg }}</div>
        <div v-if="successMsg" class="alert alert-success p-3 mb-4" style="background-color:rgba(22, 163, 74, 0.2); color:#4ade80; border-color:#22c55e;">
          {{ successMsg }}
        </div>

        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <label class="form-label text-secondary mb-1">Email cím (nem módosítható)</label>
            <input v-model="form.email" type="email" class="form-control form-dark px-3 py-2" style="background-color:#0f172a !important; color:#94a3b8 !important; cursor:not-allowed;" disabled />
          </div>
          
          <div class="mb-4">
            <label class="form-label text-secondary mb-1">Név</label>
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
  </main>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useAuth } from '../stores/auth.js';

const { currentUser, updateProfile } = useAuth();
const form = ref({ name: '', email: '', password: '' });
const loading = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

function loadUserData() {
  if (currentUser.value) {
    form.value.name = currentUser.value.name || '';
    form.value.email = currentUser.value.email || '';
    form.value.password = '';
  }
}

onMounted(() => {
  loadUserData();
});

watch(currentUser, () => {
  loadUserData();
});

async function submitForm() {
  loading.value = true;
  errorMsg.value = '';
  successMsg.value = '';
  
  const payload = { name: form.value.name };
  if (form.value.password) {
    payload.password = form.value.password;
  }
  
  const result = await updateProfile(payload);
  loading.value = false;
  
  if (result.success) {
    successMsg.value = 'Profil sikeresen frissítve!';
    form.value.password = '';
  } else {
    errorMsg.value = result.message || result.error || 'Hálózati hiba történt a mentés során.';
  }
}
</script>