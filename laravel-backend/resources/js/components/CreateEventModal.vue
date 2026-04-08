<template>
  <Teleport to="body">
    <div class="modal fade modal-dark" :class="{ show: visible }" :style="{ display: visible ? 'block' : 'none' }" tabindex="-1" @click.self="close">
      <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content" style="background:#0f172a;border:1px solid #334155;color:#e2e8f0;border-radius:16px">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold" style="background:linear-gradient(90deg,#a78bfa,#e879f9);-webkit-background-clip:text;-webkit-text-fill-color:transparent">
              Új Buli Létrehozása
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="close"></button>
          </div>
          <div class="modal-body p-4">
            <form id="create-form" @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label class="form-label text-secondary small">Esemény Címe *</label>
                <input v-model="form.title" type="text" class="form-control form-dark" placeholder="pl. Tetőterasz Nyitó" required />
              </div>
              <div class="row mb-3">
                <div class="col-6">
                  <label class="form-label text-secondary small">Dátum *</label>
                  <input v-model="form.date" type="date" class="form-control form-dark" :min="todayDate" required />
                </div>
                <div class="col-6">
                  <label class="form-label text-secondary small">Idő *</label>
                  <input v-model="form.time" type="time" class="form-control form-dark" :min="minTime" required />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label text-secondary small">Város *</label>
                <input v-model="locationData.city" type="text" class="form-control form-dark" placeholder="pl. Budapest" required />
              </div>
              <div class="row mb-3">
                <div class="col-4" v-if="locationData.city && (locationData.city.toLowerCase().trim() === 'budapest' || locationData.city.toLowerCase().trim() === 'bp' || locationData.city.toLowerCase().trim() === 'bp.')">
                  <label class="form-label text-secondary small">Kerület</label>
                  <input v-model="locationData.district" type="text" class="form-control form-dark" placeholder="pl. VII." />
                </div>
                <div :class="(locationData.city && (locationData.city.toLowerCase().trim() === 'budapest' || locationData.city.toLowerCase().trim() === 'bp' || locationData.city.toLowerCase().trim() === 'bp.')) ? 'col-5' : 'col-8'">
                  <label class="form-label text-secondary small">Utca *</label>
                  <input v-model="locationData.street" type="text" class="form-control form-dark" placeholder="pl. Deák tér" required />
                </div>
                <div :class="(locationData.city && (locationData.city.toLowerCase().trim() === 'budapest' || locationData.city.toLowerCase().trim() === 'bp' || locationData.city.toLowerCase().trim() === 'bp.')) ? 'col-3' : 'col-4'">
                  <label class="form-label text-secondary small">Házszám *</label>
                  <input v-model="locationData.houseNumber" type="text" class="form-control form-dark" placeholder="pl. 1" required />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label text-secondary small">Szervező</label>
                <input v-model="form.organizer" type="text" class="form-control form-dark" placeholder="A te neved" />
              </div>
              <div class="row mb-3">
                <div class="col-6">
                  <label class="form-label text-secondary small">Telefonszám</label>
                  <div class="input-group">
                    <span class="input-group-text form-dark border-secondary text-secondary">+36</span>
                    <select v-model="phoneData.prefix" class="form-select form-dark border-secondary" style="max-width: 80px;">
                      <option value="20">20</option>
                      <option value="30">30</option>
                      <option value="70">70</option>
                    </select>
                    <input v-model="phoneData.number" type="tel" class="form-control form-dark" placeholder="123 4567" maxlength="9" />
                  </div>
                </div>
                <div class="col-6">
                  <label class="form-label text-secondary small">Kategória</label>
                  <select v-model="form.category" class="form-select form-dark">
                    <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                  </select>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label text-secondary small">Leírás</label>
                <textarea v-model="form.description" rows="3" class="form-control form-dark" placeholder="Írd le az esemény részleteit..."></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label text-secondary small d-block mb-2">Esemény képe</label>
                <label v-if="!imagePreview" class="upload-area d-flex flex-column align-items-center justify-content-center w-100 py-4" style="cursor:pointer">
                  <div class="text-center">
                    <i class="bi bi-cloud-upload fs-2 text-secondary d-block mb-2"></i>
                    <span class="text-secondary small">Kattints a feltöltéshez</span>
                    <span class="text-muted d-block" style="font-size:.75rem">PNG, JPG, GIF (max. 5MB)</span>
                  </div>
                  <input type="file" accept="image/*" class="d-none" @change="onFileChange" />
                </label>
                <div v-else class="mt-2 position-relative rounded-3 overflow-hidden border border-secondary">
                  <img :src="imagePreview" alt="Preview" class="w-100" style="height:180px;object-fit:cover" />
                  <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle p-1"
                          style="width:30px;height:30px;display:flex;align-items:center;justify-content:center" @click="removeImage">
                    <i class="bi bi-x" style="font-size:.8rem"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-outline-secondary" @click="close">Mégse</button>
            <button type="submit" form="create-form" class="btn btn-gradient px-4 fw-semibold">Buli Közzététele</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="visible" class="modal-backdrop fade show"></div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch, inject, computed } from 'vue';
