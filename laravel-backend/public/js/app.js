let allEvents = [];
let activeCategory = 'all';
let editingImageUrl = null;

// Szekció láthatóságának kezelése

function showSection(id) {
  ['events-section', 'my-events-section', 'favorites-section', 'community-section'].forEach(s => {
    const el = document.getElementById(s);
    if (el) el.classList.add('hidden');
  });
  const target = document.getElementById(id);
  if (target) target.classList.remove('hidden');
}

function showAllEvents()  { showSection('events-section');    loadAllEvents(); }
function showMyEvents()   { showSection('my-events-section'); loadMyEvents(); }
function showFavorites()  { showSection('favorites-section'); loadFavorites(); }
function showCommunity()  { showSection('community-section'); loadCommunity(); }

// Összes esemény betöltése

async function loadAllEvents() {
  allEvents = await apiFetchEvents();
  buildCategoryFilters();
  renderFilteredEvents();
}

function buildCategoryFilters() {
  const container = document.getElementById('category-filters');
  if (!container) return;
  const categories = ['all', ...new Set(allEvents.map(e => e.category).filter(Boolean))];
  container.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (cat === activeCategory ? ' active' : '');
    btn.textContent = cat === 'all' ? 'Összes' : cat;
    btn.addEventListener('click', () => {
      activeCategory = cat;
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderFilteredEvents();
    });
    container.appendChild(btn);
  });
}

function renderFilteredEvents() {
  const query = (document.getElementById('search-input')?.value || '').toLowerCase().trim();
  let list = activeCategory === 'all' ? allEvents : allEvents.filter(e => e.category === activeCategory);
  if (query) {
    list = list.filter(e =>
      (e.title || '').toLowerCase().includes(query) ||
      (e.location || '').toLowerCase().includes(query) ||
      (e.description || '').toLowerCase().includes(query)
    );
  }

  const grid = document.getElementById('events-grid');
  const empty = document.getElementById('empty-state');
  if (!grid) return;
  grid.innerHTML = '';

  if (!list.length) {
    empty && empty.classList.remove('hidden');
    return;
  }
  empty && empty.classList.add('hidden');

  list.forEach(ev => {
    const isFav = favoriteEventIds.has(ev.id);
    const card = renderEventCard(ev, { isFav, currentUser });
    attachCardListeners(card, ev);
    grid.appendChild(card);
  });
}

// Saját események betöltése

async function loadMyEvents() {
  if (!currentUser) { showAuthReminder(); return; }
  const events = await apiFetchMyEvents();
  const grid  = document.getElementById('my-events-grid');
  const empty = document.getElementById('my-events-empty');
  if (!grid) return;
  grid.innerHTML = '';

  if (!events.length) {
    empty && empty.classList.remove('hidden');
    return;
  }
  empty && empty.classList.add('hidden');

  events.forEach(ev => {
    const card = renderEventCard(ev, { isMine: true, currentUser });
    attachCardListeners(card, ev);
    grid.appendChild(card);
  });
}

// Kedvencek betöltése

async function loadFavorites() {
  if (!currentUser) { showAuthReminder(); return; }
  const favs  = await apiFetchFavorites();
  const grid  = document.getElementById('favorites-grid');
  const empty = document.getElementById('favorites-empty');
  if (!grid) return;
  grid.innerHTML = '';

  if (!favs.length) {
    empty && empty.classList.remove('hidden');
    return;
  }
  empty && empty.classList.add('hidden');

  favs.forEach(ev => {
    const card = renderEventCard(ev, { isFav: true, currentUser });
    attachCardListeners(card, ev);
    grid.appendChild(card);
  });
}

// Közösség betöltése

