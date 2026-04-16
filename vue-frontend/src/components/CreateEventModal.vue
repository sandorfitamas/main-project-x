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
                <div class="col-12 col-md-6 mb-3 mb-md-0">
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
                <div class="col-12 col-md-6">
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

/** Fix kategóriák és címkék a modalhoz */
const categories = ['Házibuli', 'Klub', 'Fesztivál', 'Rave', 'Chill', 'Egyéb'];
const availableTags = ['Ingyenes', 'VIP', 'Szabadtéri', 'Terasz', '18+', 'Techno', 'Rock', 'Pop', 'Élőzene', 'Hip-Hop'];

/** Visszaadja a mai dátumot ÉÉÉÉ-HH-NN formátumban a date picker minimum értékéhez */
const todayDate = computed(() => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
});

/** Ha a kiválasztott dátum a mai, a jelenlegi idő lesz a minimum beállítható idő */
const minTime = computed(() => {
  if (form.date === todayDate.value) {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  return null;
});

/** Maga az esemény űrlapjának állapota */
const form = reactive({
  title: '', 
  date: '', 
  time: '', 
  location: '', 
  organizer: '', 
  price: '',
  contact_phone: '', 
  category: 'Házibuli', 
  description: '', 
  tags: [],
});

/** 
 * Cím validáció: Megakadályozzuk, hogy túl sok számot tartalmazzon (reklám tiltás).
 * Ha a bevitelben \d előfordul több mint 4-szer, a régit állítjuk vissza.
 */
watch(() => form.title, (newValue, oldValue) => {
  if (newValue) {
    const digitsInTitle = newValue.match(/\d/g);
    if (digitsInTitle && digitsInTitle.length > 4) {
      form.title = oldValue || '';
    }
  }
});

/**
 * Leírás validáció: Max 100 karakter, és a számokat is vizsgáljuk.
 */
watch(() => form.description, (newValue, oldValue) => {
  if (newValue) {
    let validatedText = newValue.length > 100 ? newValue.substring(0, 100) : newValue;
    const digitsInDescription = validatedText.match(/\d/g);
    if (digitsInDescription && digitsInDescription.length > 4) {
      validatedText = oldValue || '';
    }
    if (validatedText !== newValue) {
      form.description = validatedText;
    }
  }
});

/** 
 * Szervező validáció: Legyen számmentes és max 15 karakteres.
 */
watch(() => form.organizer, (newValue) => {
  if (newValue) {
    let cleanOrganizer = newValue.replace(/\d/g, '');
    if (cleanOrganizer.length > 15) {
      cleanOrganizer = cleanOrganizer.substring(0, 15);
    }
    if (cleanOrganizer !== newValue) {
      form.organizer = cleanOrganizer;
    }
  }
});

/**
 * Ár validáció: Speciális logika az "Ingyenes" kulcsszó engedésére vagy az Ft utótagra.
 */
watch(() => form.price, (newValue, oldValue) => {
  if (newValue) {
    if ((newValue.toLowerCase() === 'i' || newValue.toLowerCase() === 'in') && (!oldValue || newValue.length > oldValue.length)) {
      form.price = 'Ingyenes';
      return;
    }
    if (newValue === 'Ingyenes' || 'Ingyenes'.startsWith(newValue)) {
      return;
    }
    
    if (newValue.endsWith(' Ft')) {
      const numbersOnly = newValue.replace(/\D/g, '');
      if (numbersOnly.length > 5) {
        form.price = numbersOnly.substring(0, 5) + ' Ft';
      }
      return;
    }
    
    let cleanPrice = newValue.replace(/\D/g, '');
    if (cleanPrice.length > 5) {
      cleanPrice = cleanPrice.substring(0, 5);
    }
    
    if (cleanPrice !== newValue) {
      form.price = cleanPrice;
    }
  }
});

/** Telefonszám blokk kezelése */
const phoneData = reactive({ prefix: '30', number: '' });

watch(() => phoneData.number, (newValue) => {
  if (newValue) {
    let cleanedNumber = newValue.replace(/\D/g, '');
    if (cleanedNumber.length > 7) cleanedNumber = cleanedNumber.substring(0, 7);
    if (cleanedNumber !== newValue) {
      phoneData.number = cleanedNumber;
    }
  }
});

watch(phoneData, (newValue) => {
  if (newValue.number && newValue.number.trim() !== '') {
    const formattedNumber = newValue.number.trim().replace(/\s/g, '').replace(/(\d{3})(\d{0,4})/, '$1 $2').trim();
    form.contact_phone = `+36 ${newValue.prefix} ${formattedNumber}`;
  } else {
    form.contact_phone = '';
  }
}, { deep: true });

/** Helyszín adatok szétbontva a pontosabb validáláshoz */
const locationData = reactive({
  zipCode: '',
  city: '',
  district: '',
  street: '',
  houseNumber: ''
});

const cityDropdownOpen = ref(false);

/** Népszerű hazai települések listája az autocomplethez */
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

/** Gépelés alapján szűrt város lista (max 5 elem) */
const filteredCities = computed(() => {
  if (!locationData.city) {
    return popularCities.slice(0, 5);
  }
  const query = locationData.city.toLowerCase().trim();
  return popularCities
    .filter(city => city.toLowerCase().startsWith(query))
    .slice(0, 5);
});

/** Település kiválasztása a legördülő gombra kattintva */
const selectCity = (city) => {
  locationData.city = city;
  cityDropdownOpen.value = false;
};

const closeCityDropdown = () => {
  setTimeout(() => {
    cityDropdownOpen.value = false;
  }, 100);
};

/** Település mező validáció (tiltott számok, max 15 karakter) */
watch(() => locationData.city, (newValue) => {
  if (newValue) {
    let cleanCity = newValue.replace(/\d/g, ''); 
    if (cleanCity.length > 15) {
      cleanCity = cleanCity.substring(0, 15); 
    }
    if (cleanCity !== newValue) {
      locationData.city = cleanCity;
    }
  }
});

/** Irányítószám validáció (csak szám, max 4 karakter) */
watch(() => locationData.zipCode, (newValue) => {
  if (newValue) {
    let cleanZip = newValue.replace(/\D/g, ''); 
    if (cleanZip.length > 4) {
      cleanZip = cleanZip.substring(0, 4); 
    }
    if (cleanZip !== newValue) {
      locationData.zipCode = cleanZip;
    }
  }
});

/** Kerület validáció (csak római szám I, X, V karakterekből, max 5 hossz) */
watch(() => locationData.district, (newValue) => {
  if (newValue) {
    let cleanDistrict = newValue.toUpperCase().replace(/[^IXV]/g, '');
    if (cleanDistrict.length > 5) {
      cleanDistrict = cleanDistrict.substring(0, 5);
    }
    if (cleanDistrict !== newValue) {
      locationData.district = cleanDistrict;
    }
  }
});

/** Utca név validáció: Tiltott számok, max 25 karakter */
watch(() => locationData.street, (newValue) => {
  if (newValue) {
    let cleanStreet = newValue.replace(/\d/g, ''); 
    if (cleanStreet.length > 25) {
      cleanStreet = cleanStreet.substring(0, 25);
    }
    if (cleanStreet !== newValue) {
      locationData.street = cleanStreet;
    }
  }
});

/** 
 * Házszám validáció: 
 * Max 3 számjegy, max 1 betű és max 1 perjel, a teljes hossz max 5.
 */
watch(() => locationData.houseNumber, (newValue) => {
  if (newValue) {
    let result = '';
    let digits = 0;
    let letters = 0;
    let slashes = 0;

    for (let i = 0; i < newValue.length; i++) {
      const char = newValue[i];
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

    if (result !== newValue) {
      locationData.houseNumber = result;
    }
  }
});

/**
 * Automatikusan összefűzi és formázza a location mezőt a részadatokból.
 */
watch(locationData, (newValue) => {
  let locationString = newValue.city ? newValue.city.trim() : '';
  const isBudapest = locationString.toLowerCase() === 'budapest' || locationString.toLowerCase() === 'bp' || locationString.toLowerCase() === 'bp.';
  
  if (isBudapest) {
    locationString = 'Budapest';
    if (newValue.district && newValue.district.trim()) {
      locationString += `, ${newValue.district.trim()}`;
      if (!locationString.toLowerCase().includes('kerület') && !locationString.toLowerCase().includes('ker.')) {
        locationString += ' ker.';
      }
    }
  }

  if (newValue.zipCode && newValue.zipCode.trim()) {
    locationString = newValue.zipCode.trim() + ' ' + locationString;
  }

  if (newValue.street && newValue.street.trim()) {
    locationString += (locationString ? ', ' : '') + newValue.street.trim();
  }

  if (newValue.houseNumber && newValue.houseNumber.trim()) {
    locationString += (locationString ? ' ' : '') + newValue.houseNumber.trim() + '.';
  }

  form.location = locationString.trim();
}, { deep: true });

const imageFile = ref(null);
const imagePreview = ref(null);
const tagDropdownOpen = ref(false);

/**
 * Hozzáadja vagy eltávolítja a kiválasztott címkét (tag).
 */
function toggleTag(tag) {
  const index = form.tags.indexOf(tag);
  if (index > -1) {
    form.tags.splice(index, 1);
  } else if (form.tags.length < 3) {
    form.tags.push(tag);
  }
}

/** 
 * Modal megnyitásakor vagy bezárásakor futó watcher.
 * Ha a modal megnyílik, mindent alaphelyzetbe állít (form nullázás, body scroll tiltás).
 */
watch(() => props.visible, (isVisible) => {
  if (isVisible) {
    Object.assign(form, { 
      title: '', 
      date: '', 
      time: '', 
      location: '', 
      organizer: '', 
      price: '', 
      contact_phone: '', 
      category: 'Házibuli', 
      description: '', 
      tags: [] 
    });
    Object.assign(locationData, { zipCode: '', city: '', district: '', street: '', houseNumber: '' });
    Object.assign(phoneData, { prefix: '30', number: '' });
    imageFile.value = null;
    imagePreview.value = null;
    tagDropdownOpen.value = false;
  }
  document.body.style.overflow = isVisible ? 'hidden' : '';
});

/** Modal elrejtését kezelő függvény */
function close() { 
  emit('update:visible', false); 
}

/** 
 * Fájlfeltöltést kezelő függvény.
 * Beolvassa a kiválasztott képet és egy lokális dataURL-ként elmenti.
 */
function onFileChange(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  imageFile.value = file;
  
  const reader = new FileReader();
  reader.onload = loadEvent => { 
    imagePreview.value = loadEvent.target.result; 
  };
  reader.readAsDataURL(file);
}

/** Törli a kiválasztott és előnézeti képet */
function removeImage() {
  imageFile.value = null;
  imagePreview.value = null;
}

/**
 * Űrlap beküldése
 */
async function handleSubmit() {
  // Extra cím ellenőrzés biztonsági okokból a beküldés előtt
  const digitsInTitle = form.title.match(/\d/g);
  if (digitsInTitle && digitsInTitle.length > 4) {
    showToast('Az esemény címében maximum 4 számjegy szerepelhet!', 'error');
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
  
  const formData = new FormData();
  Object.entries(form).forEach(([key, value]) => {
    formData.append(key, Array.isArray(value) ? value.join(', ') : value);
  });
  
  const result = await createEvent(formData, imageFile.value);
  
  if (result.success) {
    emit('created');
  } else {
    // API hibaüzenet kibontása
    const errorMessage = result.message || Object.values(result.errors || {})[0]?.[0] || 'Hiba a létrehozás során';
    showToast(errorMessage, 'error');
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
