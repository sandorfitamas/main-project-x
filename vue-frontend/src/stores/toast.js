import { reactive, toRefs } from 'vue';

const state = reactive({
  toasts: [],
});

let nextId = 0;

export function useToast() {
  function showToast(message, type = 'info') {
    const id = nextId++;
    state.toasts.push({ id, message, type, fading: false });
    setTimeout(() => {
      const t = state.toasts.find(x => x.id === id);
      if (t) t.fading = true;
      setTimeout(() => {
        const idx = state.toasts.findIndex(x => x.id === id);
        if (idx !== -1) state.toasts.splice(idx, 1);
      }, 400);
    }, 3500);
  }

  return {
    ...toRefs(state),
    showToast,
  };
}
