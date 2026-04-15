<template>
  <Teleport to="body">
    <div class="modal fade modal-dark" :class="{ show: visible }" :style="{ display: visible ? 'block' : 'none', overflowY: 'hidden !important' }" tabindex="-1" @click.self="close">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" style="max-height: 85vh;">
        <div class="modal-content" style="background:#0f172a;border:1px solid #334155;color:#e2e8f0;border-radius:16px; max-height: 80vh;">
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
                <input v-model="form.title" type="text" class="form-control form-dark" placeholder="pl. Tetőterasz Nyitó" maxlength="25" required />
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
              <div class="row mb-3">
                <div class="col-4">
                  <label class="form-label text-secondary small">Irányítószám *</label>
                  <input v-model="locationData.zipCode" type="text" class="form-control form-dark" placeholder="pl. 1051" required />
                </div>
                <div class="col-8 position-relative">
                  <label class="form-label text-secondary small">Város *</label>
                  <input v-model="locationData.city" type="text" class="form-control form-dark custom-arrow" placeholder="pl. Budapest" required @focus="cityDropdownOpen = true" @blur="closeCityDropdown" />
                  <ul v-if="cityDropdownOpen && filteredCities.length" class="dropdown-menu dropdown-menu-dark show position-absolute w-100 mt-1 shadow" style="max-height: 155px; overflow-y: auto; z-index: 1051; background: #1e293b; border-color: #334155;">
                    <li v-for="city in filteredCities" :key="city">
                      <a class="dropdown-item text-light" style="cursor: pointer;" @click.prevent="selectCity(city)">
                        {{ city }}
                      </a>
                    </li>
                  </ul>
                </div>
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
              <div class="row mb-3">
                <div class="col-6">
                  <label class="form-label text-secondary small">Szervező</label>
                  <input v-model="form.organizer" type="text" class="form-control form-dark" placeholder="A te neved" />
                </div>
                <div class="col-6">
                  <label class="form-label text-secondary small">Belépő ára</label>
                  <input v-model="form.price" @blur="formatPrice" type="text" class="form-control form-dark" placeholder="pl. Ingyenes vagy 2500 Ft" />
                </div>
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
                <textarea v-model="form.description" rows="3" class="form-control form-dark" style="resize: none;" placeholder="Írd le az esemény részleteit..."></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label text-secondary small">Címkék (maximum 3 választható)</label>
                <div class="position-relative">
                  <div v-if="tagDropdownOpen" class="position-fixed w-100 h-100 top-0 start-0" @click="tagDropdownOpen = false" style="z-index: 1049;"></div>
                  <div class="form-control form-dark custom-arrow d-flex flex-wrap gap-1 align-items-center" style="min-height:38px;cursor:pointer;position:relative;z-index:1050;" @click="tagDropdownOpen = !tagDropdownOpen">
                    <span v-if="form.tags.length === 0" class="text-secondary opacity-50">Válassz címkéket...</span>
                    <span v-for="t in form.tags" :key="t" class="badge rounded-pill" style="background:#d946ef;font-size:0.75rem;" @click.stop="toggleTag(t)">
                      {{ t }} <i class="bi bi-x-circle ms-1"></i>
                    </span>
                  </div>
                  <ul v-if="tagDropdownOpen" class="dropdown-menu dropdown-menu-dark show position-absolute w-100 mt-1 shadow" style="max-height:150px;overflow-y:auto;z-index:1051;background:#1e293b;border-color:#334155;">
                    <li v-for="t in availableTags" :key="t">
                      <a class="dropdown-item text-light d-flex justify-content-between align-items-center" style="cursor:pointer;" @click.stop="toggleTag(t)">
                        {{ t }}
                        <i v-if="form.tags.includes(t)" class="bi bi-check text-success fs-5"></i>
                      </a>
                    </li>
                  </ul>
                </div>
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
const availableTags = ['Ingyenes', 'VIP', 'Szabadtéri', 'Terasz', '18+', 'Techno', 'Rock', 'Pop', 'Élőzene', 'Hip-Hop'];

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
  title: '', date: '', time: '', location: '', organizer: '', price: '',
  contact_phone: '', category: 'Házibuli', description: '', tags: [],
});

watch(() => form.title, (newVal, oldVal) => {
  if (newVal) {
    const digits = newVal.match(/\d/g);
    if (digits && digits.length > 2) {
      form.title = oldVal || '';
    }
  }
});

watch(() => form.description, (newVal, oldVal) => {
  if (newVal) {
    let check = newVal.length > 100 ? newVal.substring(0, 100) : newVal;
    const digits = check.match(/\d/g);
    if (digits && digits.length > 2) {
      check = oldVal || '';
    }
    if (check !== newVal) form.description = check;
  }
});

