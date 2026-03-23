let currentUser = null;
let favoriteEventIds = new Set();

function setCurrentUser(user) {
  currentUser = user;
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }
  updateAuthUI();
}

function updateAuthUI() {
  const authBtn = document.getElementById('auth-btn');
  const myEventsLink = document.getElementById('my-events-link');
  const favNavLink   = document.getElementById('favorites-nav-link');

  if (currentUser) {
    const initials = (currentUser.name || '?').substring(0, 2).toUpperCase();
    authBtn.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
             style="width:32px;height:32px;background:linear-gradient(135deg,#7c3aed,#d946ef);font-size:.75rem">${initials}</div>
        <span class="d-none d-md-inline" style="font-size:.85rem">${escapeHtml(currentUser.name)}</span>
        <i class="bi bi-chevron-down" style="font-size:.7rem"></i>
      </div>`;
    authBtn.onclick = toggleUserDropdown;
    myEventsLink && myEventsLink.classList.remove('hidden');
    favNavLink   && favNavLink.classList.remove('hidden');

    // Buli létrehozás gomb
    let fab = document.getElementById('create-event-fab');
    if (!fab) {
      fab = document.createElement('button');
      fab.id = 'create-event-fab';
      fab.className = 'btn btn-gradient rounded-circle shadow-lg position-fixed';
      fab.style.cssText = 'bottom:2rem;right:2rem;width:56px;height:56px;font-size:1.5rem;z-index:1000;display:flex;align-items:center;justify-content:center';
      fab.title = 'Új buli létrehozása';
      fab.innerHTML = '<i class="bi bi-plus-lg"></i>';
      fab.onclick = () => toggleModal(true);
      document.body.appendChild(fab);
    }
  } else {
    authBtn.innerHTML = '<i class="bi bi-person me-1"></i> Bejelentkezés';
    authBtn.onclick = () => toggleAuthModal(true);
    myEventsLink && myEventsLink.classList.add('hidden');
    favNavLink   && favNavLink.classList.add('hidden');
    document.getElementById('create-event-fab')?.remove();
  }
}

function toggleUserDropdown() {
  let dd = document.getElementById('user-dropdown');
  if (dd) { dd.remove(); return; }

  const authBtn = document.getElementById('auth-btn');
  dd = document.createElement('div');
  dd.id = 'user-dropdown';
  dd.className = 'user-dropdown';
  dd.innerHTML = `
    <button class="user-dropdown-btn" onclick="showMyEvents();document.getElementById('user-dropdown')?.remove()">
      <i class="bi bi-person-circle"></i> Saját eseményeim
    </button>
    <button class="user-dropdown-btn" onclick="showFavorites();document.getElementById('user-dropdown')?.remove()">
      <i class="bi bi-heart"></i> Kedvenceim
    </button>
    <hr style="border-color:#334155;margin:.25rem 0">
    <button class="user-dropdown-btn text-danger" onclick="handleLogout();document.getElementById('user-dropdown')?.remove()">
      <i class="bi bi-box-arrow-right"></i> Kijelentkezés
    </button>
  `;
  authBtn.parentElement.style.position = 'relative';
  authBtn.parentElement.appendChild(dd);

  setTimeout(() => {
    document.addEventListener('click', function handler(e) {
      if (!dd.contains(e.target) && e.target !== authBtn) {
        dd.remove();
        document.removeEventListener('click', handler);
      }
    });
  }, 50);
}

async function handleLogout() {
  await apiLogout();
  setCurrentUser(null);
  favoriteEventIds.clear();
  showAllEvents();
  showToast('Sikeresen kijelentkeztél', 'info');
}
