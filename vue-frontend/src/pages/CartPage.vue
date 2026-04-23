<template>
  <div class="container py-5 mt-5">
    <div class="row g-4">
      <div class="col-lg-8">
        <h3 class="mb-4 fw-bold text-white"><i class="bi bi-cart3 me-2 auto-inline-1"></i>Kosár</h3>
        <div v-if="items.length === 0" class="text-center py-5">
          <i class="bi bi-cart-x text-white-50 auto-inline-2"></i>
          <h5 class="mt-3 text-white-50">A kosarad üres!</h5>
          <button class="btn btn-outline-light mt-3" @click="router.push('/events')">
            Böngéssz az események között
          </button>
        </div>
        <div v-else class="card border-0 shadow-lg rounded-4 p-4 sticky-top auto-inline-3">
          <div v-for="item in items" :key="item.event.id" class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 pb-4 border-bottom auto-inline-4">
            <div class="d-flex align-items-center mb-3 mb-md-0 w-100">
              <img v-if="item.event.imageUrl" :src="item.event.imageUrl" alt="Esemény kép" class="rounded me-3 object-fit-cover auto-inline-5">
              <div v-else class="rounded me-3 bg-secondary d-flex align-items-center justify-content-center auto-inline-5">
                <i class="bi bi-image text-white"></i>
              </div>
              <div class="flex-grow-1">
                <h6 class="fw-bold mb-1 text-white">{{ item.event.title }}</h6>
                <small class="text-white-50 d-block mb-2">{{ formatDate(item.event.start_time) }} - {{ item.event.location }}</small>
                <small class="text-white-50">{{ item.event.price ? item.event.price : 'Ingyenes' }}</small>
              </div>
            </div>
            
            <div class="d-flex align-items-center gap-3">
              <div class="input-group flex-nowrap shadow-sm auto-inline-6">
                <button class="btn text-white ps-3 border auto-inline-7" @click="updateQuantity(item.event.id, item.quantity - 1)" :disabled="item.quantity <= 1">-</button>
                <input type="text" class="form-control text-center text-white border-top border-bottom border-start-0 border-end-0 fw-bold px-0 bg-transparent auto-inline-8" :value="item.quantity" readonly>
                <button class="btn text-white ps-3 border auto-inline-7" @click="updateQuantity(item.event.id, item.quantity + 1)" :disabled="item.quantity >= 10">+</button>
              </div>
              <div class="text-end fw-bold text-white fs-5 auto-inline-9">
                {{ getDisplayPrice(item.event.price, item.quantity) }}
              </div>
              <button class="btn btn-sm btn-outline-danger" @click="removeFromCart(item.event.id)" title="Törlés">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Fizetési összesítő -->
      <div class="col-lg-4" v-if="items.length > 0">
        <div class="card border-0 shadow-lg rounded-4 p-4 sticky-top auto-inline-10" >
          <h5 class="fw-bold mb-4 text-white">Rendelés Összesítése</h5>
          <div class="d-flex justify-content-between mb-3">
            <span class="text-white-50">Összes jegy:</span>
            <span class="text-white fw-bold">{{ cartCount }} db</span>
          </div>
          <div class="d-flex justify-content-between mb-4 border-bottom auto-inline-4">
            <span class="text-white-50">Fizetendő összeg:</span>
            <span class="fw-bold text-white fs-5">{{ cartTotal.toLocaleString() }} Ft</span>
          </div>
          <button class="btn btn-gradient w-100 py-2 fw-bold" @click="router.push('/checkout')" :disabled="isCheckingOut">
            <i class="bi bi-credit-card me-2"></i> 
            Tovább a fizetéshez
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useCart } from '../stores/cart.js';

const router = useRouter();
const showToast = inject('showToast');
const { items, cartCount, cartTotal, updateQuantity, removeFromCart } = useCart();
const isCheckingOut = ref(false);

/**
 * Szebben formázott dátumvisszaadás a felhasználóknak.
 * 
 * @param {string} dateString - Az eredeti dátum sztring.
 * @returns {string} Lokalizált (magyar) pontos dátum.
 */
function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('hu-HU', {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit'
  });
}

/**
 * Dinamikusan kiszámítja a kijelzett árat a jegy mennyisége és annak megadott (szöveges/számos) ára alapján.
 * Kezeli az "Ingyenes" eseteket is.
 * 
 * @param {string|number} priceString - Az esemény ára (pl. "5000" vagy "Ingyenes").
 * @param {number} quantity - A kosárban lévő darabszám.
 * @returns {string} A formázott összár.
 */
function getDisplayPrice(priceString, quantity) {
  if (!priceString || String(priceString).toLowerCase().includes('ingyen')) {
    return 'Ingyenes';
  }
  
  const numericMatch = String(priceString).replace(/\s/g, '').match(/\d+/);
  if (numericMatch) {
    const parsedPrice = parseInt(numericMatch[0], 10);
    return (parsedPrice * quantity).toLocaleString('hu-HU') + ' Ft';
  }
  
  return 'Ismeretlen ár';
}
</script>


<style scoped>
.auto-inline-1 { color:#d946ef;; }
.auto-inline-2 { font-size: 4rem;; }
.auto-inline-3 { background: rgba(30,41,59,0.6); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.05) !important;; }
.auto-inline-4 { border-color: rgba(255,255,255,0.1) !important;; }
.auto-inline-5 { width: 80px; height: 80px;; }
.auto-inline-6 { width: 110px;; }
.auto-inline-7 { background:rgba(255,255,255,0.05);border-color:rgba(255,255,255,0.2)!important;; }
.auto-inline-8 { border-color:rgba(255,255,255,0.2)!important;; }
.auto-inline-9 { min-width: 90px;; }
.auto-inline-10 { background: rgba(30,41,59,0.6); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.05) !important; top: 100px;; }
</style>
