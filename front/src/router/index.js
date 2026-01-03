import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/medical-history',
      name: 'medical-history',
      component: () => import('@/views/MedicalHistory.vue'),
    },
    {
      path: '/charts',
      name: 'charts',
      component: () => import('@/views/Charts.vue'),
    },
  ],
})

export default router