async function loadCommunity() {
  const [users, events] = await Promise.all([apiFetchUsers(), apiFetchEvents()]);

  document.getElementById('total-users').textContent  = users.length;
  document.getElementById('total-events').textContent = events.length;

  // Csoportosítás felhasználó szerint a rendezők listájához
  const byUser = {};
  events.forEach(ev => {
    if (ev.user_id) byUser[ev.user_id] = (byUser[ev.user_id] || 0) + 1;
  });

  const orgGrid  = document.getElementById('top-organizers-grid');
  const orgEmpty = document.getElementById('organizers-empty');
  const actFeed  = document.getElementById('activity-feed');
  const actEmpty = document.getElementById('activity-empty');

  if (orgGrid) {
    orgGrid.innerHTML = '';
    const organizers = users.filter(u => byUser[u.id] > 0)
      .sort((a, b) => (byUser[b.id] || 0) - (byUser[a.id] || 0))
      .slice(0, 8);
    if (organizers.length) {
      orgEmpty && orgEmpty.classList.add('hidden');
      organizers.forEach(u => orgGrid.appendChild(renderOrganizerCard(u, byUser[u.id] || 0)));
    } else {
      orgEmpty && orgEmpty.classList.remove('hidden');
    }
  }

  if (actFeed) {
    actFeed.innerHTML = '';
    const recent = [...events].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)).slice(0, 10);
    if (recent.length) {
      actEmpty && actEmpty.classList.add('hidden');
      recent.forEach(ev => {
        actFeed.appendChild(renderActivityItem(
          `Új esemény: <strong class="text-white">${escapeHtml(ev.title)}</strong> — ${escapeHtml(ev.location || '')}`,
          'bi-calendar-plus'
        ));
      });
    } else {
      actEmpty && actEmpty.classList.remove('hidden');
    }
  }
}

// Eseménykártyákhoz eseménykezelők

function attachCardListeners(cardEl, ev) {
  cardEl.querySelector('.details-btn')?.addEventListener('click', e => {
    e.stopPropagation();
    openEventDetails(ev);
  });

  cardEl.querySelector('.favorite-btn')?.addEventListener('click', async e => {
    e.stopPropagation();
    if (!currentUser) { toggleAuthModal(true); return; }
    const btn = e.currentTarget;
    const isFav = btn.classList.contains('active');
    if (isFav) {
      await apiRemoveFavorite(ev.id);
      favoriteEventIds.delete(ev.id);
      btn.classList.remove('active');
      btn.querySelector('i').className = 'bi bi-heart';
      showToast('Eltávolítva a kedvencekből', 'info');
    } else {
      await apiAddFavorite(ev.id);
      favoriteEventIds.add(ev.id);
      btn.classList.add('active');
      btn.querySelector('i').className = 'bi bi-heart-fill';
      showToast('Kedvencekhez adva!', 'success');
    }
  });

  cardEl.querySelector('.edit-btn')?.addEventListener('click', e => {
    e.stopPropagation();
    openEditModal(ev);
  });
}

// Esemény részletek megnyitása

function openEventDetails(ev) {
  document.getElementById('detail-event-title-modal').textContent = ev.title || '';
  document.getElementById('detail-event-title').textContent       = ev.title || '';

  const img = document.getElementById('detail-event-image');
  img.src = ev.imageUrl || PLACEHOLDER_IMAGE;
  img.alt = ev.title || '';

  document.getElementById('detail-category-badge').textContent = ev.category || 'Egyéb';

  const orgSpan = document.getElementById('detail-event-organizer').querySelector('span');
  if (orgSpan) orgSpan.textContent = ev.organizer || 'Ismeretlen';

  if (ev.date) {
    const d = new Date(ev.date);
    document.getElementById('detail-event-date').textContent = d.toLocaleDateString('hu-HU', { year:'numeric', month:'long', day:'numeric' });
  } else {
    document.getElementById('detail-event-date').textContent = '';
  }
  document.getElementById('detail-event-time').textContent     = ev.time ? ev.time.substring(0,5) : 'Nincs megadva';
  document.getElementById('detail-event-location').textContent = ev.location || '';
  document.getElementById('detail-event-price').textContent    = ev.price || 'Ingyenes';
  document.getElementById('detail-event-contact').textContent  = ev.contact_phone || 'Nincs megadva';
  document.getElementById('detail-event-description').textContent = ev.description || 'Nincs leírás.';

  const cleanTags = parseTags(ev.tags);
  const tagsContainer = document.getElementById('detail-tags-container');
  const tagsEl = document.getElementById('detail-event-tags');
  if (cleanTags.length && tagsEl && tagsContainer) {
    tagsEl.innerHTML = cleanTags.map(t => `<span class="tag-pill">${escapeHtml(t)}</span>`).join('');
    tagsContainer.classList.remove('hidden');
  } else if (tagsContainer) {
    tagsContainer.classList.add('hidden');
  }

  document.getElementById('share-event-btn').onclick = () => {
    const url = `${window.location.origin}/event/${ev.id}`;
    if (navigator.share) { navigator.share({ title: ev.title, url }); }
    else { navigator.clipboard.writeText(url).then(() => showToast('Link másolva!', 'success')); }
  };

  toggleEventDetailsModal(true);
}

