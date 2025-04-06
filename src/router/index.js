import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import DataPlatform from '../views/DataPlatform.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/data-platform',
      name: 'DataPlatform',
      component: DataPlatform
    }
  ]
})

export default router 