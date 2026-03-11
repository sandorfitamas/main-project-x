// Bootstrap modal refs
let authModalBS = null;
let createEventModalBS = null;
let editEventModalBS = null;
let eventDetailsModalBS = null;

function initModals() {
  authModalBS        = new bootstrap.Modal(document.getElementById('auth-modal'));
  createEventModalBS = new bootstrap.Modal(document.getElementById('create-event-modal'));
  editEventModalBS   = new bootstrap.Modal(document.getElementById('edit-event-modal'));
  eventDetailsModalBS = new bootstrap.Modal(document.getElementById('event-details-modal'));
}

function toggleModal(show) {
  if (show) createEventModalBS.show();
  else createEventModalBS.hide();
}

function toggleEditModal(show) {
  if (show) editEventModalBS.show();
  else editEventModalBS.hide();
}

function toggleAuthModal(show) {
  if (show) authModalBS.show();
  else authModalBS.hide();
}

function toggleEventDetailsModal(show) {
  if (show) eventDetailsModalBS.show();
  else eventDetailsModalBS.hide();
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const icons = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', warning: 'bi-exclamation-triangle-fill', info: 'bi-info-circle-fill' };
  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  toast.innerHTML = `<i class="bi ${icons[type] || icons.info} flex-shrink-0"></i><span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .4s'; setTimeout(() => toast.remove(), 400); }, 3500);
}
