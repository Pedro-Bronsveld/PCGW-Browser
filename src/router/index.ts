import BrowseView from '../views/BrowseView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'browse',
      component: BrowseView
    }
  ]
})

export default router
