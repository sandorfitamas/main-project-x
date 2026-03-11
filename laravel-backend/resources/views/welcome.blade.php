<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Project X - Találd meg a legjobb bulit</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
  <style>
    body { background: #0f172a; color: #e2e8f0; min-height: 100vh; display: flex; flex-direction: column; }
    .navbar-custom { background: rgba(15,23,42,.85); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,.08); }
    .logo-icon { background: linear-gradient(135deg,#7c3aed,#d946ef); border-radius: 8px; padding: 6px 8px; }
    .logo-text { background: linear-gradient(90deg,#a78bfa,#e879f9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 900; font-size: 1.3rem; letter-spacing: -.04em; }
    .btn-gradient { background: linear-gradient(90deg,#7c3aed,#d946ef) !important; color: #fff !important; border: none !important; }
    .btn-gradient:hover { background: linear-gradient(90deg,#6d28d9,#c026d3) !important; }
    .hero { position: relative; overflow: hidden; }
    .hero-bg { position: absolute; inset: 0; background: url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2074&q=80') center/cover; opacity: .2; }
    .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top,#0f172a,rgba(15,23,42,.5) 50%,transparent); }
    .hero-title { font-size: clamp(2rem,6vw,4.5rem); font-weight: 900; letter-spacing: -.04em; }
    .hero-accent { background: linear-gradient(90deg,#a855f7,#ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .search-box { background: rgba(30,41,59,.8) !important; border: 1px solid #334155 !important; color: #e2e8f0 !important; border-radius: 12px !important; }
    .search-box:focus { background: #1e293b !important; border-color: #d946ef !important; box-shadow: 0 0 0 .2rem rgba(217,70,239,.25) !important; }
    .search-box::placeholder { color: #94a3b8; }
    .event-card { background: rgba(30,41,59,.5); border: 1px solid rgba(71,85,105,.5); border-radius: 16px; overflow: hidden; transition: all .3s; display: flex; flex-direction: column; height: 100%; }
    .event-card:hover { border-color: rgba(217,70,239,.5); box-shadow: 0 20px 40px rgba(139,92,246,.15); }
    .event-card-img { height: 220px; overflow: hidden; position: relative; }
    .event-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s; }
    .event-card:hover .event-card-img img { transform: scale(1.07); }
    .card-img-gradient { position: absolute; inset: 0; background: linear-gradient(to top,#0f172a 0%,transparent 60%); }
    .badge-cat { font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; background: rgba(217,70,239,.85) !important; color: #fff !important; border-radius: 6px; }
    .event-card-body { background: rgba(30,41,59,.5); padding: 1.25rem; flex: 1; display: flex; flex-direction: column; }
    .tag-pill { background: rgba(217,70,239,.12); border: 1px solid rgba(217,70,239,.3); color: #e879f9; font-size: .7rem; border-radius: 20px; padding: 2px 10px; }
    .filter-btn { background: #1e293b; color: #94a3b8; border: none; border-radius: 20px; padding: 6px 16px; font-size: .85rem; transition: all .2s; cursor: pointer; }
    .filter-btn.active, .filter-btn:hover { background: #d946ef; color: #fff; }
    .modal-dark .modal-content { background: #0f172a; border: 1px solid #334155; color: #e2e8f0; border-radius: 16px; }
    .modal-dark .modal-header { border-bottom: 1px solid #1e293b; }
    .modal-dark .modal-footer { border-top: 1px solid #1e293b; }
    .form-dark { background: #1e293b !important; border: 1px solid #334155 !important; color: #e2e8f0 !important; border-radius: 8px !important; }
    .form-dark:focus { background: #1e293b !important; border-color: #a855f7 !important; box-shadow: 0 0 0 .2rem rgba(168,85,247,.25) !important; color: #e2e8f0 !important; }
    .form-dark::placeholder { color: #64748b; }
    .form-dark option { background: #1e293b; }
    .stat-card { border-radius: 16px; padding: 1.5rem; }
    .stat-violet { background: linear-gradient(135deg,rgba(124,58,237,.2),rgba(124,58,237,.05)); border: 1px solid rgba(124,58,237,.3); }
    .stat-fuchsia { background: linear-gradient(135deg,rgba(217,70,239,.2),rgba(217,70,239,.05)); border: 1px solid rgba(217,70,239,.3); }
    .stat-pink { background: linear-gradient(135deg,rgba(236,72,153,.2),rgba(236,72,153,.05)); border: 1px solid rgba(236,72,153,.3); }
    .upload-area { border: 2px dashed #334155; border-radius: 10px; cursor: pointer; background: rgba(30,41,59,.5); transition: background .2s; }
    .upload-area:hover { background: #1e293b; }
    .toast-wrap { position: fixed; top: 5rem; right: 1rem; z-index: 9999; display: flex; flex-direction: column; gap: .75rem; min-width: 320px; }
    .toast-item { border-radius: 10px; padding: .85rem 1rem; box-shadow: 0 8px 24px rgba(0,0,0,.4); display: flex; align-items: flex-start; gap: .75rem; }
    .toast-success { background: linear-gradient(90deg,#16a34a,#059669); border-left: 4px solid #22c55e; }
    .toast-error { background: linear-gradient(90deg,#dc2626,#e11d48); border-left: 4px solid #f87171; }
    .toast-warning { background: linear-gradient(90deg,#d97706,#ea580c); border-left: 4px solid #fbbf24; }
    .toast-info { background: linear-gradient(90deg,#7c3aed,#d946ef); border-left: 4px solid #a78bfa; }
    .hidden { display: none !important; }
    .nav-link-dark { color: #94a3b8 !important; text-decoration: none !important; font-size: .875rem; font-weight: 500; transition: color .2s; }
    .nav-link-dark:hover { color: #fff !important; }
    .user-dropdown { position: absolute; right: 0; top: calc(100% + 8px); min-width: 220px; background: #1e293b; border: 1px solid #334155; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,.4); z-index: 1050; overflow: hidden; }
    .user-dropdown-btn { width: 100%; text-align: left; padding: .75rem 1rem; background: transparent; border: none; color: #cbd5e1; transition: background .15s; cursor: pointer; display: flex; align-items: center; gap: .75rem; }
    .user-dropdown-btn:hover { background: rgba(255,255,255,.05); color: #fff; }
    .favorite-btn { position: absolute; top: .75rem; right: .75rem; z-index: 10; background: rgba(15,23,42,.8); border: none; border-radius: 50%; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); transition: all .2s; color: #94a3b8; cursor: pointer; }
    .favorite-btn:hover, .favorite-btn.active { background: rgba(220,38,38,.8); color: #fca5a5; }
    .favorite-btn.active i { color: #ef4444; }
    footer { background: #0f172a; border-top: 1px solid #1e293b; }
  </style>
</head>
<body>

<div class="toast-wrap" id="toast-container"></div>

<!-- Navbar -->
<nav class="navbar-custom sticky-top py-2 px-3 px-md-4">
  <div class="container-xl d-flex align-items-center justify-content-between">
    <div class="d-flex align-items-center gap-2">
      <div class="logo-icon"><i class="bi bi-lightning-fill text-white fs-5"></i></div>
      <span class="logo-text">PROJECT X</span>
    </div>
    <div class="d-none d-md-flex align-items-center gap-4">
      <a href="#" onclick="showAllEvents();return false;" class="nav-link-dark">Kezdőlap</a>
      <a href="#" onclick="showAllEvents();return false;" class="nav-link-dark">Események</a>
      <a href="#" onclick="showCommunity();return false;" class="nav-link-dark">Közösség</a>
      <a href="#" id="my-events-link" onclick="showMyEvents();return false;" class="nav-link-dark hidden">Saját eseményeim</a>
      <a href="#" id="favorites-nav-link" onclick="showFavorites();return false;" class="nav-link-dark hidden">
        <i class="bi bi-heart-fill text-danger me-1"></i>Kedvencek
      </a>
    </div>
    <div class="position-relative">
      <button id="auth-btn" class="btn btn-gradient btn-sm px-3 py-2 fw-semibold">
        <i class="bi bi-person me-1"></i> Bejelentkezés
      </button>
    </div>
  </div>
</nav>

<!-- Hero -->
<div class="hero py-5 mb-0">
  <div class="hero-bg"></div>
  <div class="hero-overlay"></div>
  <div class="container-xl position-relative text-center py-5">
    <h1 class="hero-title text-white mb-3">
      Találd meg a ma esti<br>
      <span class="hero-accent">VIBE-ot</span>
    </h1>
    <p class="text-secondary fs-5 mb-4 mx-auto" style="max-width:600px">
      A Project X a legjobb hely, hogy megtaláld a környék legvadabb bulijait, vagy megszervezd a sajátodat.
    </p>
    <div class="mx-auto" style="max-width:600px">
      <div class="position-relative">
        <i class="bi bi-search position-absolute" style="left:14px;top:50%;transform:translateY(-50%);color:#94a3b8;z-index:5"></i>
        <input id="search-input" type="text" class="form-control search-box py-3 ps-5" placeholder="Keress eseményt, helyszínt vagy hangulatot...">
      </div>
    </div>
  </div>
</div>

<!-- Events Section -->
<main class="flex-grow-1 container-xl px-3 px-md-4 py-5" id="events-section">
  <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
    <h2 class="h4 fw-bold mb-0">
      <i class="bi bi-funnel-fill me-2" style="color:#d946ef"></i>Közelgő Események
    </h2>
    <div class="d-flex gap-2 flex-wrap" id="category-filters"></div>
  </div>
  <div id="events-grid" class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4"></div>
  <div id="empty-state" class="hidden text-center py-5 rounded-4 border border-secondary border-opacity-25 mt-4">
    <p class="text-secondary fs-5 mb-1">Nem találtunk ilyen bulit...</p>
    <p class="text-muted small">Próbálj más keresőszót, vagy szervezz te egyet!</p>
  </div>
</main>

<!-- My Events -->
<section id="my-events-section" class="hidden flex-grow-1 container-xl px-3 px-md-4 py-5">
  <div class="mb-4">
    <h2 class="h3 fw-bold mb-1"><i class="bi bi-person-fill me-2" style="color:#d946ef"></i>Saját események</h2>
    <p class="text-secondary small">Itt láthatod és szerkesztheted az általad létrehozott eseményeket</p>
  </div>
  <div id="my-events-grid" class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4"></div>
  <div id="my-events-empty" class="hidden text-center py-5 rounded-4 border border-secondary border-opacity-25 mt-3">
    <p class="text-secondary fs-5 mb-1">Még nincs eseményed</p>
    <p class="text-muted small mb-3">Hozz létre az első bulidat!</p>
    <button onclick="toggleModal(true)" class="btn btn-gradient px-4 py-2 fw-semibold">
      <i class="bi bi-plus-lg me-1"></i> Új buli létrehozása
    </button>
  </div>
</section>

<!-- Favorites -->
<section id="favorites-section" class="hidden flex-grow-1 container-xl px-3 px-md-4 py-5">
  <div class="mb-4">
    <h2 class="h3 fw-bold mb-1"><i class="bi bi-heart-fill text-danger me-2"></i>Kedvenc események</h2>
    <p class="text-secondary small">A kedvenceid közé mentett események</p>
  </div>
  <div id="favorites-grid" class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4"></div>
  <div id="favorites-empty" class="hidden text-center py-5 rounded-4 border border-secondary border-opacity-25 mt-3">
    <i class="bi bi-heart display-3 text-secondary d-block mb-3"></i>
    <p class="text-secondary fs-5 mb-1">Még nincs kedvenc eseményed</p>
    <p class="text-muted small mb-3">Az események melletti szív ikonra kattintva adhatsz hozzá kedvenceket</p>
    <button onclick="showAllEvents()" class="btn btn-gradient px-4 py-2 fw-semibold">Események böngészése</button>
  </div>
</section>

<!-- Community -->
<section id="community-section" class="hidden flex-grow-1 container-xl px-3 px-md-4 py-5">
  <div class="mb-4">
    <h2 class="h3 fw-bold mb-1"><i class="bi bi-people-fill me-2" style="color:#d946ef"></i>Közösség</h2>
    <p class="text-secondary small">Fedezd fel a buliközösség tagjait és aktivitását</p>
  </div>
  <div class="row g-4 mb-5">
    <div class="col-md-4"><div class="stat-card stat-violet"><div class="d-flex align-items-center justify-content-between"><div><p class="text-secondary small mb-1">Aktív tagok</p><p class="h3 fw-bold text-white mb-0" id="total-users">0</p></div><div class="rounded-3 p-2" style="background:rgba(124,58,237,.3)"><i class="bi bi-people-fill fs-3" style="color:#a78bfa"></i></div></div></div></div>
    <div class="col-md-4"><div class="stat-card stat-fuchsia"><div class="d-flex align-items-center justify-content-between"><div><p class="text-secondary small mb-1">Összes esemény</p><p class="h3 fw-bold text-white mb-0" id="total-events">0</p></div><div class="rounded-3 p-2" style="background:rgba(217,70,239,.3)"><i class="bi bi-calendar-event-fill fs-3" style="color:#e879f9"></i></div></div></div></div>
    <div class="col-md-4"><div class="stat-card stat-pink"><div class="d-flex align-items-center justify-content-between"><div><p class="text-secondary small mb-1">Közösségi aktivitás</p><p class="h3 fw-bold text-white mb-0">🔥</p></div><div class="rounded-3 p-2" style="background:rgba(236,72,153,.3)"><i class="bi bi-lightning-fill fs-3" style="color:#f9a8d4"></i></div></div></div></div>
  </div>
  <h5 class="fw-bold mb-3"><i class="bi bi-star-fill text-warning me-2"></i>Legjobb szervezők</h5>
  <div id="top-organizers-grid" class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4 mb-5"></div>
  <div id="organizers-empty" class="hidden text-center py-4 rounded-3 border border-secondary border-opacity-25 mb-5"><p class="text-secondary">Még nincs szervező a közösségben</p></div>
  <h5 class="fw-bold mb-3"><i class="bi bi-activity me-2" style="color:#d946ef"></i>Közösségi aktivitás</h5>
  <div id="activity-feed" class="d-flex flex-column gap-3"></div>
  <div id="activity-empty" class="hidden text-center py-4 rounded-3 border border-secondary border-opacity-25"><p class="text-secondary">Még nincs aktivitás</p></div>
</section>

<!-- Footer -->
<footer class="py-4 mt-auto">
  <div class="container-xl text-center">
    <div class="d-flex align-items-center justify-content-center gap-2 mb-2">
      <i class="bi bi-lightning-fill" style="color:#d946ef"></i>
      <span class="fw-bold text-white">PROJECT X</span>
    </div>
    <p class="text-muted small mb-0">© 2026 Project X. Minden jog fenntartva.</p>
  </div>
</footer>

<!-- Auth Modal -->
<div class="modal fade" id="auth-modal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content modal-dark">
      <div class="modal-header border-0 pb-0">
        <h5 class="modal-title fw-bold" id="auth-modal-title" style="background:linear-gradient(90deg,#a78bfa,#e879f9);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Bejelentkezés</h5>
        <button type="button" class="btn-close btn-close-white" id="close-auth-modal-btn"></button>
      </div>
      <div class="modal-body p-4">
        <form id="login-form">
          <div class="mb-3">
            <label class="form-label text-secondary small">Email</label>
            <input type="email" id="login-email" class="form-control form-dark" placeholder="pelda@email.com" required />
          </div>
          <div class="mb-3">
            <label class="form-label text-secondary small">Jelszó</label>
            <input type="password" id="login-password" class="form-control form-dark" placeholder="••••••••" required />
          </div>
          <button type="submit" class="btn btn-gradient w-100 py-2 fw-semibold">Bejelentkezés</button>
        </form>
        <form id="register-form" class="hidden">
          <div class="mb-3">
            <label class="form-label text-secondary small">Név</label>
            <input type="text" id="register-name" class="form-control form-dark" placeholder="Teljes neved" required />
          </div>
          <div class="mb-3">
            <label class="form-label text-secondary small">Email</label>
            <input type="email" id="register-email" class="form-control form-dark" placeholder="pelda@email.com" required />
          </div>
          <div class="mb-3">
            <label class="form-label text-secondary small">Jelszó</label>
            <input type="password" id="register-password" class="form-control form-dark" placeholder="••••••••" required />
          </div>
          <div class="mb-3">
            <label class="form-label text-secondary small">Jelszó megerősítése</label>
            <input type="password" id="register-password-confirm" class="form-control form-dark" placeholder="••••••••" required />
          </div>
          <button type="submit" class="btn btn-gradient w-100 py-2 fw-semibold">Fiók létrehozása</button>
        </form>
        <div class="text-center mt-3">
          <span id="auth-toggle-text" class="text-secondary small">Nincs még fiókod?</span>
          <button type="button" id="auth-toggle-btn" class="btn btn-link btn-sm p-0 ms-1 fw-semibold" style="color:#e879f9;text-decoration:none">Regisztrálj most</button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Create Event Modal -->
<div class="modal fade" id="create-event-modal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
    <div class="modal-content modal-dark">
      <div class="modal-header border-0 pb-0">
        <h5 class="modal-title fw-bold" style="background:linear-gradient(90deg,#a78bfa,#e879f9);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Új Buli Létrehozása</h5>
        <button type="button" class="btn-close btn-close-white" id="close-modal-btn"></button>
      </div>
      <div class="modal-body p-4">
        <form id="create-event-form">
          <div class="mb-3">
            <label class="form-label text-secondary small">Esemény Címe *</label>
            <input type="text" name="title" class="form-control form-dark" placeholder="pl. Tetőterasz Nyitó" required />
          </div>
          <div class="row mb-3">
            <div class="col-6"><label class="form-label text-secondary small">Dátum *</label><input type="date" name="date" class="form-control form-dark" required /></div>
            <div class="col-6"><label class="form-label text-secondary small">Idő *</label><input type="time" name="time" class="form-control form-dark" required /></div>
          </div>
          <div class="mb-3">
            <label class="form-label text-secondary small">Helyszín *</label>
            <input type="text" name="location" class="form-control form-dark" placeholder="pl. Budapest, Deák tér" required />
          </div>
          <div class="mb-3">
            <label class="form-label text-secondary small">Szervező</label>
            <input type="text" name="organizer" class="form-control form-dark" placeholder="A te neved" />
          </div>
          <div class="row mb-3">
            <div class="col-6"><label class="form-label text-secondary small">Értékelés</label>
              <select name="rating" class="form-select form-dark">
                <option value="0">Nincs értékelés</option><option value="1">⭐ 1</option><option value="1.5">⭐ 1.5</option><option value="2">⭐⭐ 2</option><option value="2.5">⭐⭐ 2.5</option><option value="3">⭐⭐⭐ 3</option><option value="3.5">⭐⭐⭐ 3.5</option><option value="4">⭐⭐⭐⭐ 4</option><option value="4.5">⭐⭐⭐⭐ 4.5</option><option value="5">⭐⭐⭐⭐⭐ 5</option>
              </select>
            </div>
            <div class="col-6"><label class="form-label text-secondary small">Kategória</label>
              <select name="category" class="form-select form-dark">
                <option value="Házibuli">Házibuli</option><option value="Klub">Klub</option><option value="Fesztivál">Fesztivál</option><option value="Rave">Rave</option><option value="Chill">Chill</option><option value="Egyéb">Egyéb</option>
              </select>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label text-secondary small">Leírás</label>
            <textarea name="description" rows="3" class="form-control form-dark" placeholder="Írd le az esemény részleteit..."></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label text-secondary small d-block mb-2">Esemény képe</label>
            <label for="event-image" class="upload-area d-flex flex-column align-items-center justify-content-center w-100 py-4" style="cursor:pointer">
              <div id="image-upload-label" class="text-center">
                <i class="bi bi-cloud-upload fs-2 text-secondary d-block mb-2"></i>
                <span class="text-secondary small">Kattints a feltöltéshez</span>
                <span class="text-muted d-block" style="font-size:.75rem">PNG, JPG, GIF (max. 5MB)</span>
              </div>
              <input id="event-image" type="file" name="image" accept="image/*" class="d-none" />
            </label>
            <div id="image-preview-container" class="hidden mt-2 position-relative rounded-3 overflow-hidden border border-secondary">
              <img id="image-preview" src="" alt="Preview" class="w-100" style="height:180px;object-fit:cover" />
              <button type="button" id="remove-image-btn" class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle p-1" style="width:30px;height:30px;display:flex;align-items:center;justify-content:center">
                <i class="bi bi-x" style="font-size:.8rem"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer border-0">
        <button type="button" id="cancel-modal-btn" class="btn btn-outline-secondary">Mégse</button>
        <button type="submit" form="create-event-form" class="btn btn-gradient px-4 fw-semibold">Buli Közzététele</button>
      </div>
    </div>
  </div>
</div>

<!-- Edit Event Modal -->
<div class="modal fade" id="edit-event-modal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
    <div class="modal-content modal-dark">
      <div class="modal-header border-0 pb-0">
        <h5 class="modal-title fw-bold" style="background:linear-gradient(90deg,#a78bfa,#e879f9);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Esemény szerkesztése</h5>
        <button type="button" class="btn-close btn-close-white" id="close-edit-modal-btn"></button>
      </div>
      <div class="modal-body p-4">
        <form id="edit-event-form">
          <input type="hidden" id="edit-event-id" name="id" />
          <div class="mb-3">
            <label class="form-label text-secondary small">Esemény Címe *</label>
            <input type="text" name="title" id="edit-event-title" class="form-control form-dark" required />
          </div>
          <div class="row mb-3">
            <div class="col-6"><label class="form-label text-secondary small">Dátum *</label><input type="date" name="date" id="edit-event-date" class="form-control form-dark" required /></div>
            <div class="col-6"><label class="form-label text-secondary small">Idő *</label><input type="time" name="time" id="edit-event-time" class="form-control form-dark" required /></div>
          </div>
          <div class="mb-3">
            <label class="form-label text-secondary small">Helyszín *</label>
            <input type="text" name="location" id="edit-event-location" class="form-control form-dark" required />
          </div>
          <div class="mb-3">
            <label class="form-label text-secondary small">Szervező</label>
            <input type="text" name="organizer" id="edit-event-organizer" class="form-control form-dark" />
          </div>
          <div class="row mb-3">
            <div class="col-6"><label class="form-label text-secondary small">Értékelés</label>
              <select name="rating" id="edit-event-rating" class="form-select form-dark">
                <option value="0">Nincs értékelés</option><option value="1">⭐ 1</option><option value="1.5">⭐ 1.5</option><option value="2">⭐⭐ 2</option><option value="2.5">⭐⭐ 2.5</option><option value="3">⭐⭐⭐ 3</option><option value="3.5">⭐⭐⭐ 3.5</option><option value="4">⭐⭐⭐⭐ 4</option><option value="4.5">⭐⭐⭐⭐ 4.5</option><option value="5">⭐⭐⭐⭐⭐ 5</option>
              </select>
            </div>
            <div class="col-6"><label class="form-label text-secondary small">Kategória</label>
              <select name="category" id="edit-event-category" class="form-select form-dark">
                <option value="Házibuli">Házibuli</option><option value="Klub">Klub</option><option value="Fesztivál">Fesztivál</option><option value="Rave">Rave</option><option value="Chill">Chill</option><option value="Egyéb">Egyéb</option>
              </select>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label text-secondary small">Leírás</label>
            <textarea name="description" id="edit-event-description" rows="3" class="form-control form-dark"></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label text-secondary small d-block mb-2">Esemény képe</label>
            <div id="edit-current-image" class="hidden mb-2">
              <p class="text-secondary small mb-1">Jelenlegi kép:</p>
              <img id="edit-current-image-preview" src="" alt="Current" class="rounded-3 border border-secondary w-100" style="height:150px;object-fit:cover" />
            </div>
            <label for="edit-event-image" class="upload-area d-flex flex-column align-items-center justify-content-center w-100 py-3" style="cursor:pointer">
              <div id="edit-image-upload-label" class="text-center">
                <i class="bi bi-cloud-upload fs-2 text-secondary d-block mb-1"></i>
                <span class="text-secondary small">Új kép feltöltése</span>
              </div>
              <input id="edit-event-image" type="file" name="image" accept="image/*" class="d-none" />
            </label>
            <div id="edit-image-preview-container" class="hidden mt-2 position-relative rounded-3 overflow-hidden border border-secondary">
              <img id="edit-image-preview" src="" alt="Preview" class="w-100" style="height:150px;object-fit:cover" />
              <button type="button" id="edit-remove-image-btn" class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle p-1" style="width:30px;height:30px;display:flex;align-items:center;justify-content:center">
                <i class="bi bi-x" style="font-size:.8rem"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer border-0 justify-content-between">
        <button type="button" id="delete-event-btn" class="btn btn-outline-danger btn-sm"><i class="bi bi-trash me-1"></i>Törlés</button>
        <div class="d-flex gap-2">
          <button type="button" id="cancel-edit-modal-btn" class="btn btn-outline-secondary btn-sm">Mégse</button>
          <button type="submit" form="edit-event-form" class="btn btn-gradient btn-sm px-4 fw-semibold">Mentés</button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Event Details Modal -->
<div class="modal fade" id="event-details-modal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
    <div class="modal-content modal-dark">
      <div class="modal-header border-0 pb-0">
        <h5 class="modal-title fw-bold text-white" id="detail-event-title-modal">Esemény részletei</h5>
        <button type="button" class="btn-close btn-close-white" id="close-event-details-btn"></button>
      </div>
      <div class="modal-body p-4">
        <div class="row g-4">
          <div class="col-lg-7">
            <div class="position-relative rounded-3 overflow-hidden border border-secondary" style="height:300px">
              <img id="detail-event-image" src="" alt="" class="w-100 h-100" style="object-fit:cover" />
              <span id="detail-category-badge" class="position-absolute top-0 end-0 m-3 badge badge-cat px-3 py-2"></span>
            </div>
          </div>
          <div class="col-lg-5 d-flex flex-column gap-2">
            <h3 id="detail-event-title" class="text-white fw-bold"></h3>
            <p id="detail-event-organizer" class="text-secondary small mb-2"><i class="bi bi-person me-1" style="color:#d946ef"></i>Szervező: <span class="text-white fw-semibold"></span></p>
            <div class="d-flex align-items-center gap-3 p-3 rounded-3" style="background:rgba(124,58,237,.15);border:1px solid rgba(124,58,237,.3)">
              <i class="bi bi-calendar3 fs-5" style="color:#a78bfa"></i>
              <div><div class="text-muted" style="font-size:.7rem">Dátum</div><div id="detail-event-date" class="text-white fw-bold small"></div></div>
            </div>
            <div class="d-flex align-items-center gap-3 p-3 rounded-3" style="background:rgba(217,70,239,.15);border:1px solid rgba(217,70,239,.3)">
              <i class="bi bi-clock fs-5" style="color:#e879f9"></i>
              <div><div class="text-muted" style="font-size:.7rem">Időpont</div><div id="detail-event-time" class="text-white fw-bold small"></div></div>
            </div>
            <div class="d-flex align-items-center gap-3 p-3 rounded-3 overflow-hidden" style="background:rgba(236,72,153,.15);border:1px solid rgba(236,72,153,.3)">
              <i class="bi bi-geo-alt fs-5 flex-shrink-0" style="color:#f9a8d4"></i>
              <div class="overflow-hidden"><div class="text-muted" style="font-size:.7rem">Helyszín</div><div id="detail-event-location" class="text-white fw-bold small text-truncate"></div></div>
            </div>
            <div class="d-flex align-items-center gap-3 p-3 rounded-3" style="background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.3)">
              <i class="bi bi-ticket-perforated fs-5" style="color:#6ee7b7"></i>
              <div><div class="text-muted" style="font-size:.7rem">Belépő</div><div id="detail-event-price" class="text-white fw-bold small">Ingyenes</div></div>
            </div>
            <div class="d-flex align-items-center gap-3 p-3 rounded-3" style="background:rgba(6,182,212,.15);border:1px solid rgba(6,182,212,.3)">
              <i class="bi bi-telephone fs-5" style="color:#67e8f9"></i>
              <div><div class="text-muted" style="font-size:.7rem">Kapcsolat</div><div id="detail-event-contact" class="text-white fw-bold small">Nincs megadva</div></div>
            </div>
          </div>
        </div>
        <div class="mt-4 p-4 rounded-3 border border-secondary border-opacity-25" style="background:rgba(30,41,59,.5)">
          <h5 class="text-white fw-bold mb-3"><i class="bi bi-file-text me-2" style="color:#d946ef"></i>Leírás</h5>
          <p id="detail-event-description" class="text-secondary lh-lg mb-0"></p>
        </div>
        <div id="detail-tags-container" class="hidden mt-3">
          <div id="detail-event-tags" class="d-flex flex-wrap gap-2"></div>
        </div>
      </div>
      <div class="modal-footer border-0 justify-content-between">
        <button type="button" id="share-event-btn" class="btn btn-gradient px-4">
          <i class="bi bi-share me-1"></i> Megosztás
        </button>
        <button type="button" class="btn btn-outline-secondary" id="close-event-details-btn-2">Bezárás</button>
      </div>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="/js/constants.js"></script>
<script src="/js/api-auth.js"></script>
<script src="/js/api-events.js"></script>
<script src="/js/render.js"></script>
<script src="/js/modals.js"></script>
<script src="/js/auth-ui.js"></script>
<script src="/js/app.js"></script>
</body>
</html>

