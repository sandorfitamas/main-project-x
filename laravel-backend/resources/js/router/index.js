import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import EventDetailsPage from '../pages/EventDetailsPage.vue';

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/event/:id', name: 'event-details', component: EventDetailsPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
