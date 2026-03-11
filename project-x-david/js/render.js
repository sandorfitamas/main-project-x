// --- RENDER FUNCTIONS ---

// Helper: csillagok megjelenítése
function renderStars(rating) {
  // Convert to number if it's a string
  const numRating = parseFloat(rating) || 0;
  
  // Kerekítés speciális tartományok szerint
  let displayStars;
  if (numRating >= 4.8) {
    displayStars = 5;
  } else if (numRating >= 4.3) {
    displayStars = 4.5;
  } else if (numRating >= 3.8) {
    displayStars = 4;
  } else if (numRating >= 3.3) {
    displayStars = 3.5;
  } else {
    displayStars = Math.round(numRating * 2) / 2; // normál kerekítés alacsonyabb értékeknél
  }
  
  const fullStars = Math.floor(displayStars);
  const hasHalfStar = displayStars % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let starsHTML = '<div class="flex items-center gap-0.5 mb-2">';
  
  // Teli csillagok
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<svg class="w-4 h-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>';
  }
  
  // Fél csillag
  if (hasHalfStar) {
    starsHTML += '<svg class="w-4 h-4" viewBox="0 0 24 24"><defs><clipPath id="halfClip"><rect x="0" y="0" width="12" height="24"/></clipPath></defs><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="none" stroke="currentColor" stroke-width="2" class="text-slate-600"/><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" class="text-yellow-400" clip-path="url(#halfClip)"/></svg>';
  }
  
  // Üres csillagok
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<svg class="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>';
  }
  
  if (numRating > 0) {
    starsHTML += `<span class="text-sm text-slate-400 ml-1">(${numRating.toFixed(1)})</span>`;
  } else {
    starsHTML += `<span class="text-sm text-slate-500 ml-1">Nincs értékelés</span>`;
  }
  
  starsHTML += '</div>';
  return starsHTML;
}

function renderEvents() {
  const lowerQuery = searchQuery.toLowerCase();
  
  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    const matchesSearch = 
        event.title.toLowerCase().includes(lowerQuery) ||
        event.description.toLowerCase().includes(lowerQuery) ||
        event.location.toLowerCase().includes(lowerQuery) ||
        event.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
    
    return matchesCategory && matchesSearch;
  });

  if (filteredEvents.length === 0) {
    grid.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  grid.innerHTML = filteredEvents.map(event => `
    <div class="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-fuchsia-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-fuchsia-900/20 flex flex-col h-full">
      <button 
        onclick="event.preventDefault(); event.stopPropagation(); toggleFavorite(${event.id});" 
        data-event-id="${event.id}"
        class="favorite-btn absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-900/80 backdrop-blur-sm hover:bg-fuchsia-600/90 transition-all duration-200 text-slate-400 hover:text-red-500"
        title="Kedvencekhez adás"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </button>
      <a href="event-details.html?id=${event.id}" class="flex flex-col h-full cursor-pointer">
      <div class="relative h-56 w-full overflow-hidden">
        <img 
          src="${event.imageUrl}" 
          alt="${event.title}" 
          class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
        <div class="absolute bottom-3 left-3 right-3">
          <span class="inline-block px-2 py-1 bg-fuchsia-600/90 text-white text-xs font-bold rounded-md uppercase tracking-wider mb-2">
            ${event.category}
          </span>
          <h3 class="text-xl font-bold text-white leading-tight">${event.title}</h3>
        </div>
      </div>

      <div class="p-5 flex-1 flex flex-col">
        ${renderStars(event.rating || 0)}
        <div class="flex items-center text-slate-300 mb-2 text-sm">
          ${ICONS.calendar}
          <span>${event.date}</span>
          <span class="mx-2 text-slate-600">•</span>
          ${ICONS.clock}
          <span>${event.time}</span>
        </div>
        
        <div class="flex items-center text-slate-300 mb-4 text-sm">
          ${ICONS.mapPin}
          <span class="truncate">${event.location}</span>
        </div>

        <p class="text-slate-400 text-sm mb-4 line-clamp-3 flex-1 break-words overflow-hidden">
          ${event.description}
        </p>

        <div class="mt-auto">
          <div class="flex items-center">
            ${ICONS.user}
            <span class="text-xs text-slate-500">Szervező: ${event.organizer || 'Ismeretlen'}</span>
          </div>
        </div>
      </div>
      </a>
    </div>
  `).join('');
}

