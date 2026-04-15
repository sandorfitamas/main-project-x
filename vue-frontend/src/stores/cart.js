import { reactive, toRefs, computed } from 'vue';

const state = reactive({
  items: JSON.parse(localStorage.getItem('ticketCart') || '[]'),
});

function saveCart() {
  localStorage.setItem('ticketCart', JSON.stringify(state.items));
}

export function useCart() {
  const cartCount = computed(() => state.items.reduce((sum, item) => sum + item.quantity, 0));
  
  const cartTotal = computed(() => {
    return state.items.reduce((sum, item) => {
      let price = 0;
      if (item.event.price) {
        const match = String(item.event.price).replace(/\s/g, '').match(/\d+/);
        if (match) price = parseInt(match[0], 10);
      }
      return sum + (price * item.quantity);
    }, 0);
  });

  function addToCart(event, quantity = 1) {
    const existing = state.items.find(i => i.event.id === event.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      state.items.push({ event, quantity });
    }
    saveCart();
  }

  function removeFromCart(eventId) {
    state.items = state.items.filter(i => i.event.id !== eventId);
    saveCart();
  }

  function updateQuantity(eventId, qty) {
    const item = state.items.find(i => i.event.id === eventId);
    if (item && qty > 0) {
      item.quantity = qty;
      saveCart();
    } else if (qty <= 0) {
      removeFromCart(eventId);
    }
  }

  function clearCart() {
    state.items = [];
    saveCart();
  }

  return {
    ...toRefs(state),
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
}
