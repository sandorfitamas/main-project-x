const API_BASE = '/api';
const AUTH_BASE = '/api/auth';

const EventCategory = {
  ALL: 'all',
  HAZIBULI: 'Házibuli',
  KLUB: 'Klub',
  FESZTIVAL: 'Fesztivál',
  RAVE: 'Rave',
  CHILL: 'Chill',
  EGYEB: 'Egyéb',
};

const CATEGORY_ICONS = {
  'Házibuli': 'bi-house-heart',
  'Klub':     'bi-music-note-beamed',
  'Fesztivál':'bi-balloon',
  'Rave':     'bi-lightning-charge',
  'Chill':    'bi-cup-hot',
  'Egyéb':    'bi-tag',
};

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&q=80';

const STORAGE_KEYS = {
  AUTH_TOKEN:   'auth_token',
  CURRENT_USER: 'current_user',
};
