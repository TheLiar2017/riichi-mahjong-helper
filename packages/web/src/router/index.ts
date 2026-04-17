import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/rules',
      name: 'rules',
      component: () => import('../views/Rules.vue')
    },
    {
      path: '/yaku',
      name: 'yaku',
      component: () => import('../views/YakuList.vue')
    },
    {
      path: '/calculator',
      name: 'calculator',
      component: () => import('../views/Calculator.vue')
    }
  ]
})

export default router
