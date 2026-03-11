// --- STATE ---
let events = [];
let myEvents = [];
let favoriteEvents = [];
let favoriteEventIds = new Set();
let selectedCategory = 'All';
let searchQuery = '';
let currentUser = null;
let currentView = 'all';
let editingEventId = null;

// --- TOAST NOTIFICATION SYSTEM ---
window.showToast = function(message, type = 'info') {
  // Létrehozunk egy toast container-t, ha még nincs
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed top-20 right-4 z-50 flex flex-col gap-3';
    document.body.appendChild(toastContainer);
  }

  // Toast színek típus szerint
  const types = {
    success: 'from-green-600 to-emerald-600 border-green-500',
    error: 'from-red-600 to-rose-600 border-red-500',
    warning: 'from-amber-600 to-orange-600 border-amber-500',
    info: 'from-violet-600 to-fuchsia-600 border-violet-500'
  };

  const icons = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
    warning: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
  };

  const toast = document.createElement('div');
  toast.className = `bg-gradient-to-r ${types[type]} border-l-4 rounded-lg shadow-2xl p-4 min-w-[320px] max-w-md backdrop-blur-sm transform translate-x-[400px] transition-transform duration-300 ease-out`;
  toast.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="text-white flex-shrink-0">
        ${icons[type]}
      </div>
      <div class="flex-1">
        <p class="text-white font-medium text-sm leading-relaxed">${message}</p>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="text-white/80 hover:text-white transition-colors flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `;

  toastContainer.appendChild(toast);

  // Animáció befelé
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 10);

  // Automatikus eltűnés 4 másodperc után
  setTimeout(() => {
    toast.style.transform = 'translateX(400px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// --- DOM ELEMENTS ---
let grid;
let emptyState;
let myEventsGrid;
let myEventsEmpty;
let myEventsSection;
let eventsSection;
let communitySection;
let categoryContainer;
let searchInput;
let modal;
let modalBackdrop;
let openModalBtn;
let closeModalBtn;
let cancelModalBtn;
let createEventForm;
let descriptionInput;
let authModal;
let authModalBackdrop;
let authBtn;
let closeAuthModalBtn;
let loginForm;
let registerForm;
let authToggleBtn;
let authToggleText;
let authModalTitle;
let eventDetailsModal;
let eventDetailsBackdrop;

// --- VIEW SWITCHING ---

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

window.setCategory = (cat) => {
  selectedCategory = cat;
  renderCategories();
  renderEvents();
};

window.showAllEvents = () => {
  currentView = 'all';
  eventsSection.classList.remove('hidden');
  myEventsSection.classList.add('hidden');
  document.getElementById('favorites-section').classList.add('hidden');
  communitySection.classList.add('hidden');
  eventsSection.classList.add('flex-1');
};

window.showMyEvents = async () => {
  if (!currentUser) {
    showToast('Jelentkezz be a saját bulijaid megtekintéséhez!', 'warning');
    return;
  }
  
  currentView = 'my';
  eventsSection.classList.add('hidden');
  eventsSection.classList.remove('flex-1');
  myEventsSection.classList.remove('hidden');
  document.getElementById('favorites-section').classList.add('hidden');
  communitySection.classList.add('hidden');
  
  myEvents = await loadMyEventsFromDB();
  renderMyEvents();
};

window.showFavorites = async () => {
  if (!currentUser) {
    showToast('Jelentkezz be a kedvencek megtekintéséhez!', 'warning');
    return;
  }
  
  currentView = 'favorites';
  eventsSection.classList.add('hidden');
  eventsSection.classList.remove('flex-1');
  myEventsSection.classList.add('hidden');
  document.getElementById('favorites-section').classList.remove('hidden');
  communitySection.classList.add('hidden');
  
  favoriteEvents = await getFavoriteEvents();
  renderFavorites(favoriteEvents);
};

window.toggleFavorite = async (eventId) => {
  if (!currentUser) {
    showToast('Jelentkezz be a kedvencek használatához!', 'warning');
    return;
  }
  
  // Ensure eventId is a number for consistent Set operations
  eventId = parseInt(eventId);
  
  const isFavorite = favoriteEventIds.has(eventId);
  
  const result = isFavorite 
    ? await removeFromFavorites(eventId)
    : await addToFavorites(eventId);
  
  if (result.success) {
    if (isFavorite) {
      favoriteEventIds.delete(eventId);
      showToast('Eltávolítva a kedvencek közül', 'info');
    } else {
      favoriteEventIds.add(eventId);
      showToast('Kedvencekhez adva', 'success');
    }
    
    // Frissítjük a gomb megjelenését
    updateFavoriteButton(eventId, !isFavorite);
    
    // Ha a kedvencek nézetben vagyunk, frissítsük
    if (currentView === 'favorites') {
      await showFavorites();
    }
  } else {
    showToast(result.error || 'Hiba történt', 'error');
  }
};

function updateFavoriteButton(eventId, isFavorite) {
  const btn = document.querySelector(`.favorite-btn[data-event-id="${eventId}"]`);
  if (btn) {
    const svg = btn.querySelector('svg');
    if (isFavorite) {
      btn.classList.add('text-red-500');
      btn.classList.remove('text-slate-400');
      svg.setAttribute('fill', 'currentColor');
      btn.title = 'Eltávolítás a kedvencek közül';
    } else {
      btn.classList.remove('text-red-500');
      btn.classList.add('text-slate-400');
      svg.setAttribute('fill', 'none');
      btn.title = 'Kedvencekhez adás';
    }
  }
}

async function loadFavoriteIds() {
  if (!currentUser) return;
  favoriteEvents = await getFavoriteEvents();
  favoriteEventIds = new Set(favoriteEvents.map(e => parseInt(e.id)));
  updateAllFavoriteButtons();
}

function updateAllFavoriteButtons() {
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    const eventId = parseInt(btn.getAttribute('data-event-id'));
    const isFavorite = favoriteEventIds.has(eventId);
    updateFavoriteButton(eventId, isFavorite);
  });
}

