<template>
  <Teleport to="body">
    <div class="modal fade modal-dark" :class="{ show: visible }" :style="{ display: visible ? 'block' : 'none' }" tabindex="-1" @click.self="close">
      <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
        <div class="modal-content" style="background:#0f172a;border:1px solid #334155;color:#e2e8f0;border-radius:16px">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold text-white">{{ ev.title || 'Esemény részletei' }}</h5>
            <button type="button" class="btn-close btn-close-white" @click="close"></button>
          </div>
          <div class="modal-body p-4" v-if="ev">
            <div class="row g-4">
              <div class="col-lg-7">
                <div class="position-relative rounded-3 overflow-hidden border border-secondary" style="height:300px">
                  <img :src="ev.imageUrl || placeholder" :alt="ev.title" class="w-100 h-100" style="object-fit:cover" />
                  <span class="position-absolute top-0 end-0 m-3 badge badge-cat px-3 py-2">{{ ev.category || 'Egyéb' }}</span>
                </div>
              </div>
              <div class="col-lg-5 d-flex flex-column gap-2">
                <h3 class="text-white fw-bold">{{ ev.title }}</h3>
                <p class="text-secondary small mb-2"><i class="bi bi-person me-1" style="color:#d946ef"></i>Szervező: <span class="text-white fw-semibold">{{ ev.organizer || 'Ismeretlen' }}</span></p>
                <div class="d-flex align-items-center gap-3 p-3 rounded-3" style="background:rgba(124,58,237,.15);border:1px solid rgba(124,58,237,.3)">
                  <i class="bi bi-calendar3 fs-5" style="color:#a78bfa"></i>
                  <div><div class="text-muted" style="font-size:.7rem">Dátum</div><div class="text-white fw-bold small">{{ fmtDate }}</div></div>
                </div>
                <div class="d-flex align-items-center gap-3 p-3 rounded-3" style="background:rgba(217,70,239,.15);border:1px solid rgba(217,70,239,.3)">
                  <i class="bi bi-clock fs-5" style="color:#e879f9"></i>
                  <div><div class="text-muted" style="font-size:.7rem">Időpont</div><div class="text-white fw-bold small">{{ fmtTime }}</div></div>
                </div>
                <div class="d-flex align-items-center gap-3 p-3 rounded-3 overflow-hidden" style="background:rgba(236,72,153,.15);border:1px solid rgba(236,72,153,.3)">
                  <i class="bi bi-geo-alt fs-5 flex-shrink-0" style="color:#f9a8d4"></i>
                  <div class="overflow-hidden"><div class="text-muted" style="font-size:.7rem">Helyszín</div><div class="text-white fw-bold small text-truncate">{{ ev.location || 'Helyszín TBD' }}</div></div>
                </div>
                <div class="d-flex align-items-center gap-3 p-3 rounded-3" style="background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.3)">
                  <i class="bi bi-ticket-perforated fs-5" style="color:#6ee7b7"></i>
                  <div><div class="text-muted" style="font-size:.7rem">Belépő</div><div class="text-white fw-bold small">{{ ev.price || 'Ingyenes' }}</div></div>
                </div>
                <div class="d-flex align-items-center gap-3 p-3 rounded-3" style="background:rgba(6,182,212,.15);border:1px solid rgba(6,182,212,.3)">
                  <i class="bi bi-telephone fs-5" style="color:#67e8f9"></i>
                  <div><div class="text-muted" style="font-size:.7rem">Kapcsolat</div><div class="text-white fw-bold small">{{ ev.contact_phone || 'Nincs megadva' }}</div></div>
                </div>
              </div>
            </div>
            <div class="mt-4 p-4 rounded-3 border border-secondary border-opacity-25" style="background:rgba(30,41,59,.5)">
              <h5 class="text-white fw-bold mb-3"><i class="bi bi-file-text me-2" style="color:#d946ef"></i>Leírás</h5>
              <p class="text-secondary lh-lg mb-0">{{ ev.description || 'Nincs leírás.' }}</p>
            </div>
            <div v-if="tags.length" class="mt-3">
              <div class="d-flex flex-wrap gap-2"><span v-for="t in tags" :key="t" class="tag-pill">{{ t }}</span></div>
            </div>
          </div>
          <div class="modal-footer border-0 justify-content-between">
            <button class="btn btn-gradient px-4" @click="$emit('share', ev)"><i class="bi bi-share me-1"></i> Megosztás</button>
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
const ev = computed(() => props.event || {});
const fmtDate = computed(() => {
  if (!ev.value.date) return '';
  try { return new Date(ev.value.date).toLocaleDateString('hu-HU', { year:'numeric',month:'long',day:'numeric' }); } catch { return ev.value.date; }
});
const fmtTime = computed(() => ev.value.time ? ev.value.time.substring(0,5) : 'Nincs megadva');
const tags = computed(() => {
  const t = ev.value.tags;
  const l = Array.isArray(t) ? t : (t ? t.split(',') : []);
  return l.map(x => x.trim()).filter(Boolean);
});
watch(() => props.visible, v => { document.body.style.overflow = v ? 'hidden' : ''; });
function close() { emit('update:visible', false); }
</script>
