import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/signup',
    name: 'Signup',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/Signup.vue')
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import('../views/Main.vue')
  },
  {
    path: '/compte',
    name: 'Compte',
    component: () => import('../views/Account.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