window.showCommunity = async () => {
  currentView = 'community';
  eventsSection.classList.add('hidden');
  eventsSection.classList.remove('flex-1');
  myEventsSection.classList.add('hidden');
  document.getElementById('favorites-section').classList.add('hidden');
  communitySection.classList.remove('hidden');
  
  await loadCommunityData();
};

window.openEditModal = async (eventId) => {
  editingEventId = eventId;
  const event = myEvents.find(e => e.id == eventId);
  
  if (!event) return;
  
  document.getElementById('edit-event-id').value = event.id;
  document.getElementById('edit-event-title').value = event.title;
  document.getElementById('edit-event-date').value = event.date;
  document.getElementById('edit-event-time').value = event.time;
  document.getElementById('edit-event-location').value = event.location;
  document.getElementById('edit-event-organizer').value = event.organizer || '';
  document.getElementById('edit-event-rating').value = event.rating || 0;
  document.getElementById('edit-event-category').value = event.category;
  document.getElementById('edit-event-description').value = event.description || '';
  
  const currentImageDiv = document.getElementById('edit-current-image');
  const currentImagePreview = document.getElementById('edit-current-image-preview');
  if (event.imageUrl && !event.imageUrl.includes('picsum.photos')) {
    currentImageDiv.classList.remove('hidden');
    currentImagePreview.src = event.imageUrl;
  } else {
    currentImageDiv.classList.add('hidden');
  }
  
  toggleEditModal(true);
};

window.deleteEventDirectly = async (eventId) => {
  if (!confirm('Biztosan törölni szeretnéd ezt az eseményt?')) {
    return;
  }
  
  const result = await deleteEventFromDB(eventId);
  
  if (result.success) {
    myEvents = await loadMyEventsFromDB();
    events = await loadEventsFromDB();
    
    renderMyEvents();
    renderEvents();
    alert('Esemény sikeresen törölve!');
  } else {
    alert('Hiba történt az esemény törlésekor: ' + (result.error || 'Ismeretlen hiba'));
  }
};

