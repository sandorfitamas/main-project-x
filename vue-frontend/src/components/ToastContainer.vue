<template>
  <div class="toast-wrap">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="['toast-item', `toast-${toast.type}`]"
      :style="{ opacity: toast.fading ? 0 : 1 }"
    >
      <i :class="['bi', iconMap[toast.type] || 'bi-info-circle-fill', 'flex-shrink-0']"></i>
      <span>{{ toast.message }}</span>
    </div>
  </div>
</template>

<script setup>
import { useToast } from '../stores/toast.js';
const { toasts } = useToast();

const iconMap = {
  success: 'bi-check-circle-fill',
  error: 'bi-x-circle-fill',
  warning: 'bi-exclamation-triangle-fill',
  info: 'bi-info-circle-fill',
};
</script>
