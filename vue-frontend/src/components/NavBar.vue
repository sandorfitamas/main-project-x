<template>
  <nav class="navbar-custom sticky-top py-2 px-3 px-md-4" style="z-index: 1060;">
    <div class="container-xl d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center gap-2" style="cursor:pointer" @click="$emit('show-all-events')">
        <div class="logo-icon"><i class="bi bi-lightning-fill text-white fs-5"></i></div>
        <span class="logo-text">PROJECT X</span>
      </div>
      <div class="d-none d-md-flex align-items-center gap-4">
        <a href="#" class="nav-link-dark" @click.prevent="$emit('show-home')">Kezdőlap</a>
        <a href="#" class="nav-link-dark" @click.prevent="$emit('show-all-events')">Események</a>
        <a href="#" class="nav-link-dark" @click.prevent="$emit('show-community')">Közösség</a>
      </div>
      <div class="position-relative">
        <button v-if="!currentUser" class="btn btn-gradient btn-sm px-3 py-2 fw-semibold" @click="$emit('show-auth')">
          <i class="bi bi-person me-1"></i> Bejelentkezés
        </button>
        <button v-else ref="authBtnRef" class="btn btn-gradient btn-sm px-3 py-2 fw-semibold" @click="toggleDropdown">
          <div class="d-flex align-items-center gap-2">
            <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                 style="width:32px;height:32px;background:linear-gradient(135deg,#7c3aed,#d946ef);font-size:.75rem">
              {{ initials }}
            </div>
            <span class="d-none d-md-inline" style="font-size:.85rem">{{ currentUser?.name }}</span>
            <i class="bi bi-chevron-down" style="font-size:.7rem"></i>
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
          <hr style="border-color:#334155;margin:.25rem 0">
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

const props = defineProps({
  currentUser: { type: Object, default: null },
});

defineEmits(['show-auth', 'show-all-events', 'show-my-events', 'show-favorites', 'show-community', 'logout', 'create-event', 'show-profile']);

const dropdownOpen = ref(false);
const authBtnRef = ref(null);

const initials = computed(() => {
  return props.currentUser?.name ? String(props.currentUser.name).substring(0, 2).toUpperCase() : '?';
});

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

function handleClickOutside(e) {
  if (dropdownOpen.value && authBtnRef.value && !authBtnRef.value.contains(e.target)) {
    const dd = document.querySelector('.user-dropdown');
    if (dd && !dd.contains(e.target)) {
      dropdownOpen.value = false;
    }
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>
