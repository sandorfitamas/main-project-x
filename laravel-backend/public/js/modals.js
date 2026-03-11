// Bootstrap modal instances
const MODALS = {};

function initModals() {
  MODALS.auth         = new bootstrap.Modal(document.getElementById('auth-modal'));
  MODALS.createEvent  = new bootstrap.Modal(document.getElementById('create-event-modal'));
  MODALS.editEvent    = new bootstrap.Modal(document.getElementById('edit-event-modal'));
  MODALS.eventDetails = new bootstrap.Modal(document.getElementById('event-details-modal'));
}

function _toggleModal(modal, show) {
  modal?.[show ? 'show' : 'hide']();
}

function toggleModal(show)             { _toggleModal(MODALS.createEvent,  show); }
function toggleEditModal(show)         { _toggleModal(MODALS.editEvent,    show); }
function toggleAuthModal(show)         { _toggleModal(MODALS.auth,         show); }
function toggleEventDetailsModal(show) { _toggleModal(MODALS.eventDetails, show); }

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const icons = {
    success: 'bi-check-circle-fill',
    error:   'bi-x-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
    info:    'bi-info-circle-fill',
  };
  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  toast.innerHTML = `<i class="bi ${icons[type] || icons.info} flex-shrink-0"></i><span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity .4s';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}
