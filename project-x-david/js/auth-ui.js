// --- AUTH UI FUNCTIONS ---

function updateUIForUser() {
  const myEventsLink = document.getElementById('my-events-link');
  
  if (currentUser) {
    authBtn.innerHTML = `
      <span class="mr-2"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6"></path></svg></span>
      ${currentUser.name}
    `;
    
    const newAuthBtn = authBtn.cloneNode(true);
    authBtn.parentNode.replaceChild(newAuthBtn, authBtn);
    authBtn = newAuthBtn;
    
    authBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const hasMenu = document.getElementById('user-menu');
      if (hasMenu) {
        hasMenu.remove();
      } else {
        showUserMenu();
      }
    });
    
    if (myEventsLink) {
      myEventsLink.classList.remove('hidden');
    }
  } else {
    authBtn.innerHTML = `
      <span class="mr-2"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></span>
      Bejelentkezés
    `;
    
    const newAuthBtn = authBtn.cloneNode(true);
    authBtn.parentNode.replaceChild(newAuthBtn, authBtn);
    authBtn = newAuthBtn;
    
    authBtn.addEventListener('click', () => toggleAuthModal(true));
    
    if (myEventsLink) {
      myEventsLink.classList.add('hidden');
    }
    
    if (favoritesNavLink) {
      favoritesNavLink.classList.add('hidden');
    }
    
    console.log('ℹ Nincs bejelentkezve - kedvencek link elrejtve');
  }
}

function showUserMenu() {
  const menu = document.createElement('div');
  menu.id = 'user-menu';
  menu.className = 'absolute right-0 top-full mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50';
  menu.innerHTML = `
    <div class="p-3 border-b border-slate-700">
      <p class="text-white font-semibold">${currentUser.name}</p>
      <p class="text-slate-400 text-sm">${currentUser.email}</p>
    </div>
    <button id="create-event-menu-btn" class="w-full text-left px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      Buli létrehozása
    </button>
    <button id="my-events-menu-btn" class="w-full text-left px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
      Saját események
    </button>
    <button id="favorites-menu-btn" class="w-full text-left px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      Kedvencek
    </button>
    <button id="logout-btn" class="w-full text-left px-4 py-3 text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
      Kijelentkezés
    </button>
  `;
  
  authBtn.parentElement.style.position = 'relative';
  authBtn.parentElement.appendChild(menu);
  
  document.getElementById('create-event-menu-btn').addEventListener('click', () => {
    menu.remove();
    toggleModal(true);
  });
  
  document.getElementById('my-events-menu-btn').addEventListener('click', () => {
    menu.remove();
    showMyEvents();
  });
  
  document.getElementById('favorites-menu-btn').addEventListener('click', () => {
    menu.remove();
    showFavorites();
  });
  
  document.getElementById('logout-btn').addEventListener('click', async () => {
    menu.remove();
    const result = await logoutUser();
    if (result.success) {
      // Toast megjelenítése ELŐSZÖR
      if (typeof window.showToast === 'function') {
        window.showToast('Sikeresen kijelentkeztél!', 'success');
      } else {
        alert('Sikeresen kijelentkeztél!');
      }
      
      currentUser = null;
      favoriteEventIds.clear();
      favoriteEvents = [];
      updateAllFavoriteButtons();
      showAllEvents();
      updateUIForUser();
    }
  });
  
  setTimeout(() => {
    document.addEventListener('click', function closeMenu(e) {
      if (!menu.contains(e.target) && e.target !== authBtn) {
        menu.remove();
        document.removeEventListener('click', closeMenu);
      }
    });
  }, 100);
}