window.showEventDetails = (eventId) => {
  const event = events.find(e => e.id == eventId);
  if (!event) return;
  
  // Fill modal with event data
  document.getElementById('detail-event-image').src = event.imageUrl;
  document.getElementById('detail-category-badge').textContent = event.category;
  document.getElementById('detail-event-title').textContent = event.title;
  document.getElementById('detail-event-organizer').querySelector('.text-fuchsia-400').textContent = event.organizer || 'Ismeretlen';
  document.getElementById('detail-event-date').textContent = formatDate(event.date);
  document.getElementById('detail-event-time').textContent = event.time;
  document.getElementById('detail-event-location').textContent = event.location;
  document.getElementById('detail-event-description').textContent = event.description || 'Nincs leírás megadva.';
  document.getElementById('detail-event-id').textContent = '#' + String(event.id).padStart(4, '0');
  
  // Handle tags
  const tagsContainer = document.getElementById('detail-tags-container');
  const tagsElement = document.getElementById('detail-event-tags');
  if (event.tags && event.tags.length > 0) {
    tagsContainer.classList.remove('hidden');
    tagsElement.innerHTML = event.tags.map(tag => 
      `<span class="px-3 py-1 bg-fuchsia-600/20 border border-fuchsia-500/30 rounded-full text-fuchsia-300 text-sm font-medium">${escapeHtml(tag)}</span>`
    ).join('');
  } else {
    tagsContainer.classList.add('hidden');
  }
  
  // Show modal
  eventDetailsModal.classList.remove('hidden');
  eventDetailsModal.classList.add('flex');
};

function formatDate(dateString) {
  const date = new Date(dateString);
  const months = ['jan', 'feb', 'már', 'ápr', 'máj', 'jún', 'júl', 'aug', 'szep', 'okt', 'nov', 'dec'];
  return `${date.getFullYear()}. ${months[date.getMonth()]}. ${date.getDate()}.`;
}

function toggleEventDetailsModal(show) {
  if (show) {
    eventDetailsModal.classList.remove('hidden');
    eventDetailsModal.classList.add('flex');
  } else {
    eventDetailsModal.classList.add('hidden');
    eventDetailsModal.classList.remove('flex');
  }
}

// --- INITIALIZATION ---