// Felhasználói állapot kezelése

function setupImageUploadPreview(inputId, previewId, previewContainerId, uploadLabelId, removeBtnId) {
  const imgInput  = document.getElementById(inputId);
  const preview   = document.getElementById(previewId);
  const previewC  = document.getElementById(previewContainerId);
  const uploadLbl = document.getElementById(uploadLabelId);
  const removeBtn = document.getElementById(removeBtnId);

  imgInput.addEventListener('change', () => {
    const file = imgInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      preview.src = e.target.result;
      previewC.classList.remove('hidden');
      uploadLbl.classList.add('hidden');
    };
    reader.readAsDataURL(file);
  });

  removeBtn.addEventListener('click', () => {
    imgInput.value = '';
    preview.src = '';
    previewC.classList.add('hidden');
    uploadLbl.classList.remove('hidden');
  });

  return { imgInput, preview, previewC, uploadLbl };
}

function initCreateEventForm() {
  const form = document.getElementById('create-event-form');
  const { imgInput, preview, previewC, uploadLbl } = setupImageUploadPreview(
    'event-image', 'image-preview', 'image-preview-container',
    'image-upload-label', 'remove-image-btn'
  );

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(form);

    // Kép feltöltése, ha van
    const imgFile = imgInput.files[0];
    if (imgFile) {
      const up = await apiUploadImage(imgFile);
      if (up.success) data.set('image_url', up.url);
      data.delete('image');
    }

    const result = await apiCreateEvent(data);
    if (result.success) {
      showToast('Esemény sikeresen létrehozva!', 'success');
      toggleModal(false);
      form.reset();
      preview.src = '';
      previewC.classList.add('hidden');
      uploadLbl.classList.remove('hidden');
      await loadAllEvents();
    } else {
      const msg = result.message || Object.values(result.errors || {})[0]?.[0] || 'Hiba a létrehozás során';
      showToast(msg, 'error');
    }
  });

  document.getElementById('close-modal-btn').addEventListener('click', () => toggleModal(false));
  document.getElementById('cancel-modal-btn').addEventListener('click', () => toggleModal(false));
}

// Esemény szerkesztése

function openEditModal(ev) {
  document.getElementById('edit-event-id').value          = ev.id;
  document.getElementById('edit-event-title').value       = ev.title || '';
  document.getElementById('edit-event-date').value        = ev.date || '';
  document.getElementById('edit-event-time').value        = ev.time ? ev.time.substring(0,5) : '';
  document.getElementById('edit-event-location').value    = ev.location || '';
  document.getElementById('edit-event-organizer').value   = ev.organizer || '';
  document.getElementById('edit-event-rating').value      = ev.rating || '0';
  document.getElementById('edit-event-category').value    = ev.category || 'Egyéb';
  document.getElementById('edit-event-description').value = ev.description || '';

  const curImg = document.getElementById('edit-current-image');
  const curImgPreview = document.getElementById('edit-current-image-preview');
  editingImageUrl = ev.imageUrl || null;
  if (ev.imageUrl) {
    curImgPreview.src = ev.imageUrl;
    curImg.classList.remove('hidden');
  } else {
    curImg.classList.add('hidden');
  }

  const editImgPreviewC = document.getElementById('edit-image-preview-container');
  const editUploadLbl   = document.getElementById('edit-image-upload-label');
  const editImgInput    = document.getElementById('edit-event-image');
  editImgInput.value = '';
  editImgPreviewC.classList.add('hidden');
  editUploadLbl.classList.remove('hidden');

  toggleEditModal(true);
}

