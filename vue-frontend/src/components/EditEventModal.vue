<template>
  <Teleport to="body">
    <div class="modal fade modal-dark" :class="{ show: visible }" :style="{ display: visible ? 'block' : 'none', overflowY: 'hidden !important' }" tabindex="-1" @click.self="close">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable auto-inline-1">
        <div class="modal-content auto-inline-2">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold auto-inline-3">Esemény szerkesztése</h5>
            <button type="button" class="btn-close btn-close-white" @click="close"></button>
          </div>
          <div class="modal-body p-4">
            <form id="edit-form" @submit.prevent="handleSubmit">
              <div class="mb-3"><label class="form-label text-secondary small">Esemény Címe *</label><input v-model="form.title" type="text" class="form-control form-dark" maxlength="25" required /></div>
              <div class="row mb-3">
                <div class="col-6"><label class="form-label text-secondary small">Dátum *</label><input v-model="form.date" type="date" class="form-control form-dark" required /></div>
                <div class="col-6"><label class="form-label text-secondary small">Idő *</label><input v-model="form.time" type="time" class="form-control form-dark" required /></div>
              </div>
              <div class="row mb-3">
                <div class="col-4">
                  <label class="form-label text-secondary small">Irányítószám *</label>
                  <input v-model="locationData.zipCode" type="text" class="form-control form-dark" placeholder="pl. 1051" required />
                </div>
                <div class="col-8 position-relative">
                  <label class="form-label text-secondary small">Város *</label>
                  <input v-model="locationData.city" type="text" class="form-control form-dark custom-arrow" placeholder="pl. Budapest" required @focus="cityDropdownOpen = true" @blur="closeCityDropdown" />
                  <ul v-if="cityDropdownOpen && filteredCities.length" class="dropdown-menu dropdown-menu-dark show position-absolute w-100 mt-1 shadow auto-inline-4">
                    <li v-for="city in filteredCities" :key="city">
                      <a class="dropdown-item text-light auto-inline-5" @click.prevent="selectCity(city)">
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
                <div class="col-6"><label class="form-label text-secondary small">Szervező</label><input v-model="form.organizer" type="text" class="form-control form-dark" /></div>
                <div class="col-6"><label class="form-label text-secondary small">Belépő ára</label><input v-model="form.price" @blur="formatPrice" type="text" class="form-control form-dark" /></div>
              </div>
              <div class="row mb-3">
                <div class="col-12 col-md-6 mb-3 mb-md-0">
                  <label class="form-label text-secondary small">Telefonszám</label>
                  <div class="input-group">
                    <span class="input-group-text form-dark border-secondary text-secondary">+36</span>
                    <select v-model="phoneData.prefix" class="form-select form-dark border-secondary auto-inline-6">
                      <option value="20">20</option>
                      <option value="30">30</option>
                      <option value="70">70</option>
                    </select>
                    <input v-model="phoneData.number" type="tel" class="form-control form-dark" placeholder="123 4567" maxlength="9" />
                  </div>
                </div>
                <div class="col-12 col-md-6"><label class="form-label text-secondary small">Kategória</label>
                  <select v-model="form.category" class="form-select form-dark"><option v-for="category in cats" :key="category" :value="category">{{ category }}</option></select>
                </div>
              </div>
              <div class="mb-3"><label class="form-label text-secondary small">Leírás</label><textarea v-model="form.description" rows="3" class="form-control form-dark auto-inline-7"></textarea></div>
              <div class="mb-3">
                <label class="form-label text-secondary small">Címkék (maximum 3 választható)</label>
                <div class="position-relative">
                  <div v-if="tagDropdownOpen" class="position-fixed w-100 h-100 top-0 start-0 auto-inline-8" @click="tagDropdownOpen = false"></div>
                  <div class="form-control form-dark custom-arrow d-flex flex-wrap gap-1 align-items-center auto-inline-9" @click="tagDropdownOpen = !tagDropdownOpen">
                    <span v-if="form.tags.length === 0" class="text-secondary opacity-50">Válassz címkéket...</span>
                    <span v-for="tag in form.tags" :key="tag" class="badge rounded-pill auto-inline-10" @click.stop="toggleTag(tag)">
                      {{ tag }} <i class="bi bi-x-circle ms-1"></i>
                    </span>
                  </div>
                  <ul v-if="tagDropdownOpen" class="dropdown-menu dropdown-menu-dark show position-absolute w-100 mt-1 shadow auto-inline-11">
                    <li v-for="tag in availableTags" :key="tag">
                      <a class="dropdown-item text-light d-flex justify-content-between align-items-center auto-inline-12" @click.stop="toggleTag(tag)">
                        {{ tag }}
                        <i v-if="form.tags.includes(tag)" class="bi bi-check text-success fs-5"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label text-secondary small d-block mb-2">Esemény képe</label>
                <div v-if="existingImg && !newPrev" class="mb-2"><p class="text-secondary small mb-1">Jelenlegi kép:</p><img :src="existingImg" class="rounded-3 border border-secondary w-100 auto-inline-13" /></div>
                <label v-if="!newPrev" class="upload-area d-flex flex-column align-items-center justify-content-center w-100 py-3 auto-inline-14">
                  <i class="bi bi-cloud-upload fs-2 text-secondary d-block mb-1"></i><span class="text-secondary small">Új kép feltöltése</span>
                  <input type="file" accept="image/*" class="d-none" @change="onFile" />
                </label>
                <div v-if="newPrev" class="mt-2 position-relative rounded-3 overflow-hidden border border-secondary">
                  <img :src="newPrev" class="w-100 auto-inline-13" />
                  <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle p-1 auto-inline-15" @click="newFile=null;newPrev=null"><i class="bi bi-x"></i></button>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer border-0 justify-content-between">
            <button type="button" class="btn btn-outline-danger btn-sm" @click="handleDelete"><i class="bi bi-trash me-1"></i>Törlés</button>
            <div class="d-flex gap-2"><button type="button" class="btn btn-outline-secondary btn-sm" @click="close">Mégse</button><button type="submit" form="edit-form" class="btn btn-gradient btn-sm px-4 fw-semibold">Mentés</button></div>
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
import {
  enforceMaxDigitsWithFallback,
  stripDigitsAndLimit,
  normalizePriceInput,
  formatPriceOnBlur,
  sanitizePhoneLocalNumber,
  formatHungarianPhone,
  sanitizeCity,
  sanitizeZipCode,
  sanitizeDistrict,
  sanitizeStreet,
  sanitizeHouseNumber,
} from '../utils/validators.js';
const props = defineProps({ visible: Boolean, event: { type: Object, default: null } });
const emit = defineEmits(['update:visible', 'updated', 'deleted']);
const showToast = inject('showToast');
const { updateEvent, deleteEvent } = useEvents();
const cats = ['Házibuli','Klub','Fesztivál','Rave','Chill','Egyéb'];
const availableTags = ['Ingyenes', 'VIP', 'Szabadtéri', 'Terasz', '18+', 'Techno', 'Rock', 'Pop', 'Élőzene', 'Hip-Hop'];
const form = reactive({ title:'',date:'',time:'',location:'',organizer:'',price:'',contact_phone:'',category:'Egyéb',description:'',tags:[] });

