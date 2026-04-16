<template>
  <div class="container py-5 mt-5">
    <div class="row g-4">
      <div class="col-lg-8">
        <h3 class="mb-4 fw-bold text-white"><i class="bi bi-shield-lock me-2" style="color:#d946ef;"></i>Fizetés és Megrendelés</h3>
        
        <div class="card border-0 shadow-lg rounded-4 p-4 mb-4" style="background: rgba(30,41,59,0.6); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.05) !important;">
          <h5 class="fw-bold mb-3 text-white">Fizetési Mód</h5>
          <div class="row g-3">
            <div class="col-md-6">
              <label class="payment-method-card w-100 p-3 rounded-3" :class="{'active': checkoutForm.paymentMethod === 'card'}" style="cursor: pointer; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);">
                <div class="d-flex align-items-center gap-3">
                  <input type="radio" v-model="checkoutForm.paymentMethod" value="card" class="form-check-input mt-0" style="width: 20px; height: 20px;">
                  <i class="bi bi-credit-card-fill fs-4 text-primary"></i>
                  <span class="text-white fw-bold">Bankkártya</span>
                </div>
              </label>
            </div>
            <div class="col-md-6">
              <label class="payment-method-card w-100 p-3 rounded-3" :class="{'active': checkoutForm.paymentMethod === 'apple'}" style="cursor: pointer; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);">
                <div class="d-flex align-items-center gap-3">
                  <input type="radio" v-model="checkoutForm.paymentMethod" value="apple" class="form-check-input mt-0" style="width: 20px; height: 20px;">
                  <i class="bi bi-apple fs-4 text-light"></i>
                  <span class="text-white fw-bold">Apple Pay</span>
                </div>
              </label>
            </div>
            <div class="col-md-6">
              <label class="payment-method-card w-100 p-3 rounded-3" :class="{'active': checkoutForm.paymentMethod === 'google'}" style="cursor: pointer; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);">
                <div class="d-flex align-items-center gap-3">
                  <input type="radio" v-model="checkoutForm.paymentMethod" value="google" class="form-check-input mt-0" style="width: 20px; height: 20px;">
                  <i class="bi bi-google fs-4 text-success"></i>
                  <span class="text-white fw-bold">Google Pay</span>
                </div>
              </label>
            </div>
            <div class="col-md-6">
              <label class="payment-method-card w-100 p-3 rounded-3" :class="{'active': checkoutForm.paymentMethod === 'paypal'}" style="cursor: pointer; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);">
                <div class="d-flex align-items-center gap-3">
                  <input type="radio" v-model="checkoutForm.paymentMethod" value="paypal" class="form-check-input mt-0" style="width: 20px; height: 20px;">
                  <i class="bi bi-paypal fs-4 text-info"></i>
                  <span class="text-white fw-bold">PayPal</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Kártya adatok (csak ha kártyás fizetés van kiválasztva) -->
          <div v-if="checkoutForm.paymentMethod === 'card'" class="row g-3 mt-3 pt-3 border-top" style="border-color: rgba(255,255,255,0.1) !important;">
            <h6 class="text-white-50 mb-2">Bankkártya adatok</h6>
            <div class="col-12">
              <label class="form-label text-light small">A kártyatulajdonos teljes neve *</label>
              <input type="text" class="form-control text-white bg-transparent py-2" style="border-color: rgba(255,255,255,0.2) !important;" v-model="checkoutForm.cardName" required placeholder="Pl.: Teszt Elek" maxlength="25" @input="checkoutForm.cardName = checkoutForm.cardName.replace(/[^a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s\-]/g, '')">
            </div>
            <div class="col-12">
              <label class="form-label text-light small">Bankkártya szám *</label>
              <input type="text" class="form-control text-white bg-transparent py-2" style="border-color: rgba(255,255,255,0.2) !important;" v-model="checkoutForm.cardNumber" required placeholder="0000 0000 0000 0000" maxlength="19" @input="checkoutForm.cardNumber = checkoutForm.cardNumber.replace(/\D/g, '').substring(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')">
            </div>
            <div class="col-6">
              <label class="form-label text-light small">Kártya lejárati dátuma *</label>
              <input type="text" class="form-control text-white bg-transparent py-2" style="border-color: rgba(255,255,255,0.2) !important;" v-model="checkoutForm.cardExpiry" required placeholder="HH/ÉÉ" maxlength="5" @input="checkoutForm.cardExpiry = checkoutForm.cardExpiry.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').substring(0, 5)">
            </div>
            <div class="col-6">
              <label class="form-label text-light small">CVV *</label>
              <input type="password" class="form-control text-white bg-transparent py-2" style="border-color: rgba(255,255,255,0.2) !important; letter-spacing: 2px;" v-model="checkoutForm.cardCvv" required placeholder="***" maxlength="3" @input="checkoutForm.cardCvv = checkoutForm.cardCvv.replace(/\D/g, '').substring(0, 3)">
            </div>
          </div>
        </div>

        <form @submit.prevent="processCheckout">
          <div class="card border-0 shadow-lg rounded-4 p-4 mb-4" style="background: rgba(30,41,59,0.6); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.05) !important;">
            <h5 class="fw-bold mb-4 text-white">Személyes és Számlázási Adatok</h5>
            <div class="row g-4 mb-4">
              <div class="col-md-6">
                <label class="form-label text-light small">Teljes név *</label>
                <input type="text" class="form-control text-white bg-transparent py-2" style="border-color: rgba(255,255,255,0.2) !important;" v-model="checkoutForm.name" required placeholder="Pl.: Teszt Elek" maxlength="25" @input="checkoutForm.name = checkoutForm.name.replace(/[^a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s\-]/g, '')">
              </div>
              <div class="col-md-6">
                <label class="form-label text-light small">Telefonszám *</label>
                <div class="input-group">
                  <span class="input-group-text text-light bg-transparent py-2" style="border-color: rgba(255,255,255,0.2) !important;">+36</span>
                  <select v-model="phoneData.prefix" class="form-select bg-transparent text-light py-2" style="max-width: 80px; border-color: rgba(255,255,255,0.2) !important;">
                    <option value="20" style="background-color: #1e293b; color: white;">20</option>
                    <option value="30" style="background-color: #1e293b; color: white;">30</option>
                    <option value="70" style="background-color: #1e293b; color: white;">70</option>
                  </select>
                  <input v-model="phoneData.number" type="tel" class="form-control text-white bg-transparent py-2" style="border-color: rgba(255,255,255,0.2) !important;" placeholder="123 4567" maxlength="7" required>
                </div>
              </div>
              <div class="col-12">
                <label class="form-label text-light small">E-mail cím *</label>
                <input type="email" class="form-control text-white bg-transparent py-2" style="border-color: rgba(255,255,255,0.2) !important;" v-model="checkoutForm.email" placeholder="pelda@email.com" required maxlength="30" @input="checkoutForm.email = checkoutForm.email.replace(/\d/g, (m, offset, str) => (str.substring(0, offset).match(/\d/g) || []).length < 3 ? m : '')">
              </div>
            </div>

            <h6 class="text-white-50 mb-3 border-top pt-4" style="border-color: rgba(255,255,255,0.1) !important;">Cím Adatok</h6>
            <div class="row g-4">
              <div class="col-md-4">
                <label class="form-label text-light small">Irányítószám *</label>
                <input type="text" class="form-control text-white bg-transparent py-2" style="border-color: rgba(255,255,255,0.2) !important;" v-model="checkoutForm.zip" required placeholder="1234" maxlength="4" @input="checkoutForm.zip = checkoutForm.zip.replace(/\D/g, '')">
              </div>
              <div class="col-md-8 position-relative">
                <label class="form-label text-light small">Település *</label>
                <input type="text" class="form-control text-white bg-transparent py-2 custom-arrow" style="border-color: rgba(255,255,255,0.2) !important;" v-model="checkoutForm.city" placeholder="Budapest" required maxlength="15" @input="checkoutForm.city = checkoutForm.city.replace(/[^a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s\-]/g, '')" @focus="cityDropdownOpen = true" @blur="closeCityDropdown">
                <ul v-if="cityDropdownOpen && filteredCities.length" class="dropdown-menu show w-100 mt-1 shadow border-0" style="max-height: 155px; overflow-y: auto; z-index: 1051; background: rgba(30,41,59,0.95); backdrop-filter: blur(10px);">
                  <li v-for="city in filteredCities" :key="city">
                    <a class="dropdown-item text-light city-item" style="cursor: pointer;" @click.prevent="selectCity(city)">{{ city }}</a>
                  </li>
                </ul>
              </div>
              <div class="col-md-6">
                <label class="form-label text-light small">Utca, házszám *</label>
                <input type="text" class="form-control text-white bg-transparent py-2" style="border-color: rgba(255,255,255,0.2) !important;" v-model="checkoutForm.address" placeholder="Kossuth Lajos u. 1." required maxlength="25" @input="checkoutForm.address = checkoutForm.address.replace(/\d/g, (m, offset, str) => (str.substring(0, offset).match(/\d/g) || []).length < 3 ? m : '')">
              </div>
              <div class="col-md-6">
                <label class="form-label text-light small">Egyéb (lépcsőház, emelet, ajtó, kapucsengő)</label>
                <input type="text" class="form-control text-white bg-transparent py-2" style="border-color: rgba(255,255,255,0.2) !important;" v-model="checkoutForm.other" placeholder="2. emelet 4. ajtó" @input="checkoutForm.other = checkoutForm.other.replace(/\d/g, (m, offset, str) => (str.substring(0, offset).match(/\d/g) || []).length < 6 ? m : '')">
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Összesítő oszlop -->
      <div class="col-lg-4">
        <div class="card border-0 shadow-lg rounded-4 p-4 sticky-top" style="background: rgba(30,41,59,0.6); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.05) !important; top: 100px;">
          <h5 class="fw-bold mb-4 text-white">Rendelés Összesítése</h5>
          
          <!-- Lista a tételekkel -->
          <div class="mb-4">
            <div v-for="item in items" :key="item.event.id" class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom" style="border-color: rgba(255,255,255,0.05) !important;">
              <div class="pe-3">
                <div class="text-white small fw-bold text-truncate" style="max-width: 170px;">{{ item.event.title }}</div>
                <div class="text-white-50 small">{{ item.quantity }} db</div>
              </div>
              <div class="text-white small fw-bold">{{ getDisplayPrice(item.event.price, item.quantity) }}</div>
            </div>
          </div>

          <div class="d-flex justify-content-between mb-3">
            <span class="text-white-50">Összes jegy:</span>
            <span class="text-white fw-bold">{{ cartCount }} db</span>
          </div>
          <div class="d-flex justify-content-between align-items-center pt-3 border-top mb-4" style="border-color: rgba(255,255,255,0.1) !important;">
            <span class="text-white-50">Fizetendő összeg:</span>
            <span class="fw-bold text-white fs-4">{{ cartTotal.toLocaleString() }} Ft</span>
          </div>
          
          <button type="button" class="btn btn-gradient w-100 py-3 fw-bold shadow" @click="processCheckout" :disabled="isCheckingOut || cartCount === 0">
            <span v-if="isCheckingOut" class="spinner-border spinner-border-sm me-2"></span>
            <i class="bi bi-bag-check-fill me-2" v-else></i> 
            {{ isCheckingOut ? 'Feldolgozás...' : 'Rendelés Véglegesítése' }}
          </button>
          
          <button class="btn btn-outline-light w-100 py-2 mt-3" style="border-color: rgba(255,255,255,0.2) !important;" @click="router.push('/cart')" :disabled="isCheckingOut">
            Vissza a kosárhoz
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCart } from '../stores/cart.js';
import { apiCheckoutCart } from '../services/api.js';

