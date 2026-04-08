<template>
  <Teleport to="body">
    <div class="modal fade modal-dark" :class="{ show: visible }" :style="{ display: visible ? 'block' : 'none' }" tabindex="-1" @click.self="close">
      <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content" style="background:#0f172a;border:1px solid #334155;color:#e2e8f0;border-radius:16px">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold" style="background:linear-gradient(90deg,#a78bfa,#e879f9);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Esemény szerkesztése</h5>
            <button type="button" class="btn-close btn-close-white" @click="close"></button>
          </div>
          <div class="modal-body p-4">
            <form id="edit-form" @submit.prevent="handleSubmit">
              <div class="mb-3"><label class="form-label text-secondary small">Esemény Címe *</label><input v-model="form.title" type="text" class="form-control form-dark" required /></div>
              <div class="row mb-3">
                <div class="col-6"><label class="form-label text-secondary small">Dátum *</label><input v-model="form.date" type="date" class="form-control form-dark" required /></div>
                <div class="col-6"><label class="form-label text-secondary small">Idő *</label><input v-model="form.time" type="time" class="form-control form-dark" required /></div>
              </div>
              <div class="mb-3">
                <label class="form-label text-secondary small">Város *</label>
                <input v-model="locationData.city" type="text" class="form-control form-dark" placeholder="pl. Budapest" required />
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
                <div class="col-6">
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
              </div>
              <div class="row mb-3">
                <div class="col-6"><label class="form-label text-secondary small">Értékelés</label>
                  <select v-model="form.rating" class="form-select form-dark"><option value="0">Nincs</option><option v-for="r in [1,1.5,2,2.5,3,3.5,4,4.5,5]" :key="r" :value="String(r)">⭐ {{ r }}</option></select>
                </div>
                <div class="col-6"><label class="form-label text-secondary small">Kategória</label>
                  <select v-model="form.category" class="form-select form-dark"><option v-for="c in cats" :key="c" :value="c">{{ c }}</option></select>
                </div>
              </div>
              <div class="mb-3"><label class="form-label text-secondary small">Leírás</label><textarea v-model="form.description" rows="3" class="form-control form-dark"></textarea></div>
              <div class="mb-3">
                <label class="form-label text-secondary small d-block mb-2">Esemény képe</label>
                <div v-if="existingImg && !newPrev" class="mb-2"><p class="text-secondary small mb-1">Jelenlegi kép:</p><img :src="existingImg" class="rounded-3 border border-secondary w-100" style="height:150px;object-fit:cover" /></div>
                <label v-if="!newPrev" class="upload-area d-flex flex-column align-items-center justify-content-center w-100 py-3" style="cursor:pointer">
                  <i class="bi bi-cloud-upload fs-2 text-secondary d-block mb-1"></i><span class="text-secondary small">Új kép feltöltése</span>
                  <input type="file" accept="image/*" class="d-none" @change="onFile" />
                </label>
                <div v-if="newPrev" class="mt-2 position-relative rounded-3 overflow-hidden border border-secondary">
                  <img :src="newPrev" class="w-100" style="height:150px;object-fit:cover" />
                  <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle p-1" style="width:30px;height:30px;display:flex;align-items:center;justify-content:center" @click="newFile=null;newPrev=null"><i class="bi bi-x"></i></button>
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
import { ref, reactive, watch, inject } from 'vue';
import { useEvents } from '../stores/events.js';
const props = defineProps({ visible: Boolean, event: { type: Object, default: null } });
const emit = defineEmits(['update:visible', 'updated', 'deleted']);
const showToast = inject('showToast');
const { updateEvent, deleteEvent } = useEvents();
const cats = ['Házibuli','Klub','Fesztivál','Rave','Chill','Egyéb'];
const form = reactive({ title:'',date:'',time:'',location:'',organizer:'',contact_phone:'',rating:'0',category:'Egyéb',description:'' });

const phoneData = reactive({ prefix: '30', number: '' });
watch(phoneData, (newVal) => {
  if (newVal.number && newVal.number.trim() !== '') {
    form.contact_phone = `+36 ${newVal.prefix} ${newVal.number.trim().replace(/\s/g, '').replace(/(\d{3})(\d{0,4})/, '$1 $2').trim()}`;
  } else {
    form.contact_phone = '';
  }
}, { deep: true });

const locationData = reactive({ city: '', district: '', street: '', houseNumber: '' });
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
watch(() => props.event, ev => {
  if (!ev) return;
  form.title=ev.title||''; form.date=ev.date||''; form.time=ev.time?ev.time.substring(0,5):'';
  form.location=ev.location||''; form.organizer=ev.organizer||''; form.contact_phone=ev.contact_phone||''; form.rating=String(ev.rating||'0');
  form.category=ev.category||'Egyéb'; form.description=ev.description||'';  
  
  if (ev.contact_phone) {
    const cleaned = ev.contact_phone.trim().replace(/\s/g, '');
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

  if (ev.location) {
    const parts = ev.location.split(',').map(p => p.trim());
    if (parts[0] && (parts[0].toLowerCase() === 'budapest' || parts[0].toLowerCase() === 'bp' || parts[0].toLowerCase() === 'bp.')) {
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
      locationData.city = parts[0] || '';
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
    Object.assign(locationData, { city: '', district: '', street: '', houseNumber: '' });
  }
  existingImg.value=ev.imageUrl||null; newFile.value=null; newPrev.value=null;
}, { immediate: true });
watch(() => props.visible, v => { document.body.style.overflow = v ? 'hidden' : ''; });
function close() { emit('update:visible', false); }
function onFile(e) { const f=e.target.files[0]; if(!f)return; newFile.value=f; const r=new FileReader(); r.onload=ev=>{newPrev.value=ev.target.result}; r.readAsDataURL(f); }
async function handleSubmit() {
  if(!props.event)return; const fd=new FormData();
  Object.entries(form).forEach(([k,v])=>fd.append(k,v));
  const result = await updateEvent(props.event.id, fd, newFile.value, existingImg.value);
  if(result.success) emit('updated');
  else showToast(result.message||Object.values(result.errors||{})[0]?.[0]||'Hiba', 'error');
}
async function handleDelete() {
  if(!props.event||!confirm('Biztosan törölni szeretnéd?'))return;
  const r = await deleteEvent(props.event.id);
  if(r.success) emit('deleted'); else showToast(r.message||'Nem sikerült törölni','error');
}
</script>