watch(() => form.title, (newVal, oldVal) => {
  const validated = enforceMaxDigitsWithFallback(newVal, oldVal, 2);
  if (validated !== newVal) form.title = validated;
});

watch(() => form.description, (newVal, oldVal) => {
  const validated = enforceMaxDigitsWithFallback(newVal, oldVal, 2, 100);
  if (validated !== newVal) form.description = validated;
});

watch(() => form.organizer, (newVal) => {
  const cleaned = stripDigitsAndLimit(newVal, 15);
  if (cleaned !== newVal) form.organizer = cleaned;
});

watch(() => form.price, (newVal, oldVal) => {
  const normalized = normalizePriceInput(newVal, oldVal, 5);
  if (normalized !== newVal) form.price = normalized;
});

const phoneData = reactive({ prefix: '30', number: '' });

watch(() => phoneData.number, (newVal) => {
  const cleaned = sanitizePhoneLocalNumber(newVal, 7);
  if (cleaned !== newVal) phoneData.number = cleaned;
});

watch(phoneData, (newVal) => {
  form.contact_phone = formatHungarianPhone(newVal.prefix, newVal.number);
}, { deep: true });

const locationData = reactive({ zipCode: '', city: '', district: '', street: '', houseNumber: '' });

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
  const cleaned = sanitizeCity(newVal, 15);
  if (cleaned !== newVal) locationData.city = cleaned;
});

