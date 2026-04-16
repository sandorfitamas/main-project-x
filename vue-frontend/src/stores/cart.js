
import { reactive, toRefs, computed } from 'vue';

/**
 * Globális állapotkezelő a kosárhoz (cart).
 * A kosár tartalma a localStorage-ben is tárolódik.
 */
const cartState = reactive({
  items: JSON.parse(localStorage.getItem('ticketCart') || '[]'),
});

/**
 * Szinkronizálja a vue reaktív állapotát a böngésző memóriájával.
 */
function saveCart() {
  localStorage.setItem('ticketCart', JSON.stringify(cartState.items));
}

/**
 * Cart store Composition API hook.
 * @returns {Object} - Kosár állapota és műveletek.
 */
export function useCart() {
  /**
   * Összeszámlálja a kosárban lévő jegyek darabszámát.
   */
  const cartCount = computed(() => cartState.items.reduce((sum, item) => sum + item.quantity, 0));

  /**
   * Kiszámítja a kosár végösszegét a beállított árak alapján.
   */
  const cartTotal = computed(() => {
    return cartState.items.reduce((sum, item) => {
      let price = 0;
      if (item.event.price) {
        // Kiszedjük a számokat a szöveges árból (pl. '2500 Ft' -> 2500)
        const matchedDigits = String(item.event.price).replace(/\s/g, '').match(/\d+/);
        if (matchedDigits) {
          price = parseInt(matchedDigits[0], 10);
        }
      }
      return sum + (price * item.quantity);
    }, 0);
  });

  /**
   * Jegy hozzáadása a kosárhoz.
   * Ha már van ilyen tétele, akkor csak frissíti a mennyiséget.
   * @param {Object} event - Az esemény objektum.
   * @param {number} [quantity=1] - Hány darabot adunk hozzá.
   */
  function addToCart(event, quantity = 1) {
    const existingItem = cartState.items.find(item => item.event.id === event.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartState.items.push({ event, quantity });
    }
    saveCart();
  }

  /**
   * Egy elem teljes eltávolítása a kosárból.
   * @param {number|string} eventId
   */
  function removeFromCart(eventId) {
    cartState.items = cartState.items.filter(item => item.event.id !== eventId);
    saveCart();
  }

  /**
   * Egy adott tétel mennyiségének módosítása a kosáron belül.
   * @param {number|string} eventId
   * @param {number} newQuantity
   */
  function updateQuantity(eventId, newQuantity) {
    const itemToUpdate = cartState.items.find(item => item.event.id === eventId);
    // Ha 0 vagy az alatti értéket állítanak, eltávolítjuk a terméket
    if (itemToUpdate && newQuantity > 0) {
      itemToUpdate.quantity = newQuantity;
      saveCart();
    } else if (newQuantity <= 0) {
      removeFromCart(eventId);
    }
  }

  /**
   * Az egész kosár teljes ürítése és a localStorage tisztítása.
   */
  function clearCart() {
    cartState.items = [];
    saveCart();
  }

  return {
    ...toRefs(cartState),
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
}
