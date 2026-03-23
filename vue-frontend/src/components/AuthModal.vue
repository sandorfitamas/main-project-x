<template>
  <Teleport to="body">
    <div class="modal fade modal-dark" :class="{ show: visible }" :style="{ display: visible ? 'block' : 'none' }" tabindex="-1" @click.self="close">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="background:#0f172a;border:1px solid #334155;color:#e2e8f0;border-radius:16px">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold" style="background:linear-gradient(90deg,#a78bfa,#e879f9);-webkit-background-clip:text;-webkit-text-fill-color:transparent">
              {{ isLogin ? 'Bejelentkezés' : 'Regisztráció' }}
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="close"></button>
          </div>
          <div class="modal-body p-4">
            <!-- Bejelentkezés rész -->
            <form v-if="isLogin" @submit.prevent="handleLogin">
              <div class="mb-3">
                <label class="form-label text-secondary small">Email</label>
                <input v-model="loginEmail" type="email" class="form-control form-dark" placeholder="pelda@email.com" required />
              </div>
              <div class="mb-3">
                <label class="form-label text-secondary small">Jelszó</label>
                <input v-model="loginPassword" type="password" class="form-control form-dark" placeholder="••••••••" required />
              </div>
              <button type="submit" class="btn btn-gradient w-100 py-2 fw-semibold">Bejelentkezés</button>
            </form>
            <!-- Regisztráció rész -->
            <form v-else @submit.prevent="handleRegister">
              <div class="mb-3">
                <label class="form-label text-secondary small">Név</label>
                <input v-model="regName" type="text" class="form-control form-dark" placeholder="Teljes neved" required />
              </div>
              <div class="mb-3">
                <label class="form-label text-secondary small">Email</label>
                <input v-model="regEmail" type="email" class="form-control form-dark" placeholder="pelda@email.com" required />
              </div>
              <div class="mb-3">
                <label class="form-label text-secondary small">Jelszó</label>
                <input v-model="regPassword" type="password" class="form-control form-dark" placeholder="••••••••" required />
              </div>
              <div class="mb-3">
                <label class="form-label text-secondary small">Jelszó megerősítése</label>
                <input v-model="regPasswordConfirm" type="password" class="form-control form-dark" placeholder="••••••••" required />
              </div>
              <button type="submit" class="btn btn-gradient w-100 py-2 fw-semibold">Fiók létrehozása</button>
            </form>
            <div class="text-center mt-3">
              <span class="text-secondary small">{{ isLogin ? 'Nincs még fiókod?' : 'Már van fiókod?' }}</span>
              <button type="button" class="btn btn-link btn-sm p-0 ms-1 fw-semibold" style="color:#e879f9;text-decoration:none" @click="isLogin = !isLogin">
                {{ isLogin ? 'Regisztrálj most' : 'Bejelentkezés' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="visible" class="modal-backdrop fade show"></div>
  </Teleport>
</template>

<script setup>
import { ref, watch, inject } from 'vue';
import { useAuth } from '../stores/auth.js';

const props = defineProps({ visible: Boolean });
const emit = defineEmits(['update:visible', 'login-success', 'register-success']);

const showToast = inject('showToast');
const { login, register } = useAuth();

const isLogin = ref(true);
const loginEmail = ref('');
const loginPassword = ref('');
const regName = ref('');
const regEmail = ref('');
const regPassword = ref('');
const regPasswordConfirm = ref('');

watch(() => props.visible, (val) => {
  if (val) {
    isLogin.value = true;
    loginEmail.value = '';
    loginPassword.value = '';
    regName.value = '';
    regEmail.value = '';
    regPassword.value = '';
    regPasswordConfirm.value = '';
  }
  document.body.style.overflow = val ? 'hidden' : '';
});

function close() {
  emit('update:visible', false);
}

async function handleLogin() {
  const result = await login(loginEmail.value, loginPassword.value);
  if (result.success) {
    emit('login-success', result);
  } else {
    showToast(result.message || 'Hibás email vagy jelszó', 'error');
  }
}

async function handleRegister() {
  if (regPassword.value !== regPasswordConfirm.value) {
    showToast('A jelszavak nem egyeznek meg', 'error');
    return;
  }
  const result = await register(regName.value, regEmail.value, regPassword.value);
  if (result.success) {
    emit('register-success', result);
  } else {
    const msg = result.message || Object.values(result.errors || {})[0]?.[0] || 'Hiba a regisztráció során';
    showToast(msg, 'error');
  }
}
</script>