function initEditEventForm() {
  const form = document.getElementById('edit-event-form');
  const { imgInput } = setupImageUploadPreview(
    'edit-event-image', 'edit-image-preview', 'edit-image-preview-container',
    'edit-image-upload-label', 'edit-remove-image-btn'
  );

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const id   = document.getElementById('edit-event-id').value;
    const data = new FormData(form);

    const imgFile = imgInput.files[0];
    if (imgFile) {
      const up = await apiUploadImage(imgFile);
      if (up.success) data.set('image_url', up.url);
      data.delete('image');
    } else if (editingImageUrl) {
      data.set('image_url', editingImageUrl);
    }

    const result = await apiUpdateEvent(id, data);
    if (result.success) {
      showToast('Esemény frissítve!', 'success');
      toggleEditModal(false);
      await loadMyEvents();
      loadAllEvents();
    } else {
      const msg = result.message || Object.values(result.errors || {})[0]?.[0] || 'Hiba a mentés során';
      showToast(msg, 'error');
    }
  });

  document.getElementById('delete-event-btn').addEventListener('click', async () => {
    const id = document.getElementById('edit-event-id').value;
    if (!confirm('Biztosan törölni szeretnéd ezt az eseményt?')) return;
    const result = await apiDeleteEvent(id);
    if (result.success) {
      showToast('Esemény törölve', 'info');
      toggleEditModal(false);
      await loadMyEvents();
      loadAllEvents();
    } else {
      showToast(result.message || 'Nem sikerült törölni', 'error');
    }
  });

  document.getElementById('close-edit-modal-btn').addEventListener('click', () => toggleEditModal(false));
  document.getElementById('cancel-edit-modal-btn').addEventListener('click', () => toggleEditModal(false));
}

// Hitelesítés állapotának kezelése

function initAuthForms() {
  const loginForm     = document.getElementById('login-form');
  const registerForm  = document.getElementById('register-form');
  const toggleBtn     = document.getElementById('auth-toggle-btn');
  const toggleText    = document.getElementById('auth-toggle-text');
  const modalTitle    = document.getElementById('auth-modal-title');
  const closeBtn      = document.getElementById('close-auth-modal-btn');
  let isLogin = true;

  toggleBtn.addEventListener('click', () => {
    isLogin = !isLogin;
    loginForm.classList.toggle('hidden', !isLogin);
    registerForm.classList.toggle('hidden', isLogin);
    modalTitle.textContent     = isLogin ? 'Bejelentkezés' : 'Regisztráció';
    toggleText.textContent     = isLogin ? 'Nincs még fiókod?' : 'Már van fiókod?';
    toggleBtn.textContent      = isLogin ? 'Regisztrálj most' : 'Bejelentkezés';
  });

  closeBtn.addEventListener('click', () => toggleAuthModal(false));

  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass  = document.getElementById('login-password').value;
    const result = await apiLogin(email, pass);
    if (result.success) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, result.token);
      setCurrentUser(result.user);
      toggleAuthModal(false);
      showToast(`Üdv, ${result.user.name}!`, 'success');
      await loadFavoritesIds();
    } else {
      showToast(result.message || 'Hibás email vagy jelszó', 'error');
    }
  });

  registerForm.addEventListener('submit', async e => {
    e.preventDefault();
    const name  = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const pass  = document.getElementById('register-password').value;
    const pass2 = document.getElementById('register-password-confirm').value;
    if (pass !== pass2) { showToast('A jelszavak nem egyeznek meg', 'error'); return; }
    const result = await apiRegister(name, email, pass);
    if (result.success) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, result.token);
      setCurrentUser(result.user);
      toggleAuthModal(false);
      showToast('Regisztráció sikeres!', 'success');
      await loadFavoritesIds();
    } else {
      const msg = result.message || Object.values(result.errors || {})[0]?.[0] || 'Hiba a regisztráció során';
      showToast(msg, 'error');
    }
  });
}

// Kedvencek ID-jainak betöltése

async function loadFavoritesIds() {
  if (!currentUser) { favoriteEventIds.clear(); return; }
  const favs = await apiFetchFavorites();
  favoriteEventIds = new Set(favs.map(f => f.id));
}

//Hitelesítés szükségességének jelzése

function showAuthReminder() {
  showToast('Kérjük, jelentkezz be a folytatáshoz!', 'warning');
  toggleAuthModal(true);
}

// Esemény részletek megnyitása 

document.addEventListener('DOMContentLoaded', async () => {
  initModals();
  initAuthForms();
  initCreateEventForm();
  initEditEventForm();

  document.getElementById('close-event-details-btn').addEventListener('click', () => toggleEventDetailsModal(false));
  document.getElementById('close-event-details-btn-2').addEventListener('click', () => toggleEventDetailsModal(false));

  const authBtn = document.getElementById('auth-btn');
  authBtn.addEventListener('click', () => {
    if (!currentUser) toggleAuthModal(true);
  });

  document.getElementById('search-input')?.addEventListener('input', () => renderFilteredEvents());

  // Jelenlegi felhasználó lekérése és állapot frissítése
  const user = await apiGetCurrentUser();
  setCurrentUser(user);
  if (user) await loadFavoritesIds();

  showAllEvents();
});
