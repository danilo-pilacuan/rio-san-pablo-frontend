import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'Dashboard'
    },
    path: '/',
    name: 'home',
    component: Home
  },
  {
    meta: {
      title: 'Tables'
    },
    path: '/tables',
    name: 'tables',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "tables" */ '@/views/Tables.vue')
  },
  {
    meta: {
      title: 'Forms'
    },
    path: '/forms',
    name: 'forms',
    component: () => import('@/views/Forms.vue')
  },
  {
    meta: {
      title: 'Profile'
    },
    path: '/profile',
    name: 'profile',
    component: () => import(/* webpackChunkName: "profile" */ '@/views/Profile.vue')
  },
  {
    meta: {
      title: 'New Client'
    },
    path: '/client/new',
    name: 'client.new',
    component: () => import(/* webpackChunkName: "client-form" */ '@/views/ClientForm.vue')
  },
  {
    meta: {
      title: 'Edit Client'
    },
    path: '/client/:id',
    name: 'client.edit',
    component: () => import(/* webpackChunkName: "client-form" */ '@/views/ClientForm.vue'),
    props: true
  },
  /* Rutas Cruds*/
  {
    meta: {
      title: 'Socios'
    },
    path: '/socios',
    name: 'socios',
    component: () => import('@/views/Socios.vue')
  },
  {
    meta: {
      title: 'Unidades'
    },
    path: '/unidades',
    name: 'unidades',
    component: () => import('@/views/Unidades.vue')
  },
  {
    meta: {
      title: 'Inventario'
    },
    path: '/inventario',
    name: 'inventario',
    component: () => import('@/views/Inventario.vue')
  },
  {
    meta: {
      title: 'Aportes'
    },
    path: '/aportes',
    name: 'aportes',
    component: () => import('@/views/Aportes.vue')
  },
  {
    meta: {
      title: 'Aportes'
    },
    path: '/aportes/:id',
    name: 'aportes',
    component: () => import('@/views/Aportes.vue')
  },
  {
    meta: {
      title: 'Reportes'
    },
    path: '/reportes',
    name: 'reportes',
    component: () => import('@/views/Reportes.vue')
  },
  {
    meta: {
      title: 'Rutas'
    },
    path: '/rutas',
    name: 'rutas',
    component: () => import('@/views/Rutas.vue')
  },
  {
    meta: {
      title: 'Horarios'
    },
    path: '/horarios',
    name: 'horarios',
    component: () => import('@/views/Horarios.vue')
  },
  // {
  //   meta: {
  //     title: 'Tarjetas'
  //   },
  //   path: '/tarjetas',
  //   name: 'tarjetas',
  //   component: () => import('@/views/Tarjetas.vue')
  // },
  {
    meta: {
      title: 'Tarjetas'
    },
    path: '/tarjetas/:id',
    name: 'tarjetas',
    component: () => import('@/views/Tarjetas.vue')
  },

  //fin rutas cruds
  {
    path: '/full-page',
    component: () => import(/* webpackChunkName: "full-page" */ '@/views/FullPage.vue'),
    children: [
      {
        meta: {
          title: 'Login'
        },
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "full-page" */ '@/views/full-page/Login.vue')
      }
    ]
  }

]

const router = new VueRouter({
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

export default router

export function useRouter () {
  return router
}
