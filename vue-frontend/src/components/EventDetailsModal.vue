<template>
  <Teleport to="body">
    <div class="modal fade modal-dark" :class="{ show: visible }" :style="{ display: visible ? 'block' : 'none', overflowY: 'hidden !important' }" tabindex="-1" @click.self="close">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable auto-inline-1">
        <div class="modal-content auto-inline-2">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold text-white">{{ eventData.title || 'Esemény részletei' }}</h5>
            <button type="button" class="btn-close btn-close-white" @click="close"></button>
          </div>
          <div class="modal-body p-4" v-if="eventData">
            <div class="row g-4">
              <div class="col-lg-7">
                <div class="position-relative rounded-3 overflow-hidden border border-secondary auto-inline-3">
                  <img :src="eventData.imageUrl || placeholder" :alt="eventData.title" class="w-100 h-100 auto-inline-4" />
                  <span class="position-absolute top-0 end-0 m-3 badge badge-cat px-3 py-2">{{ eventData.category || 'Egyéb' }}</span>
                </div>
              </div>
              <div class="col-lg-5 d-flex flex-column gap-2">
                <h3 class="text-white fw-bold">{{ eventData.title }}</h3>
                <p class="text-secondary small mb-2"><i class="bi bi-person me-1 auto-inline-5"></i>Szervező: <span class="text-white fw-semibold">{{ eventData.organizer || 'Ismeretlen' }}</span></p>
                <div class="d-flex align-items-center gap-3 p-3 rounded-3 auto-inline-6">
                  <i class="bi bi-calendar3 fs-5 auto-inline-7"></i>
                  <div><div class="text-muted auto-inline-8">Dátum</div><div class="text-white fw-bold small">{{ formattedDate }}</div></div>
                </div>
                <div class="d-flex align-items-center gap-3 p-3 rounded-3 auto-inline-9">
                  <i class="bi bi-clock fs-5 auto-inline-10"></i>
                  <div><div class="text-muted auto-inline-8">Időpont</div><div class="text-white fw-bold small">{{ formattedTime }}</div></div>
                </div>
                <div class="d-flex align-items-center gap-3 p-3 rounded-3 overflow-hidden auto-inline-11">
                  <i class="bi bi-geo-alt fs-5 flex-shrink-0 auto-inline-12"></i>
                  <div class="overflow-hidden"><div class="text-muted auto-inline-8">Helyszín</div><div class="text-white fw-bold small text-truncate">{{ eventData.location || 'Helyszín TBD' }}</div></div>
                </div>
                <div class="d-flex align-items-center gap-3 p-3 rounded-3 auto-inline-13">
                  <i class="bi bi-ticket-perforated fs-5 auto-inline-14"></i>
                  <div><div class="text-muted auto-inline-8">Belépő</div><div class="text-white fw-bold small">{{ eventData.price || 'Ingyenes' }}</div></div>
                </div>
                <div class="d-flex align-items-center gap-3 p-3 rounded-3 auto-inline-15">
                  <i class="bi bi-telephone fs-5 auto-inline-16"></i>
                  <div><div class="text-muted auto-inline-8">Kapcsolat</div><div class="text-white fw-bold small">{{ eventData.contact_phone || 'Nincs megadva' }}</div></div>
                </div>
              </div>
            </div>
            <div class="mt-4 p-4 rounded-3 border border-secondary border-opacity-25 auto-inline-17">
              <h5 class="text-white fw-bold mb-3"><i class="bi bi-file-text me-2 auto-inline-5"></i>Leírás</h5>
              <p class="text-secondary lh-lg mb-0">{{ eventData.description || 'Nincs leírás.' }}</p>
            </div>
            <div v-if="tags.length" class="mt-3">
              <div class="d-flex flex-wrap gap-2"><span v-for="tag in tags" :key="tag" class="tag-pill">{{ tag }}</span></div>
            </div>
          </div>
          <div class="modal-footer border-0 justify-content-between">
            <button class="btn btn-gradient px-4" @click="$emit('share', eventData)"><i class="bi bi-share me-1"></i> Megosztás</button>
            <button class="btn btn-outline-secondary" @click="close">Bezárás</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="visible" class="modal-backdrop fade show"></div>
  </Teleport>
</template>
<script setup>
import { computed, watch } from 'vue';
import { PLACEHOLDER_IMAGE } from '../services/api.js';
const props = defineProps({ visible: Boolean, event: { type: Object, default: null } });
const emit = defineEmits(['update:visible', 'share']);
const placeholder = PLACEHOLDER_IMAGE;
const eventData = computed(() => props.event || {});
const formattedDate = computed(() => {
  if (!eventData.value.date) return '';
  try { return new Date(eventData.value.date).toLocaleDateString('hu-HU', { year:'numeric',month:'long',day:'numeric' }); } catch { return eventData.value.date; }
});
const formattedTime = computed(() => eventData.value.time ? eventData.value.time.substring(0,5) : 'Nincs megadva');
const tags = computed(() => {
  const rawTags = eventData.value.tags;
  const tagList = Array.isArray(rawTags) ? rawTags : (rawTags ? rawTags.split(',') : []);
  return tagList.map(tag => tag.trim()).filter(Boolean);
});
watch(() => props.visible, isVisible => { document.body.style.overflow = isVisible ? 'hidden' : ''; document.documentElement.style.overflow = isVisible ? 'hidden' : ''; });
function close() { emit('update:visible', false); }
</script>


<style scoped>
.auto-inline-1 { max-height: 85vh;; }
.auto-inline-2 { background:#0f172a;border:1px solid #334155;color:#e2e8f0;border-radius:16px; max-height: 80vh;; }
.auto-inline-3 { height:300px; }
.auto-inline-4 { object-fit:cover; }
.auto-inline-5 { color:#d946ef; }
.auto-inline-6 { background:rgba(124,58,237,.15);border:1px solid rgba(124,58,237,.3); }
.auto-inline-7 { color:#a78bfa; }
.auto-inline-8 { font-size:.7rem; }
.auto-inline-9 { background:rgba(217,70,239,.15);border:1px solid rgba(217,70,239,.3); }
.auto-inline-10 { color:#e879f9; }
.auto-inline-11 { background:rgba(236,72,153,.15);border:1px solid rgba(236,72,153,.3); }
.auto-inline-12 { color:#f9a8d4; }
.auto-inline-13 { background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.3); }
.auto-inline-14 { color:#6ee7b7; }
.auto-inline-15 { background:rgba(6,182,212,.15);border:1px solid rgba(6,182,212,.3); }
.auto-inline-16 { color:#67e8f9; }
.auto-inline-17 { background:rgba(30,41,59,.5); }
</style>