const router = useRouter();
const showToast = inject('showToast');
const { items, cartCount, cartTotal, clearCart } = useCart();
const isCheckingOut = ref(false);
const emit = defineEmits(['show-auth']);

const cityDropdownOpen = ref(false);

/** Leggyakoribb magyarországi települések listája a legördülő menühöz */
const popularCities = [
  'Budapest', 'Debrecen', 'Szeged', 'Miskolc', 'Pécs', 'Győr', 'Nyíregyháza',
  'Kecskemét', 'Székesfehérvár', 'Szombathely', 'Érd', 'Szolnok', 'Tatabánya',
  'Kaposvár', 'Sopron', 'Veszprém', 'Békéscsaba', 'Zalaegerszeg', 'Eger',
  'Hódmezővásárhely', 'Nagykanizsa', 'Dunaújváros', 'Dunakeszi', 'Cegléd',
  'Komló', 'Vecsés', 'Makó', 'Monor', 'Mátészalka', 'Budaörs', 'Siófok',
  'Pilisvörösvár', 'Mohács'
];

/** A pénztár űrlap reaktív állapota */
const checkoutForm = reactive({
  paymentMethod: 'card',
  cardName: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',
  name: '',
  email: '',
  phone: '',
  zip: '',
  city: '',
  address: '',
  other: ''
});