function renderMyEvents() {
  if (myEvents.length === 0) {
    myEventsGrid.innerHTML = '';
    myEventsEmpty.classList.remove('hidden');
    return;
  }

  myEventsEmpty.classList.add('hidden');
  myEventsGrid.innerHTML = myEvents.map(event => `
    <div class="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-fuchsia-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-fuchsia-900/20 flex flex-col h-full">
      <div class="relative h-56 w-full overflow-hidden">
        <img 
          src="${event.imageUrl}" 
          alt="${event.title}" 
          class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
        <div class="absolute bottom-3 left-3 right-3">
          <span class="inline-block px-2 py-1 bg-fuchsia-600/90 text-white text-xs font-bold rounded-md uppercase tracking-wider mb-2">
            ${event.category}
          </span>
          <h3 class="text-xl font-bold text-white leading-tight">${event.title}</h3>
        </div>
      </div>

      <div class="p-5 flex-1 flex flex-col">
        ${renderStars(event.rating || 0)}
        <div class="flex items-center text-slate-300 mb-2 text-sm">
          ${ICONS.calendar}
          <span>${event.date}</span>
          <span class="mx-2 text-slate-600">•</span>
          ${ICONS.clock}
          <span>${event.time}</span>
        </div>
        
        <div class="flex items-center text-slate-300 mb-4 text-sm">
          ${ICONS.mapPin}
          <span class="truncate">${event.location}</span>
        </div>

        <p class="text-slate-400 text-sm mb-4 line-clamp-3 flex-1 break-words overflow-hidden">
          ${event.description}
        </p>

        <div class="mt-auto">
          <div class="flex items-center mb-3">
            ${ICONS.user}
            <span class="text-xs text-slate-500">Szervező: ${event.organizer || 'Ismeretlen'}</span>
          </div>
          <div class="flex gap-2">
            <button 
              onclick="openEditModal(${event.id})"
              class="flex-1 inline-flex items-center justify-center px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              Szerkesztés
            </button>
            <button 
              onclick="deleteEventDirectly(${event.id})"
              class="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              Törlés
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderCategories() {
  const categories = ['All', ...Object.values(EventCategory)];
  
  categoryContainer.innerHTML = categories.map(cat => {
    const isActive = selectedCategory === cat;
    const label = cat === 'All' ? 'Összes' : cat;
    const classes = isActive 
      ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-900/30' 
      : 'bg-slate-800 text-slate-400 hover:bg-slate-700';
    
    return `
      <button
        onclick="setCategory('${cat}')"
        class="px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${classes}"
      >
        ${label}
      </button>
    `;
  }).join('');
}

function renderFavorites(favoriteEvents) {
  const favoritesGrid = document.getElementById('favorites-grid');
  const favoritesEmpty = document.getElementById('favorites-empty');
  
  if (favoriteEvents.length === 0) {
    favoritesGrid.innerHTML = '';
    favoritesEmpty.classList.remove('hidden');
    return;
  }

  favoritesEmpty.classList.add('hidden');
  favoritesGrid.innerHTML = favoriteEvents.map(event => `
    <div class="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-fuchsia-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-fuchsia-900/20 flex flex-col h-full">
      <button 
        onclick="event.preventDefault(); event.stopPropagation(); toggleFavorite(${event.id});" 
        class="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-900/80 backdrop-blur-sm hover:bg-red-600/90 transition-all duration-200 text-red-500"
        title="Eltávolítás a kedvencek közül"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </button>
      <a href="event-details.html?id=${event.id}" class="flex flex-col h-full cursor-pointer">
        <div class="relative h-56 w-full overflow-hidden">
          <img 
            src="${event.imageUrl}" 
            alt="${event.title}" 
            class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
          <div class="absolute bottom-3 left-3 right-3">
            <span class="inline-block px-2 py-1 bg-fuchsia-600/90 text-white text-xs font-bold rounded-md uppercase tracking-wider mb-2">
              ${event.category}
            </span>
            <h3 class="text-xl font-bold text-white leading-tight">${event.title}</h3>
          </div>
        </div>

        <div class="p-5 flex-1 flex flex-col">
          ${renderStars(event.rating || 0)}
          <div class="flex items-center text-slate-300 mb-2 text-sm">
            ${ICONS.calendar}
            <span>${event.date}</span>
            <span class="mx-2 text-slate-600">•</span>
            ${ICONS.clock}
            <span>${event.time}</span>
          </div>
          
          <div class="flex items-center text-slate-300 mb-4 text-sm">
            ${ICONS.mapPin}
            <span class="truncate">${event.location}</span>
          </div>

          <p class="text-slate-400 text-sm mb-4 line-clamp-3 flex-1 break-words overflow-hidden">
            ${event.description}
          </p>

          <div class="mt-auto">
            <div class="flex items-center">
              ${ICONS.user}
              <span class="text-xs text-slate-500">Szervező: ${event.organizer || 'Ismeretlen'}</span>
            </div>
          </div>
        </div>
      </a>
    </div>
  `).join('');
}
