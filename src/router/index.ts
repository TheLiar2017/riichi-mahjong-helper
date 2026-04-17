import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Rules from '../views/Rules.vue'
import YakuList from '../views/YakuList.vue'
import ScoreCalculator from '../views/ScoreCalculator.vue'
import Shanten from '../views/Shanten.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/rules', name: 'rules', component: Rules },
    { path: '/yaku', name: 'yaku', component: YakuList },
    { path: '/calculator', name: 'calculator', component: ScoreCalculator },
    { path: '/shanten', name: 'shanten', component: Shanten }
  ]
})

export default router