watch(() => locationData.zipCode, (newVal) => {
  const cleaned = sanitizeZipCode(newVal, 4);
  if (cleaned !== newVal) locationData.zipCode = cleaned;
});

watch(() => locationData.district, (newVal) => {
  const cleaned = sanitizeDistrict(newVal, 5);
  if (cleaned !== newVal) locationData.district = cleaned;
});

watch(() => locationData.street, (newVal) => {
  const cleaned = sanitizeStreet(newVal, 25);
  if (cleaned !== newVal) locationData.street = cleaned;
});

watch(() => locationData.houseNumber, (newVal) => {
  const result = sanitizeHouseNumber(newVal, 5, 3, 1, 1);
  if (result !== newVal) locationData.houseNumber = result;
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
    loc += (loc ? ' ' : '') + newVal.houseNumber.trim() + (newVal.houseNumber.trim().endsWith('.') ? '' : '.');
  }
  form.location = loc;
}, { deep: true });

const existingImg = ref(null);
const newFile = ref(null);
const newPrev = ref(null);
const tagDropdownOpen = ref(false);

function toggleTag(tag) {
  const tagIndex = form.tags.indexOf(tag);
  if (tagIndex > -1) {
    form.tags.splice(tagIndex, 1);
  } else if (form.tags.length < 3) {
    form.tags.push(tag);
  }
}
watch(() => props.event, eventData => {
  if (!eventData) return;
  form.title=eventData.title||''; form.date=eventData.date||''; form.time=eventData.time?eventData.time.substring(0,5):'';
  form.location=eventData.location||''; form.organizer=eventData.organizer||''; form.price=eventData.price||''; form.contact_phone=eventData.contact_phone||'';
  form.category=eventData.category||'Egyéb'; form.description=eventData.description||'';
  
  if (eventData.contact_phone) {
    const cleaned = eventData.contact_phone.trim().replace(/\s/g, '');
    if (cleaned.startsWith('+36')) {
      phoneData.prefix = cleaned.substring(3, 5);
      phoneData.number = cleaned.substring(5).replace(/(\d{3})(\d{0,4})/, '$1 $2').trim();
    } else if (cleaned.startsWith('06')) {
      phoneData.prefix = cleaned.substring(2, 4);
      phoneData.number = cleaned.substring(4).replace(/(\d{3})(\d{0,4})/, '$1 $2').trim();
    }
  } else {
    Object.assign(phoneData, { prefix: '30', number: '' });
  }

  if (eventData.location) {
    const parts = eventData.location.split(',').map(part => part.trim());
    let zip = '';
    let cityName = parts[0] || '';
    
    const zipMatch = cityName.match(/^(\d{4})\s+(.*)$/);
    if (zipMatch) {
      zip = zipMatch[1];
      cityName = zipMatch[2].trim();
    }
    locationData.zipCode = zip;

    if (cityName && (cityName.toLowerCase() === 'budapest' || cityName.toLowerCase() === 'bp' || cityName.toLowerCase() === 'bp.')) {
      locationData.city = 'Budapest';
      if (parts.length >= 3) { // Budapest, VII. ker., Deák tér 1.
        locationData.district = parts[1].replace(/ker\.|kerület/gi, '').trim();
        const streetHouse = parts.slice(2).join(', ');
        const match = streetHouse.match(/(.*?)\s+(\d+.*)/);
        if (match) {
          locationData.street = match[1].trim();
          locationData.houseNumber = match[2].replace(/\.$/, '').trim();
        } else {
          locationData.street = streetHouse;
          locationData.houseNumber = '';
        }
      } else if (parts.length === 2) { // Budapest, Deák tér 1.
        locationData.district = '';
        const match = parts[1].match(/(.*?)\s+(\d+.*)/);
        if (match) {
          locationData.street = match[1].trim();
          locationData.houseNumber = match[2].replace(/\.$/, '').trim();
        } else {
          locationData.street = parts[1];
          locationData.houseNumber = '';
        }
      }
    } else { // Más város
      locationData.city = cityName || '';
      locationData.district = '';
      if (parts.length > 1) {
        const streetHouse = parts.slice(1).join(', ');
        const match = streetHouse.match(/(.*?)\s+(\d+.*)/);
        if (match) {
          locationData.street = match[1].trim();
          locationData.houseNumber = match[2].replace(/\.$/, '').trim();
        } else {
          locationData.street = streetHouse;
          locationData.houseNumber = '';
        }
      } else {
        locationData.street = '';
        locationData.houseNumber = '';
      }
    }
  } else {
    Object.assign(locationData, { zipCode: '', city: '', district: '', street: '', houseNumber: '' });
  }

  form.tags = Array.isArray(eventData.tags) ? eventData.tags.map(tag => tag.trim()) : (eventData.tags ? eventData.tags.split(',').map(tag => tag.trim()) : []);
  existingImg.value=eventData.imageUrl||null; newFile.value=null; newPrev.value=null;
  tagDropdownOpen.value = false;
}, { immediate: true });
watch(() => props.visible, isVisible => { document.body.style.overflow = isVisible ? 'hidden' : ''; document.documentElement.style.overflow = isVisible ? 'hidden' : ''; });
function close() { emit('update:visible', false); }
function onFile(event) { const selectedFile=event.target.files[0]; if(!selectedFile)return; newFile.value=selectedFile; const fileReader=new FileReader(); fileReader.onload=loadEvent=>{newPrev.value=loadEvent.target.result}; fileReader.readAsDataURL(selectedFile); }