async function initializeApp() {
  // Initialize DOM elements
  grid = document.getElementById('events-grid');
  emptyState = document.getElementById('empty-state');
  myEventsGrid = document.getElementById('my-events-grid');
  myEventsEmpty = document.getElementById('my-events-empty');
  myEventsSection = document.getElementById('my-events-section');
  eventsSection = document.querySelector('main#events');
  communitySection = document.getElementById('community-section');
  categoryContainer = document.getElementById('category-filters');
  searchInput = document.getElementById('search-input');
  modal = document.getElementById('create-event-modal');
  modalBackdrop = document.getElementById('modal-backdrop');
  openModalBtn = document.getElementById('open-modal-btn');
  closeModalBtn = document.getElementById('close-modal-btn');
  cancelModalBtn = document.getElementById('cancel-modal-btn');
  createEventForm = document.getElementById('create-event-form');
  descriptionInput = document.getElementById('event-description');

  authModal = document.getElementById('auth-modal');
  authModalBackdrop = document.getElementById('auth-modal-backdrop');
  authBtn = document.getElementById('auth-btn');
  closeAuthModalBtn = document.getElementById('close-auth-modal-btn');
  loginForm = document.getElementById('login-form');
  registerForm = document.getElementById('register-form');
  authToggleBtn = document.getElementById('auth-toggle-btn');
  authToggleText = document.getElementById('auth-toggle-text');
  authModalTitle = document.getElementById('auth-modal-title');

  eventDetailsModal = document.getElementById('event-details-modal');
  eventDetailsBackdrop = document.getElementById('event-details-backdrop');

  events = await loadEventsFromDB();

  const userCheck = await getCurrentUser();
  if (userCheck.success && userCheck.user) {
    currentUser = userCheck.user;
    updateUIForUser();
  }

  renderCategories();
  renderEvents();
  
  // Betöltjük a kedvenceket a renderelés után, hogy frissíthessük a gombokat
  if (currentUser) {
    await loadFavoriteIds();
  }

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderEvents();
  });

  setupImagePreview();

  if (!currentUser) {
    authBtn.addEventListener('click', () => toggleAuthModal(true));
  }
  closeAuthModalBtn.addEventListener('click', () => toggleAuthModal(false));
  authModalBackdrop.addEventListener('click', () => toggleAuthModal(false));

  // Event Details Modal Listeners
  document.getElementById('close-event-details-btn').addEventListener('click', () => toggleEventDetailsModal(false));
  document.getElementById('close-event-details-btn-2').addEventListener('click', () => toggleEventDetailsModal(false));
  eventDetailsBackdrop.addEventListener('click', () => toggleEventDetailsModal(false));
  
  document.getElementById('share-event-btn').addEventListener('click', () => {
    // Simple share functionality - copy to clipboard
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('Link másolva a vágólapra!');
    }).catch(() => {
      alert('Nem sikerült másolni a linket.');
    });
  });

  authToggleBtn.addEventListener('click', () => {
    const isLoginVisible = !loginForm.classList.contains('hidden');
    if (isLoginVisible) {
      loginForm.classList.add('hidden');
      registerForm.classList.remove('hidden');
      authModalTitle.textContent = 'Regisztráció';
      authToggleText.textContent = 'Van már fiókod?';
      authToggleBtn.textContent = 'Jelentkezz be';
    } else {
      registerForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
      authModalTitle.textContent = 'Bejelentkezés';
      authToggleText.textContent = 'Nincs még fiókod?';
      authToggleBtn.textContent = 'Regisztrálj most';
    }
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const result = await loginUser(email, password);
    
    if (result.success) {
      currentUser = result.user;
      await loadFavoriteIds();
      updateAllFavoriteButtons();
      updateUIForUser();
      toggleAuthModal(false);
      showToast(`Üdvözlünk, ${currentUser.name}!`, 'success');
    } else {
      showToast(result.error || 'Bejelentkezés sikertelen', 'error');
    }
  });

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;
    
    if (password !== passwordConfirm) {
      showToast('A jelszavak nem egyeznek!', 'error');
      return;
    }
    
    const result = await registerUser(name, email, password);
    
    if (result.success) {
      currentUser = result.user;
      updateUIForUser();
      toggleAuthModal(false);
      showToast(`Sikeres regisztráció! Üdvözlünk, ${currentUser.name}!`, 'success');
    } else {
      showToast(result.error || 'Regisztráció sikertelen', 'error');
    }
  });

  if (openModalBtn) {
    openModalBtn.addEventListener('click', () => toggleModal(true));
  }
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => toggleModal(false));
  }
  if (cancelModalBtn) {
    cancelModalBtn.addEventListener('click', () => toggleModal(false));
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', () => toggleModal(false));
  }

  createEventForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(createEventForm);
    const title = formData.get('title');
    const date = formData.get('date');
    const location = formData.get('location');

    if(!title || !date || !location) return;

    let imageUrl = '';
    const imageFile = formData.get('image');
    
    if (imageFile && imageFile.size > 0) {
      const uploadFormData = new FormData();
      uploadFormData.append('image', imageFile);
      
      try {
        const uploadResponse = await fetch('upload.php', {
          method: 'POST',
          body: uploadFormData
        });
        
        const uploadResult = await uploadResponse.json();
        
        if (uploadResult.success) {
          imageUrl = uploadResult.url;
        } else {
          alert('Hiba történt a kép feltöltésekor: ' + (uploadResult.error || 'Ismeretlen hiba'));
          return;
        }
      } catch (error) {
        alert('Hiba történt a kép feltöltésekor: ' + error.message);
        return;
      }
    } else {
      imageUrl = `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`;
    }

    const newEvent = {
      title: title,
      date: date,
      time: formData.get('time'),
      location: location,
      organizer: formData.get('organizer'),
      category: formData.get('category'),
      description: formData.get('description'),
      rating: parseFloat(formData.get('rating')) || 0.0,
      imageUrl: imageUrl,
      tags: ["Buli", "ProjectX"]
    };

    const result = await createEventInDB(newEvent);
    
    if (result.success) {
      events = await loadEventsFromDB();
      searchQuery = '';
      searchInput.value = '';
      selectedCategory = 'All';
      
      renderCategories();
      renderEvents();
      toggleModal(false);
    } else {
      alert('Hiba történt az esemény létrehozásakor: ' + (result.error || 'Ismeretlen hiba'));
    }
  });

  const editModalBackdrop = document.getElementById('edit-modal-backdrop');
  const closeEditModalBtn = document.getElementById('close-edit-modal-btn');
  const cancelEditModalBtn = document.getElementById('cancel-edit-modal-btn');
  const editEventForm = document.getElementById('edit-event-form');
  const deleteEventBtn = document.getElementById('delete-event-btn');

  if (closeEditModalBtn) {
    closeEditModalBtn.addEventListener('click', () => toggleEditModal(false));
  }
  if (cancelEditModalBtn) {
    cancelEditModalBtn.addEventListener('click', () => toggleEditModal(false));
  }
  if (editModalBackdrop) {
    editModalBackdrop.addEventListener('click', () => toggleEditModal(false));
  }

  setupEditImagePreview();

  editEventForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(editEventForm);
    const eventId = formData.get('id');
    const title = formData.get('title');
    const date = formData.get('date');
    const location = formData.get('location');

    if(!title || !date || !location) return;

    const originalEvent = myEvents.find(e => e.id == eventId);
    let imageUrl = originalEvent ? originalEvent.imageUrl : '';

    const imageFile = formData.get('image');
    
    if (imageFile && imageFile.size > 0) {
      const uploadFormData = new FormData();
      uploadFormData.append('image', imageFile);
      
      try {
        const uploadResponse = await fetch('upload.php', {
          method: 'POST',
          body: uploadFormData
        });
        
        const uploadResult = await uploadResponse.json();
        
        if (uploadResult.success) {
          imageUrl = uploadResult.url;
        } else {
          alert('Hiba történt a kép feltöltésekor: ' + (uploadResult.error || 'Ismeretlen hiba'));
          return;
        }
      } catch (error) {
        alert('Hiba történt a kép feltöltésekor: ' + error.message);
        return;
      }
    }

    const updatedEvent = {
      id: eventId,
      title: title,
      date: date,
      time: formData.get('time'),
      location: location,
      organizer: formData.get('organizer'),
      category: formData.get('category'),
      description: formData.get('description'),
      rating: parseFloat(formData.get('rating')) || 0.0,
      imageUrl: imageUrl,
      tags: ["Buli", "ProjectX"]
    };

    const result = await updateEventInDB(updatedEvent);
    
    if (result.success) {
      myEvents = await loadMyEventsFromDB();
      events = await loadEventsFromDB();
      
      renderMyEvents();
      renderEvents();
      toggleEditModal(false);
      alert('Esemény sikeresen módosítva!');
    } else {
      alert('Hiba történt az esemény módosításakor: ' + (result.error || 'Ismeretlen hiba'));
    }
  });

  deleteEventBtn.addEventListener('click', async () => {
    if (!editingEventId) return;
    
    if (!confirm('Biztosan törölni szeretnéd ezt az eseményt?')) {
      return;
    }
    
    const result = await deleteEventFromDB(editingEventId);
    
    if (result.success) {
      myEvents = await loadMyEventsFromDB();
      events = await loadEventsFromDB();
      
      renderMyEvents();
      renderEvents();
      toggleEditModal(false);
      alert('Esemény sikeresen törölve!');
    } else {
      alert('Hiba történt az esemény törlésekor: ' + (result.error || 'Ismeretlen hiba'));
    }
  });
}

