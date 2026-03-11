<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Esemény részletei - Project X</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
  <style>
    body { background: #0f172a; color: #e2e8f0; min-height: 100vh; display: flex; flex-direction: column; }
    .navbar-custom { background: rgba(15,23,42,.85); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,.08); }
    .logo-icon { background: linear-gradient(135deg,#7c3aed,#d946ef); border-radius: 8px; padding: 6px 8px; }
    .logo-text { background: linear-gradient(90deg,#a78bfa,#e879f9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 900; font-size: 1.3rem; letter-spacing: -.04em; }
    .btn-gradient { background: linear-gradient(90deg,#7c3aed,#d946ef) !important; color: #fff !important; border: none !important; }
    .btn-gradient:hover { background: linear-gradient(90deg,#6d28d9,#c026d3) !important; }
    .tag-pill { background: rgba(217,70,239,.12); border: 1px solid rgba(217,70,239,.3); color: #e879f9; font-size: .8rem; border-radius: 20px; padding: 4px 14px; }
    .badge-cat { font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; background: rgba(217,70,239,.85) !important; color: #fff !important; border-radius: 6px; }
    .loading-skeleton { background: linear-gradient(90deg,#1e293b 25%,#334155 50%,#1e293b 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
    @keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
  </style>
</head>
<body>

<!-- Navbar -->
<nav class="navbar-custom sticky-top py-2 px-3 px-md-4">
  <div class="container-xl d-flex align-items-center">
    <a href="/" class="d-flex align-items-center gap-2 text-decoration-none">
      <div class="logo-icon"><i class="bi bi-lightning-fill text-white fs-5"></i></div>
      <span class="logo-text">PROJECT X</span>
    </a>
    <a href="/" class="ms-auto btn btn-outline-secondary btn-sm">
      <i class="bi bi-arrow-left me-1"></i> Vissza
    </a>
  </div>
</nav>

<!-- Loading -->
<div id="loading-state" class="flex-grow-1 d-flex align-items-center justify-content-center">
  <div class="text-center">
    <div class="spinner-border mb-3" style="color:#d946ef;width:3rem;height:3rem" role="status"></div>
    <p class="text-secondary">Betöltés...</p>
  </div>
</div>

<!-- Error-->
<div id="error-state" class="hidden flex-grow-1 d-flex align-items-center justify-content-center">
  <div class="text-center">
    <i class="bi bi-exclamation-triangle display-3 text-secondary d-block mb-3"></i>
    <h4 class="text-white mb-2">Esemény nem található</h4>
    <p class="text-secondary mb-4">Ez az esemény már nem elérhető, vagy nem létezik.</p>
    <a href="/" class="btn btn-gradient px-4">Vissza a főoldalra</a>
  </div>
</div>

<!-- Content -->
<main id="event-content" class="hidden flex-grow-1 container-xl px-3 px-md-4 py-5">
  <div class="row g-5">
    <div class="col-lg-7">
      <div class="position-relative rounded-4 overflow-hidden border border-secondary mb-4" style="max-height:450px">
        <img id="detail-image" src="" alt="" class="w-100" style="object-fit:cover;max-height:450px" />
        <span id="detail-category" class="position-absolute top-0 end-0 m-3 badge badge-cat px-3 py-2"></span>
      </div>
      <div class="p-4 rounded-4 border border-secondary border-opacity-25 mb-4" style="background:rgba(30,41,59,.5)">
        <h5 class="text-white fw-bold mb-3"><i class="bi bi-file-text me-2" style="color:#d946ef"></i>Leírás</h5>
        <p id="detail-description" class="text-secondary lh-lg mb-0"></p>
      </div>
      <div id="tags-container" class="hidden mb-4">
        <h6 class="text-secondary mb-2"><i class="bi bi-tags me-1" style="color:#d946ef"></i>Címkék</h6>
        <div id="detail-tags" class="d-flex flex-wrap gap-2"></div>
      </div>
    </div>
    <div class="col-lg-5">
      <div class="sticky-top" style="top:5rem">
        <div class="d-flex align-items-start justify-content-between gap-2 mb-3">
          <h1 id="detail-title" class="h2 text-white fw-bold mb-0"></h1>
          <div id="detail-rating" class="text-warning fw-bold white-space-nowrap"></div>
        </div>
        <p id="detail-organizer" class="text-secondary mb-4"><i class="bi bi-person me-1" style="color:#d946ef"></i>Szervező: <span class="text-white fw-semibold"></span></p>
        <div class="d-flex flex-column gap-3 mb-4">
          <div class="d-flex align-items-center gap-3 p-3 rounded-3" style="background:rgba(124,58,237,.15);border:1px solid rgba(124,58,237,.3)">
            <i class="bi bi-calendar3 fs-5 flex-shrink-0" style="color:#a78bfa"></i>
            <div><div class="text-muted small">Dátum</div><div id="detail-date" class="text-white fw-bold"></div></div>
          </div>
          <div class="d-flex align-items-center gap-3 p-3 rounded-3" style="background:rgba(217,70,239,.15);border:1px solid rgba(217,70,239,.3)">
            <i class="bi bi-clock fs-5 flex-shrink-0" style="color:#e879f9"></i>
            <div><div class="text-muted small">Időpont</div><div id="detail-time" class="text-white fw-bold"></div></div>
          </div>
          <div class="d-flex align-items-center gap-3 p-3 rounded-3" style="background:rgba(236,72,153,.15);border:1px solid rgba(236,72,153,.3)">
            <i class="bi bi-geo-alt fs-5 flex-shrink-0" style="color:#f9a8d4"></i>
            <div><div class="text-muted small">Helyszín</div><div id="detail-location" class="text-white fw-bold"></div></div>
          </div>
          <div class="d-flex align-items-center gap-3 p-3 rounded-3" style="background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.3)">
            <i class="bi bi-ticket-perforated fs-5 flex-shrink-0" style="color:#6ee7b7"></i>
            <div><div class="text-muted small">Belépő</div><div id="detail-price" class="text-white fw-bold">Ingyenes</div></div>
          </div>
          <div id="contact-row" class="hidden d-flex align-items-center gap-3 p-3 rounded-3" style="background:rgba(6,182,212,.15);border:1px solid rgba(6,182,212,.3)">
            <i class="bi bi-telephone fs-5 flex-shrink-0" style="color:#67e8f9"></i>
            <div><div class="text-muted small">Kapcsolat</div><div id="detail-contact" class="text-white fw-bold"></div></div>
          </div>
        </div>
        <button type="button" id="share-btn" class="btn btn-gradient w-100 py-3 fw-semibold">
          <i class="bi bi-share me-2"></i> Esemény Megosztása
        </button>
      </div>
    </div>
  </div>
</main>

<footer class="py-4 mt-auto" style="background:#0f172a;border-top:1px solid #1e293b">
  <div class="container-xl text-center">
    <p class="text-muted small mb-0">© 2026 Project X. Minden jog fenntartva.</p>
  </div>
</footer>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', async () => {
    const segments = window.location.pathname.split('/');
    const eventId = segments[segments.length - 1];

    if (!eventId || isNaN(Number(eventId))) {
      showError(); return;
    }

    try {
      const res = await fetch(`/api/events/${eventId}`);
      if (!res.ok) { showError(); return; }
      const data = await res.json();
      if (!data.success || !data.event) { showError(); return; }
      renderEvent(data.event);
    } catch (e) {
      showError();
    }
  });

  function showError() {
    document.getElementById('loading-state').classList.add('hidden');
    document.getElementById('error-state').classList.remove('hidden');
  }

  function renderEvent(ev) {
    document.title = `${ev.title || 'Esemény'} - Project X`;

    const img = document.getElementById('detail-image');
    if (ev.imageUrl) { img.src = ev.imageUrl; img.alt = ev.title || ''; }
    else img.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format';

    document.getElementById('detail-category').textContent = ev.category || 'Egyéb';
    document.getElementById('detail-title').textContent = ev.title || '';

    const ratingEl = document.getElementById('detail-rating');
    if (ev.rating && parseFloat(ev.rating) > 0) {
      ratingEl.textContent = `⭐ ${parseFloat(ev.rating).toFixed(1)}`;
    }

    const orgEl = document.getElementById('detail-organizer');
    orgEl.querySelector('span').textContent = ev.organizer || 'Ismeretlen';

    if (ev.date) {
      const d = new Date(ev.date);
      document.getElementById('detail-date').textContent = d.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    document.getElementById('detail-time').textContent = ev.time ? ev.time.substring(0, 5) : 'Nincs megadva';
    document.getElementById('detail-location').textContent = ev.location || 'Helyszín TBD';
    document.getElementById('detail-price').textContent = ev.price || 'Ingyenes';
    document.getElementById('detail-description').textContent = ev.description || 'Nincs leírás.';

    if (ev.contact_phone) {
      document.getElementById('detail-contact').textContent = ev.contact_phone;
      document.getElementById('contact-row').classList.remove('hidden');
    }

    const tags = Array.isArray(ev.tags) ? ev.tags : (ev.tags ? ev.tags.split(',') : []);
    const cleanTags = tags.map(t => t.trim()).filter(Boolean);
    if (cleanTags.length) {
      const tagsContainer = document.getElementById('tags-container');
      tagsContainer.classList.remove('hidden');
      const tagsEl = document.getElementById('detail-tags');
      tagsEl.innerHTML = cleanTags.map(t => `<span class="tag-pill">${t}</span>`).join('');
    }

    document.getElementById('share-btn').addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({ title: ev.title, url: window.location.href });
      } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
          const btn = document.getElementById('share-btn');
          const orig = btn.innerHTML;
          btn.innerHTML = '<i class="bi bi-check me-2"></i> Link másolva!';
          setTimeout(() => { btn.innerHTML = orig; }, 2000);
        });
      }
    });

    document.getElementById('loading-state').classList.add('hidden');
    document.getElementById('event-content').classList.remove('hidden');
  }

  // utility
  HTMLElement.prototype.classList.has = HTMLElement.prototype.classList.contains;
  const _hidden = 'hidden';
  Node.prototype.addHidden = function() { this.classList.add(_hidden); };
  Node.prototype.removeHidden = function() { this.classList.remove(_hidden); };
</script>
</body>
</html>