function formatPrice() {
  form.price = formatPriceOnBlur(form.price);
}

function formatPhone() {
  if (form.contact_phone) {
    let phoneValue = form.contact_phone.trim();
    if (phoneValue.startsWith('06')) {
      phoneValue = '+36' + phoneValue.substring(2);
    }
    let cleanedPhone = phoneValue.replace(/[^\d+]/g, '');
    let hasLeadingPlus = cleanedPhone.startsWith('+');
    let phoneDigits = cleanedPhone.replace(/\+/g, '').substring(0, 11);
    let formattedPhone = hasLeadingPlus ? '+' : '';
    if (phoneDigits.length > 0) formattedPhone += phoneDigits.substring(0, 2);
    if (phoneDigits.length > 2) formattedPhone += ' ' + phoneDigits.substring(2, 4);
    if (phoneDigits.length > 4) formattedPhone += ' ' + phoneDigits.substring(4, 7);
    if (phoneDigits.length > 7) formattedPhone += ' ' + phoneDigits.substring(7, 11);
    form.contact_phone = formattedPhone;
  }
}

async function handleSubmit() {
  if(!props.event)return; 
  if (form.tags.length === 0) {
    showToast('Kérjük, válassz legalább egy címkét!', 'error');
    return;
  }
  const fd=new FormData();
  Object.entries(form).forEach(([fieldName, fieldValue])=>fd.append(fieldName, Array.isArray(fieldValue) ? fieldValue.join(', ') : fieldValue));
  const result = await updateEvent(props.event.id, fd, newFile.value, existingImg.value);
  if(result.success) emit('updated');
  else showToast(result.message||Object.values(result.errors||{})[0]?.[0]||'Hiba', 'error');
}
async function handleDelete() {
  if(!props.event||!confirm('Biztosan törölni szeretnéd?'))return;
  const deleteResult = await deleteEvent(props.event.id);
  if(deleteResult.success) emit('deleted'); else showToast(deleteResult.message||'Nem sikerült törölni','error');
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
.auto-inline-1 { max-height: 85vh;; }
.auto-inline-2 { background:#0f172a;border:1px solid #334155;color:#e2e8f0;border-radius:16px; max-height: 80vh;; }
.auto-inline-3 { background:linear-gradient(90deg,#a78bfa,#e879f9);-webkit-background-clip:text;-webkit-text-fill-color:transparent; }
.auto-inline-4 { max-height: 155px; overflow-y: auto; z-index: 1051; background: #1e293b; border-color: #334155;; }
.auto-inline-5 { cursor: pointer;; }
.auto-inline-6 { max-width: 80px;; }
.auto-inline-7 { resize: none;; }
.auto-inline-8 { z-index: 1049;; }
.auto-inline-9 { min-height:38px;cursor:pointer;position:relative;z-index:1050;; }
.auto-inline-10 { background:#d946ef;font-size:0.75rem;; }
.auto-inline-11 { max-height:150px;overflow-y:auto;z-index:1051;background:#1e293b;border-color:#334155;; }
.auto-inline-12 { cursor:pointer;; }
.auto-inline-13 { height:150px;object-fit:cover; }
.auto-inline-14 { cursor:pointer; }
.auto-inline-15 { width:30px;height:30px;display:flex;align-items:center;justify-content:center; }
</style>