watch(() => form.organizer, (newVal) => {
  if (newVal) {
    let cleaned = newVal.replace(/\d/g, '');
    if (cleaned.length > 15) cleaned = cleaned.substring(0, 15);
    if (cleaned !== newVal) form.organizer = cleaned;
  }
});

watch(() => form.price, (newVal, oldVal) => {
  if (newVal) {
    if ((newVal.toLowerCase() === 'i' || newVal.toLowerCase() === 'in') && (!oldVal || newVal.length > oldVal.length)) {
      form.price = 'Ingyenes';
      return;
    }
    if (newVal === 'Ingyenes' || 'Ingyenes'.startsWith(newVal)) return;
    
    if (newVal.endsWith(' Ft')) {
      const numbersOnly = newVal.replace(/\D/g, '');
      if (numbersOnly.length > 5) {
        form.price = numbersOnly.substring(0, 5) + ' Ft';
      }
      return;
    }
    
    let cleaned = newVal.replace(/\D/g, '');
    if (cleaned.length > 5) cleaned = cleaned.substring(0, 5);
    if (cleaned !== newVal) form.price = cleaned;
  }
});

const phoneData = reactive({ prefix: '30', number: '' });

watch(() => phoneData.number, (newVal) => {
  if (newVal) {
    const cleaned = newVal.replace(/\D/g, '');
    if (cleaned !== newVal) phoneData.number = cleaned;
  }
});

watch(phoneData, (newVal) => {
  if (newVal.number && newVal.number.trim() !== '') {
    form.contact_phone = `+36 ${newVal.prefix} ${newVal.number.trim().replace(/\s/g, '').replace(/(\d{3})(\d{0,4})/, '$1 $2').trim()}`;
  } else {
    form.contact_phone = '';
  }
}, { deep: true });

const locationData = reactive({
  zipCode: '',
  city: '',
  district: '',
  street: '',
  houseNumber: ''
});

const cityDropdownOpen = ref(false);
const popularCities = [
  'Budapest', 'Debrecen', 'Szeged', 'Miskolc', 'Pécs', 'Győr', 'Nyíregyháza',
  'Kecskemét', 'Székesfehérvár', 'Szombathely', 'Érd', 'Szolnok', 'Tatabánya',
  'Kaposvár', 'Sopron', 'Veszprém', 'Békéscsaba', 'Zalaegerszeg', 'Eger',
  'Hódmezővásárhely', 'Nagykanizsa', 'Dunaújváros', 'Dunakeszi', 'Cegléd',
  'Szigetszentmiklós', 'Mosonmagyaróvár', 'Baja', 'Vác', 'Ózd', 'Gödöllő',
  'Pápa', 'Salgótarján', 'Esztergom', 'Ajka', 'Gyöngyös', 'Kazincbarcika',
  'Hajdúböszörmény', 'Gyál', 'Kiskunfélegyháza', 'Keszthely', 'Orosháza',
  'Komló', 'Vecsés', 'Makó', 'Monor', 'Mátészalka', 'Budaörs', 'Siófok',
  'Pilisvörösvár', 'Mohács'
];

const filteredCities = computed(() => {
  if (!locationData.city) return popularCities.slice(0, 5);
  const query = locationData.city.toLowerCase().trim();
  return popularCities
    .filter(city => city.toLowerCase().startsWith(query))
    .slice(0, 5);
});

const selectCity = (city) => {
  locationData.city = city;
  cityDropdownOpen.value = false;
};

const closeCityDropdown = () => {
  setTimeout(() => {
    cityDropdownOpen.value = false;
  }, 100);
};

watch(() => locationData.city, (newVal) => {
  if (newVal) {
    let cleaned = newVal.replace(/\d/g, ''); // no numbers allowed
    if (cleaned.length > 15) {
      cleaned = cleaned.substring(0, 15); // max 15 chars
    }
    if (cleaned !== newVal) {
      locationData.city = cleaned;
    }
  }
});

watch(() => locationData.zipCode, (newVal) => {
  if (newVal) {
    let cleaned = newVal.replace(/\D/g, ''); // csak számok
    if (cleaned.length > 4) {
      cleaned = cleaned.substring(0, 4); // max 4 karakter (magyar irányítószám)
    }
    if (cleaned !== newVal) {
      locationData.zipCode = cleaned;
    }
  }
});

watch(() => locationData.district, (newVal) => {
  if (newVal) {
    let cleaned = newVal.toUpperCase().replace(/[^IXV]/g, '');
    if (cleaned.length > 5) cleaned = cleaned.substring(0, 5);
    if (cleaned !== newVal) locationData.district = cleaned;
  }
});

