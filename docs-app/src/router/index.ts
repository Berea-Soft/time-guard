import { createRouter, createWebHistory } from 'vue-router';
import DocsLayout from '@/layouts/DocsLayout.vue';
import DemosLayout from '@/layouts/DemosLayout.vue';
import HomePage from '@/pages/HomePage.vue';
import DocPage from '@/pages/DocPage.vue';
import LandingPage from '@/pages/LandingPage.vue';
import DemosList from '@/pages/DemosList.vue';
import DemoPage from '@/pages/DemoPage.vue';

const routes = [
  { path: '/', name: 'landing', component: LandingPage },
  {
    path: '/docs',
    component: DocsLayout,
    children: [
      { path: '', name: 'docs', component: HomePage },
      { path: ':slug', name: 'doc-page', component: DocPage },
    ],
  },
  {
    path: '/demos',
    component: DemosLayout,
    children: [
      { path: '', name: 'demos', component: DemosList },
      { path: ':slug', name: 'demo', component: DemoPage },
    ],
  },
  // Legacy redirect /examples → /demos
  { path: '/examples', redirect: '/demos' },
  { path: '/examples/:id', redirect: '/demos/:id' },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
