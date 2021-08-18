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
    props: true,
    component: () => import('../views/Main.vue')
  },
  {
    path: '/compte/:id',
    name: 'Compte',
    props: true,
    component: () => import('../views/Account.vue')
  },
  {
    path: '/moncompte/',
    name: 'MonCompte',
    props: true,
    component: () => import('../views/MyAccount.vue')
  },
  {
    path: '/main/createpost',
    name: 'CreatePost',
    props: true,
    component: () => import('../views/CreatePost.vue')
  },
  {
    path: '/main/post/:id',
    name: 'OnePostNews',
    props: true,
    component: () => import('../views/OnePostNews.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
