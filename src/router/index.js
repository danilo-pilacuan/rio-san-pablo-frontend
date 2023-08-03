import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import store from '@/store'


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
  // {
  //   meta: {
  //     title: 'Profile'
  //   },
  //   path: '/profile',
  //   name: 'profile',
  //   component: () => import(/* webpackChunkName: "profile" */ '@/views/Profile.vue')
  // },
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
    name: 'aportesbyid',
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
      title: 'Fletes'
    },
    path: '/fletes',
    name: 'fletes',
    component: () => import('@/views/Fletes.vue')
  },
  {
    meta: {
      title: 'Horarios'
    },
    path: '/horarios',
    name: 'horarios',
    component: () => import('@/views/Horarios.vue')
  },
  {
    meta: {
      title: 'Usuarios'
    },
    path: '/usuarios',
    name: 'usuarios',
    component: () => import('@/views/Usuarios.vue')
  },
  {
    meta: {
      title: 'Imprimir'
    },
    path: '/imprimir',
    name: 'imprimir',
    component: () => import('@/views/Imprimir.vue')
  },
  {
    meta: {
      title: 'Imprimir'
    },
    path: '/imprimir/:id',
    name: 'imprimirbyid',
    component: () => import('@/components/ImprimirReporte.vue')
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
  {
    meta: {
      title: 'Horarios'
    },
    path: '/Horarios/:id',
    name: 'VerHorarios',
    component: () => import('@/views/ViewCalendario.vue')
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
  mode:'history',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

// router.beforeEach((to, from, next) => {
  
//   // redirect to login page if not logged in and trying to access a restricted page
//   const publicPages = ['/login', '/register'];
//   const authRequired = !publicPages.includes(to.path);
//   const loggedIn = store.state.authenticated

//   console.log("loggedIn")
//   console.log("loggedIn")
//   console.log("loggedIn")
//   console.log("loggedIn")
//   console.log("loggedIn")
//   console.log("loggedIn")
//   console.log(loggedIn)
//   //console.log(router.app.$store.getters('user'))

//   if (authRequired && !loggedIn) {
//     return next('/login');
//   }

//   next();
// })

export default router

export function useRouter () {
  return router
}
