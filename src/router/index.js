import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/gis2d',
    meta: {
      headerDisplay: true
    },
  },
  {
    path: '/gis2d',
    name: 'gis2d',
    meta: {
      headerDisplay: true
    },
    component: () => import('@/views/gis2d.vue')
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