// --- COMMUNITY FUNCTIONS ---

async function loadCommunityData() {
  // Load all users and events for community stats
  const usersResponse = await fetch('api.php?action=get_all_users');
  const usersData = await usersResponse.json();
  
  const allEvents = await loadEventsFromDB();
  
  // Update stats
  document.getElementById('total-users').textContent = usersData.users?.length || 0;
  document.getElementById('total-events').textContent = allEvents.length;
  
  // Render top organizers
  renderTopOrganizers(usersData.users || [], allEvents);
  
  // Render activity feed
  renderActivityFeed(allEvents);
}

function renderTopOrganizers(users, allEvents) {
  const organizersGrid = document.getElementById('top-organizers-grid');
  const organizersEmpty = document.getElementById('organizers-empty');
  
  // Count events per user
  const userEventCount = {};
  allEvents.forEach(event => {
    if (event.user_id) {
      userEventCount[event.user_id] = (userEventCount[event.user_id] || 0) + 1;
    }
  });
  
  // Sort users by event count
  const topOrganizers = users
    .map(user => ({
      ...user,
      eventCount: userEventCount[user.id] || 0
    }))
    .filter(user => user.eventCount > 0)
    .sort((a, b) => b.eventCount - a.eventCount)
    .slice(0, 4);
  
  if (topOrganizers.length === 0) {
    organizersGrid.classList.add('hidden');
    organizersEmpty.classList.remove('hidden');
    return;
  }
  
  organizersGrid.classList.remove('hidden');
  organizersEmpty.classList.add('hidden');
  
  organizersGrid.innerHTML = topOrganizers.map((user, index) => {
    const badges = ['🥇', '🥈', '🥉', '🏅'];
    return `
      <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-fuchsia-500/50 transition-all">
        <div class="text-center">
          <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-3xl">
            ${badges[index]}
          </div>
          <h4 class="font-bold text-lg text-white mb-1">${escapeHtml(user.name)}</h4>
          <p class="text-slate-400 text-sm mb-3">${escapeHtml(user.email)}</p>
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-fuchsia-600/20 border border-fuchsia-500/30 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-fuchsia-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span class="text-fuchsia-300 text-sm font-semibold">${user.eventCount} esemény</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderActivityFeed(allEvents) {
  const activityFeed = document.getElementById('activity-feed');
  const activityEmpty = document.getElementById('activity-empty');
  
  // Sort events by creation time (newest first) and take last 10
  const recentEvents = [...allEvents]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 10);
  
  if (recentEvents.length === 0) {
    activityFeed.classList.add('hidden');
    activityEmpty.classList.remove('hidden');
    return;
  }
  
  activityFeed.classList.remove('hidden');
  activityEmpty.classList.add('hidden');
  
  activityFeed.innerHTML = recentEvents.map(event => {
    const timeAgo = getTimeAgo(event.created_at);
    return `
      <div class="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-fuchsia-500/30 transition-all">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          </div>
          <div class="flex-1">
            <p class="text-white font-semibold mb-1">
              <span class="text-fuchsia-400">${escapeHtml(event.organizer || 'Valaki')}</span> létrehozott egy új eseményt
            </p>
            <p class="text-slate-300 mb-2">${escapeHtml(event.title)}</p>
            <div class="flex items-center gap-4 text-sm text-slate-400">
              <span class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                ${timeAgo}
              </span>
              <span class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                ${escapeHtml(event.location)}
              </span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function getTimeAgo(dateString) {
  if (!dateString) return 'nemrég';
  
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'most';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} perce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} órája`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} napja`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} hete`;
  const months = Math.floor(days / 30);
  return `${months} hónapja`;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