import { useEvents } from '../stores/events.js';

const props = defineProps({ visible: Boolean });
const emit = defineEmits(['update:visible', 'created']);

const showToast = inject('showToast');
const { createEvent } = useEvents();

const categories = ['Házibuli', 'Klub', 'Fesztivál', 'Rave', 'Chill', 'Egyéb'];

const todayDate = computed(() => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
});

const minTime = computed(() => {
  if (form.date === todayDate.value) {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${min}`;
  }
  return null;
});

const form = reactive({
  title: '', date: '', time: '', location: '', organizer: '',
  contact_phone: '', category: 'Házibuli', description: '',
});

const phoneData = reactive({ prefix: '30', number: '' });

watch(phoneData, (newVal) => {
  if (newVal.number && newVal.number.trim() !== '') {
    form.contact_phone = `+36 ${newVal.prefix} ${newVal.number.trim().replace(/\s/g, '').replace(/(\d{3})(\d{0,4})/, '$1 $2').trim()}`;
  } else {
    form.contact_phone = '';
  }
}, { deep: true });

const locationData = reactive({
  city: '',
  district: '',
  street: '',
  houseNumber: ''
});

watch(locationData, (newVal) => {
  let loc = newVal.city ? newVal.city.trim() : '';
  const isBp = loc.toLowerCase() === 'budapest' || loc.toLowerCase() === 'bp' || loc.toLowerCase() === 'bp.';
  
  if (isBp) {
    loc = 'Budapest';
    if (newVal.district && newVal.district.trim()) {
      loc += `, ${newVal.district.trim()}`;
      if (!loc.toLowerCase().includes('kerület') && !loc.toLowerCase().includes('ker.')) {
        loc += ' ker.';
      }
    }
  }

  if (newVal.street && newVal.street.trim()) {
    loc += (loc ? ', ' : '') + newVal.street.trim();
  }

  if (newVal.houseNumber && newVal.houseNumber.trim()) {
    loc += (loc ? ' ' : '') + newVal.houseNumber.trim() + '.';
  }

  form.location = loc;
}, { deep: true });

const imageFile = ref(null);
const imagePreview = ref(null);

watch(() => props.visible, (val) => {
  if (val) {
    Object.assign(form, { title: '', date: '', time: '', location: '', organizer: '', contact_phone: '', category: 'Házibuli', description: '' });
    Object.assign(locationData, { city: '', district: '', street: '', houseNumber: '' });
    Object.assign(phoneData, { prefix: '30', number: '' });
    imageFile.value = null;
    imagePreview.value = null;
  }
  document.body.style.overflow = val ? 'hidden' : '';
});

function close() { emit('update:visible', false); }

function onFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  imageFile.value = file;
  const reader = new FileReader();
  reader.onload = ev => { imagePreview.value = ev.target.result; };
  reader.readAsDataURL(file);
}

function removeImage() {
  imageFile.value = null;
  imagePreview.value = null;
}

async function handleSubmit() {
  const fd = new FormData();
  Object.entries(form).forEach(([k, v]) => fd.append(k, v));
  const result = await createEvent(fd, imageFile.value);
  if (result.success) {
    emit('created');
  } else {
    const msg = result.message || Object.values(result.errors || {})[0]?.[0] || 'Hiba a létrehozás során';
    showToast(msg, 'error');
  }
}
</script>