/** Telefonszám különválasztott reaktív adatai a formázás megkönnyítésére */
const phoneData = reactive({ prefix: '30', number: '' });

/** Figyeli a telefonszám bevitelt, és csak a számokat hagyja meg */
watch(() => phoneData.number, (newValue) => {
  if (newValue) {
    const cleanedValue = newValue.replace(/\D/g, '');
    if (cleanedValue !== newValue) {
      phoneData.number = cleanedValue;
    }
  }
});

/** Figyeli a telefonszám objektumot és összerakja a nemzetközi formátumot */
watch(phoneData, (newValue) => {
  if (newValue.number && newValue.number.trim() !== '') {
    const formattedNumber = newValue.number.trim().replace(/\s/g, '').replace(/(\d{3})(\d{0,4})/, '$1 $2').trim();
    checkoutForm.phone = `+36 ${newValue.prefix} ${formattedNumber}`;
  } else {
    checkoutForm.phone = '';
  }
}, { deep: true });

/** Keresés alapján szűri a népszerű településeket az autocomplethez */
const filteredCities = computed(() => {
  if (!checkoutForm.city) {
    return popularCities.slice(0, 5);
  }
  const query = checkoutForm.city.toLowerCase().trim();
  return popularCities
    .filter(city => city.toLowerCase().startsWith(query))
    .slice(0, 5);
});

