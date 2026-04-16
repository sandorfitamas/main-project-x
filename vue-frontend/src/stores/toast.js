
import { reactive, toRefs } from 'vue';

/**
 * Globális állapotkezelő a toast (felugró) üzenetekhez.
 * Minden toast egyedi azonosítót, típust, szöveget és halványulási állapotot tartalmaz.
 */
const toastState = reactive({
  toasts: [],
});

let toastIdCounter = 0;

/**
 * Toast store Composition API hook.
 * @returns {Object} - A toast lista és a showToast függvény.
 */
export function useToast() {
  /**
   * Új toast üzenet megjelenítése.
   * @param {string} message - A megjelenítendő üzenet szövege.
   * @param {('info'|'success'|'error'|'warning')} [type='info'] - Az üzenet típusa.
   */
  function showToast(message, type = 'info') {
    const toastId = toastIdCounter++;
    toastState.toasts.push({ id: toastId, message, type, fading: false });

    // 3,5 másodperc után elindítja a halványulást
    setTimeout(() => {
      const toastObj = toastState.toasts.find(t => t.id === toastId);
      if (toastObj) {
        toastObj.fading = true;
      }

      // 400ms múlva (animáció után) eltávolítja a toastot
      setTimeout(() => {
        const idx = toastState.toasts.findIndex(t => t.id === toastId);
        if (idx !== -1) {
          toastState.toasts.splice(idx, 1);
        }
      }, 400);
    }, 3500);
  }

  return {
    ...toRefs(toastState),
    showToast,
  };
}
