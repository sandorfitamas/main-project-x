import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import EventDetailsPage from '../pages/EventDetailsPage.vue';
import ProfilePage from '../pages/ProfilePage.vue';
import AdminPage from '../pages/AdminPage.vue';

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'home', component: HomePage },
  { path: '/events', name: 'events', component: HomePage },
  { path: '/my-events', name: 'my-events', component: HomePage },
  { path: '/favorites', name: 'favorites', component: HomePage },
  { path: '/community', name: 'community', component: HomePage },
  { path: '/event/:id', name: 'event-details', component: EventDetailsPage },
  { path: '/profile', name: 'profile', component: ProfilePage },
  { path: '/admin', name: 'admin', component: AdminPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.afterEach((to) => {
  const baseTitle = 'Project X';
  switch (to.name) {
    case 'home':
      document.title = `${baseTitle} - Találd meg a legjobb bulit`;
      break;
    case 'events':
      document.title = `Böngészés - ${baseTitle}`;
      break;
    case 'my-events':
      document.title = `Saját események - ${baseTitle}`;
      break;
    case 'favorites':
      document.title = `Kedvencek - ${baseTitle}`;
      break;
    case 'community':
      document.title = `Közösség - ${baseTitle}`;
      break;
    case 'profile':
      document.title = `Profil - ${baseTitle}`;
      break;
    case 'admin':
      document.title = `Admin - ${baseTitle}`;
      break;
    // Az 'event-details' egyedi nevet kap maga a komponens által a betöltés után
  }
});

export default router;