/**
 * Kiválaszt egy települést a legördülőből.
 * @param {string} city - A kiválasztott település neve.
 */
const selectCity = (city) => {
  checkoutForm.city = city;
  cityDropdownOpen.value = false;
};

/**
 * Késleltetve zárja be a legördülő menüt, hogy a kattintás esemény lefuthessen.
 */
const closeCityDropdown = () => {
  setTimeout(() => {
    cityDropdownOpen.value = false;
  }, 100);
};

onMounted(() => {
  if (items.value.length === 0) {
    showToast('A kosarad üres!', 'error');
    router.push('/cart');
  }
});

/**
 * Formázza a megjelenítendő árat jegyszámtól függően.
 * @param {string|number} priceString - Az ár eredeti string formája.
 * @param {number} quantity - A megvásárolni kívánt mennyiség.
 * @returns {string} - A formázott ár Ft-ban, vagy 'Ingyenes'.
 */
function getDisplayPrice(priceString, quantity) {
  if (!priceString || String(priceString).toLowerCase().includes('ingyen')) {
    return 'Ingyenes';
  }
  
  const match = String(priceString).replace(/\s/g, '').match(/\d+/);
  if (match) {
    const parsedPrice = parseInt(match[0], 10);
    return (parsedPrice * quantity).toLocaleString() + ' Ft';
  }
  return 'Ismeretlen ár';
}

/**
 * Validálja a személyes és szállítási adatokat.
 * @returns {boolean} - True ha minden adat megfelelő, False különben.
 */
