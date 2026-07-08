import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'landing',
    component: () => import('@/pages/LandingPage.vue'),
  },
  {
    path: '/docs',
    component: () => import('@/layouts/DocsLayout.vue'),
    children: [
      {
        path: '',
        name: 'docs',
        component: () => import('@/pages/HomePage.vue'),
      },
      {
        path: ':slug',
        name: 'doc-page',
        component: () => import('@/pages/DocPage.vue'),
      },
    ],
  },
  {
    path: '/demos',
    component: () => import('@/layouts/DemosLayout.vue'),
    children: [
      {
        path: '',
        name: 'demos',
        component: () => import('@/pages/DemosList.vue'),
      },
      {
        path: ':slug',
        name: 'demo',
        component: () => import('@/pages/DemoPage.vue'),
      },
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
