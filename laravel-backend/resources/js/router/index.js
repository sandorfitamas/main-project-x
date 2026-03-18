import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import EventDetailsPage from '../pages/EventDetailsPage.vue';
import ProfilePage from '../pages/ProfilePage.vue';

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/event/:id', name: 'event-details', component: EventDetailsPage },
  { path: '/profile', name: 'profile', component: ProfilePage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