function validatePersonalData() {
  const { name, email, phone, zip, city, address } = checkoutForm;
  if (!name || !email || !phone || !zip || !city || !address) {
    showToast('Kérjük, tölts ki minden kötelező mezőt!', 'error');
    return false;
  }

  if (!email.includes('@')) {
    showToast('Az e-mail cím hiányos, tartalmaznia kell egy "@" jelet!', 'error');
    return false;
  }
  return true;
}

/**
 * Validálja a bankkártya adatait.
 * @returns {boolean} - True ha a kártya adatok helyesek vagy a fizetés nem kártyás, False különben.
 */
function validateCardData() {
  if (checkoutForm.paymentMethod !== 'card') {
    return true; // Csak kártyás fizetés esetén kell validálni
  }

  const { cardName, cardNumber, cardExpiry, cardCvv } = checkoutForm;
  if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
    showToast('Kérjük, add meg a bankkártya adataidat a fizetéshez!', 'error');
    return false;
  }

  const cleanedCardNumber = cardNumber.replace(/\D/g, '');
  if (cleanedCardNumber.length !== 16) {
    showToast('A bankkártya számnak pontosan 16 számjegyből kell állnia!', 'error');
    return false;
  }

  const expiryMatch = cardExpiry.match(/^(\d{2})\/(\d{2})$/);
  if (!expiryMatch) {
    showToast('A lejárati dátumnak HH/ÉÉ formátumúnak kell lennie!', 'error');
    return false;
  }

  const expiryMonth = parseInt(expiryMatch[1], 10);
  const expiryYear = parseInt(expiryMatch[2], 10) + 2000;
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  if (expiryMonth < 1 || expiryMonth > 12) {
    showToast('Érvénytelen hónap a lejárati dátumban!', 'error');
    return false;
  }

  if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
    showToast('A megadott bankkártya már lejárt!', 'error');
    return false;
  }

  return true;
}

/**
 * Ellenőrzi, hogy a felhasználó be van-e jelentkezve a vásárláshoz.
 * @returns {boolean} - True ha be van jelentkezve, False ha nincs.
 */
function checkAuthentication() {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    showToast('A rendelés véglegesítéséhez be kell jelentkezned!', 'error');
    emit('show-auth');
    return false;
  }
  return true;
}

/**
 * A fő fizetési (Checkout) folyamatot indító és kezelő függvény.
 */
async function processCheckout() {
  if (items.value.length === 0) return;

  if (!validatePersonalData()) return;
  if (!validateCardData()) return;
  if (!checkAuthentication()) return;

  isCheckingOut.value = true;
  
  const payloadItems = items.value.map(item => ({
    event_id: item.event.id,
    quantity: item.quantity
  }));

  try {
    const response = await apiCheckoutCart(payloadItems, checkoutForm);
    
    if (response.success) {
      showToast(response.message || 'Sikeres rendelés!', 'success');
      clearCart();
      router.push('/profile');
    } else {
      if (response.message === 'Unauthenticated.') {
        showToast('A rendelés véglegesítéséhez be kell jelentkezned!', 'error');
        emit('show-auth');
      } else {
        showToast(response.message || 'Hiba történt a fizetés során', 'error');
      }
    }
  } catch (error) {
    showToast('Hálózati hiba a rendelés feldolgozása közben.', 'error');
  } finally {
    isCheckingOut.value = false;
  }
}
</script>

<style scoped>
.form-control::placeholder {
  color: rgba(255, 255, 255, 0.4) !important;
  opacity: 1; /* Firefox */
}
.payment-method-card {
  transition: all 0.2s ease-in-out;
}
.payment-method-card:hover {
  background: rgba(255,255,255,0.1) !important;
}
.payment-method-card.active {
  border-color: #d946ef !important;
  background: rgba(217, 70, 239, 0.1) !important;
  box-shadow: 0 0 15px rgba(217, 70, 239, 0.3) !important;
}
.custom-arrow {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 12px;
}
.city-item:hover {
  background-color: rgba(255,255,255,0.1);
}
</style>