watch(() => locationData.street, (newVal) => {
  if (newVal) {
    let cleaned = newVal.replace(/\d/g, ''); // no numbers allowed
    if (cleaned.length > 25) cleaned = cleaned.substring(0, 25);
    if (cleaned !== newVal) locationData.street = cleaned;
  }
});

watch(() => locationData.houseNumber, (newVal) => {
  if (newVal) {
    let result = '';
    let digits = 0;
    let letters = 0;
    let slashes = 0;

    for (let i = 0; i < newVal.length; i++) {
      const char = newVal[i];
      if (result.length >= 5) break;

      if (/[0-9]/.test(char)) {
        if (digits < 3) {
          result += char;
          digits++;
        }
      } else if (/[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]/.test(char)) {
        if (letters < 1) {
          result += char;
          letters++;
        }
      } else if (char === '/') {
        if (slashes < 1) {
          result += char;
          slashes++;
        }
      }
    }

    if (result !== newVal) locationData.houseNumber = result;
  }
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

  if (newVal.zipCode && newVal.zipCode.trim()) {
    loc = newVal.zipCode.trim() + ' ' + loc;
  }

  if (newVal.street && newVal.street.trim()) {
    loc += (loc ? ', ' : '') + newVal.street.trim();
  }

  if (newVal.houseNumber && newVal.houseNumber.trim()) {
    loc += (loc ? ' ' : '') + newVal.houseNumber.trim() + '.';
  }

  form.location = loc.trim();
}, { deep: true });

const imageFile = ref(null);
const imagePreview = ref(null);
const tagDropdownOpen = ref(false);

function toggleTag(t) {
  const idx = form.tags.indexOf(t);
  if (idx > -1) {
    form.tags.splice(idx, 1);
  } else if (form.tags.length < 3) {
    form.tags.push(t);
  }
}

watch(() => props.visible, (val) => {
  if (val) {
    Object.assign(form, { title: '', date: '', time: '', location: '', organizer: '', price: '', contact_phone: '', category: 'Házibuli', description: '', tags: [] });
    Object.assign(locationData, { city: '', district: '', street: '', houseNumber: '' });
    Object.assign(phoneData, { prefix: '30', number: '' });
    imageFile.value = null;
    imagePreview.value = null;
    tagDropdownOpen.value = false;
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

function formatPrice() {
  if (form.price) {
    const trimmed = form.price.trim();
    if (/^\d+$/.test(trimmed)) {
      form.price = trimmed + ' Ft';
    }
  }
}

function formatPhone() {
  if (form.contact_phone) {
    let val = form.contact_phone.trim();
    if (val.startsWith('06')) {
      val = '+36' + val.substring(2);
    }
    let cleaned = val.replace(/[^\d+]/g, '');
    let isPlus = cleaned.startsWith('+');
    let digits = cleaned.replace(/\+/g, '').substring(0, 11);
    let formatted = isPlus ? '+' : '';
    if (digits.length > 0) formatted += digits.substring(0, 2);
    if (digits.length > 2) formatted += ' ' + digits.substring(2, 4);
    if (digits.length > 4) formatted += ' ' + digits.substring(4, 7);
    if (digits.length > 7) formatted += ' ' + digits.substring(7, 11);
    form.contact_phone = formatted;
  }
}

async function handleSubmit() {
  const digitsMatch = form.title.match(/\d/g);
  if (digitsMatch && digitsMatch.length > 2) {
    showToast('Az esemény címében maximum 2 számjegy szerepelhet!', 'error');
    return;
  }
  
  if (!imageFile.value) {
    showToast('Kérjük, tölts fel egy képet az eseményhez!', 'error');
    return;
  }
  if (form.tags.length === 0) {
    showToast('Kérjük, válassz legalább egy címkét!', 'error');
    return;
  }
  const fd = new FormData();
  Object.entries(form).forEach(([k, v]) => fd.append(k, Array.isArray(v) ? v.join(', ') : v));
  const result = await createEvent(fd, imageFile.value);
  if (result.success) {
    emit('created');
  } else {
    const msg = result.message || Object.values(result.errors || {})[0]?.[0] || 'Hiba a létrehozás során';
    showToast(msg, 'error');
  }
}
</script>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator,
input[type="time"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}
select.form-select.form-dark,
input[type="text"].custom-arrow,
div.custom-arrow {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") !important;
  background-repeat: no-repeat !important;
  background-position: right 0.75rem center !important;
  background-size: 16px 12px !important;
  padding-right: 2.25rem !important;
}
</style>
