import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import AboutPage from '@/views/AboutPage.vue'
import OrderingPage from '@/views/OrderingPage.vue'
import TrackOrder from '@/views/TrackOrder.vue'
const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/about', name: 'About', component: AboutPage },
  { path: '/ordering', name: 'Ordering', component: OrderingPage },
  { path: '/track/:orderKey', name: 'TrackOrder', component: TrackOrder },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
