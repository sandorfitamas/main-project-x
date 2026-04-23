<template>
  <nav class="navbar-custom sticky-top py-2 px-3 px-md-4 auto-inline-1">
    <div class="container-xl d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center gap-2 auto-inline-2" @click="$router.push('/home')">
        <div class="logo-icon"><i class="bi bi-lightning-fill text-white fs-5"></i></div>
        <span class="logo-text">PROJECT X</span>
      </div>
      <div class="d-none d-md-flex align-items-center gap-4">
        <a href="#" class="nav-link-dark" @click.prevent="$emit('show-home')">Kezdőlap</a>
        <a href="#" class="nav-link-dark" @click.prevent="$emit('show-all-events')">Események</a>
        <a href="#" class="nav-link-dark" @click.prevent="$emit('show-community')">Közösség</a>
      </div>
      <div class="position-relative d-flex align-items-center gap-3">
        <!-- Mobile Menu Toggle -->
        <button class="btn btn-link text-white p-0 d-md-none auto-inline-3" @click="mobileMenuOpen = !mobileMenuOpen" title="Menü">
          <i class="bi bi-list fs-3"></i>
        </button>
        <div v-if="mobileMenuOpen" class="user-dropdown d-md-none auto-inline-4">
          <button class="user-dropdown-btn" @click="mobileMenuOpen = false; $emit('show-home')">Kezdőlap</button>
          <button class="user-dropdown-btn" @click="mobileMenuOpen = false; $emit('show-all-events')">Események</button>
          <button class="user-dropdown-btn" @click="mobileMenuOpen = false; $emit('show-community')">Közösség</button>
        </div>
        <button v-if="currentUser" class="btn btn-link text-white position-relative p-0 auto-inline-3" @click="$router.push('/cart')" title="Kosár">
          <i class="bi bi-cart3 fs-4 auto-inline-5"></i>
          <span v-if="cartCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill shadow-sm auto-inline-11">
            {{ cartCount }}
          </span>
        </button>
        <button v-if="!currentUser" class="btn btn-gradient btn-sm px-3 py-2 fw-semibold" @click="$emit('show-auth')">
          <i class="bi bi-person me-1"></i> Bejelentkezés
        </button>
        <button v-else ref="authBtnRef" class="btn btn-gradient btn-sm px-3 py-2 fw-semibold" @click="toggleDropdown">
          <div class="d-flex align-items-center gap-2">
            <img v-if="currentUser?.profile_picture" :src="currentUser.profile_picture" alt="Profil" class="rounded-circle shadow-sm object-fit-cover auto-inline-6">
            <div v-else class="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white auto-inline-7"
                >
              {{ initials }}
            </div>
            <span class="d-none d-md-inline auto-inline-8">{{ currentUser?.name }}</span>
            <i class="bi bi-chevron-down auto-inline-9"></i>
          </div>
        </button>
        <div v-if="dropdownOpen" class="user-dropdown">
          <button class="user-dropdown-btn" @click="dropdownOpen = false; $emit('show-profile')">
            <i class="bi bi-person-lines-fill"></i> Profil
          </button>
          <button class="user-dropdown-btn" @click="dropdownOpen = false; $emit('show-my-events')">
            <i class="bi bi-person-circle"></i> Saját eseményeim
          </button>
          <button class="user-dropdown-btn" @click="dropdownOpen = false; $emit('show-favorites')">
            <i class="bi bi-heart"></i> Kedvenceim
          </button>
          <button v-if="currentUser?.is_admin" class="user-dropdown-btn text-warning" @click="dropdownOpen = false; $emit('show-admin')">
            <i class="bi bi-shield-lock"></i> Admin Panel
          </button>
          <hr class="auto-inline-10">
          <button class="user-dropdown-btn text-danger" @click="dropdownOpen = false; $emit('logout')">
            <i class="bi bi-box-arrow-right"></i> Kijelentkezés
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useCart } from '../stores/cart.js';

const { cartCount } = useCart();

const props = defineProps({
  currentUser: { type: Object, default: null },
});

defineEmits([
  'show-auth', 
  'show-all-events', 
  'show-my-events', 
  'show-favorites', 
  'show-community', 
  'logout', 
  'create-event', 
  'show-profile',
  'show-home',
  'show-admin'
]);

const dropdownOpen = ref(false);
const mobileMenuOpen = ref(false);
const authBtnRef = ref(null);

/**
 * Meghatározza a felhasználó monogramját a nevük alapján profilkép hiányában.
 */
const initials = computed(() => {
  return props.currentUser?.name 
    ? String(props.currentUser.name).substring(0, 2).toUpperCase() 
    : '?';
});

/**
 * Megnyitja vagy bezárja a felhasználói legördülő menüt.
 */
function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

/**
 * Zárja a legördülő menüket, ha a külső területre kattint a felhasználó.
 */
function handleClickOutside(event) {
  // Felhasználói profil legördülő figyelése
  if (dropdownOpen.value && authBtnRef.value && !authBtnRef.value.contains(event.target)) {
    const dropdownElement = document.querySelector('.user-dropdown');
    if (dropdownElement && !dropdownElement.contains(event.target)) {
      dropdownOpen.value = false;
    }
  }
  
  // Mobil menü figyelése
  if (mobileMenuOpen.value && event.target.closest('.d-md-none') === null) {
    mobileMenuOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>


<style scoped>
.auto-inline-1 { z-index: 1060;; }
.auto-inline-2 { cursor:pointer; }
.auto-inline-3 { text-decoration: none;; }
.auto-inline-4 { right: 50px;; }
.auto-inline-5 { color: #e879f9;; }
.auto-inline-6 { width:32px;height:32px;; }
.auto-inline-7 { width:32px;height:32px;background:linear-gradient(135deg,#7c3aed,#d946ef);font-size:.75rem; }
.auto-inline-8 { font-size:.85rem; }
.auto-inline-9 { font-size:.7rem; }
.auto-inline-10 { border-color:#334155;margin:.25rem 0; }
.auto-inline-11 { font-size: 0.65rem; background: linear-gradient(90deg,#7c3aed,#d946ef); }
</style>
