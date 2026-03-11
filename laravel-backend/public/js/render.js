function parseTags(tags) {
  const list = Array.isArray(tags) ? tags : (tags ? tags.split(',') : []);
  return list.map(t => t.trim()).filter(Boolean);
}

function renderEventCard(event, { isMine = false, isFav = false, currentUser = null } = {}) {
  const imgSrc = event.imageUrl || PLACEHOLDER_IMAGE;
  const cleanTags = parseTags(event.tags).slice(0, 3);
  const rating = parseFloat(event.rating) || 0;

  const favActive = isFav ? 'active' : '';
  const favIcon  = isFav ? 'bi-heart-fill' : 'bi-heart';

  const editBtn = isMine
    ? `<button class="btn btn-sm btn-outline-light edit-btn ms-auto" data-id="${event.id}" style="font-size:.75rem;padding:3px 10px"><i class="bi bi-pencil me-1"></i>Szerkesztés</button>`
    : '';

  const card = document.createElement('div');
  card.className = 'col';
  card.innerHTML = `
    <div class="event-card h-100" data-event-id="${event.id}">
      <div class="event-card-img">
        <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(event.title || '')}" loading="lazy"
             onerror="this.src='${PLACEHOLDER_IMAGE}'" />
        <div class="card-img-gradient"></div>
        <button class="favorite-btn ${favActive}" data-event-id="${event.id}" title="${isFav ? 'Eltávolítás a kedvencekből' : 'Kedvencekhez adás'}">
          <i class="bi ${favIcon}"></i>
        </button>
        <span class="position-absolute bottom-0 start-0 m-3 badge badge-cat px-3 py-2">${escapeHtml(event.category || 'Egyéb')}</span>
      </div>
      <div class="event-card-body">
        <div class="d-flex align-items-start justify-content-between gap-2 mb-2">
          <h5 class="text-white fw-bold mb-0 lh-sm" style="font-size:1.05rem">${escapeHtml(event.title || '')}</h5>
          ${rating > 0 ? `<span class="text-warning fw-bold small flex-shrink-0">⭐ ${rating.toFixed(1)}</span>` : ''}
        </div>
        <div class="d-flex align-items-center gap-1 text-secondary mb-1" style="font-size:.8rem">
          <i class="bi bi-geo-alt-fill" style="color:#d946ef"></i>
          <span>${escapeHtml(event.location || '')}</span>
        </div>
        <div class="d-flex align-items-center gap-3 text-secondary mb-3" style="font-size:.8rem">
          <span><i class="bi bi-calendar3 me-1"></i>${formatDate(event.date)}</span>
          <span><i class="bi bi-clock me-1"></i>${event.time ? event.time.substring(0,5) : ''}</span>
        </div>
        ${cleanTags.length ? `<div class="d-flex flex-wrap gap-1 mb-3">${cleanTags.map(t => `<span class="tag-pill">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
        <div class="d-flex align-items-center gap-2 mt-auto">
          <button class="btn btn-gradient btn-sm flex-grow-1 details-btn" data-id="${event.id}">
            <i class="bi bi-info-circle me-1"></i>Részletek
          </button>
          ${editBtn}
        </div>
      </div>
    </div>
  `;
  return card;
}

function renderOrganizerCard(user, eventCount) {
  const initials = (user.name || '?').substring(0, 2).toUpperCase();
  const card = document.createElement('div');
  card.className = 'col';
  card.innerHTML = `
    <div class="p-4 rounded-4 text-center" style="background:rgba(30,41,59,.5);border:1px solid rgba(71,85,105,.5)">
      <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white fs-5 mx-auto mb-3"
           style="width:56px;height:56px;background:linear-gradient(135deg,#7c3aed,#d946ef)">
        ${escapeHtml(initials)}
      </div>
      <p class="text-white fw-semibold mb-0 text-truncate">${escapeHtml(user.name || '')}</p>
      <p class="text-secondary small mb-2">${escapeHtml(user.email || '')}</p>
      <span class="badge rounded-pill" style="background:rgba(217,70,239,.2);color:#e879f9;border:1px solid rgba(217,70,239,.3)">
        <i class="bi bi-calendar-event me-1"></i>${eventCount} esemény
      </span>
    </div>
  `;
  return card;
}

function renderActivityItem(text, icon = 'bi-activity') {
  const div = document.createElement('div');
  div.className = 'd-flex align-items-center gap-3 p-3 rounded-3';
  div.style.cssText = 'background:rgba(30,41,59,.5);border:1px solid rgba(71,85,105,.3)';
  div.innerHTML = `
    <div class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
         style="width:36px;height:36px;background:rgba(217,70,239,.2)">
      <i class="bi ${icon}" style="color:#e879f9"></i>
    </div>
    <span class="text-secondary small">${text}</span>
  `;
  return div;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' });
  } catch { return dateStr; }
}

function escapeHtml(str) {
  if (typeof str !== 'string') return String(str ?? '');
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
