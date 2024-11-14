/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import {createRouter, createWebHistory} from 'vue-router/auto'
import {setupLayouts} from 'virtual:generated-layouts'
import {routes} from 'vue-router/auto-routes'

const routerMap = [{
  name: '/', title: '花礼harei的小空间',
}, {
  name: '/songs', title: '花礼的歌单',
}, {
  name: '/box', title: '花礼的提问箱',
}, {
  name: "/admin/", title: '花礼harei的小空间',
}, {
  name: '/admin/audit', title: '花礼的歌单',
}, {
  name: '/admin/songManage', title: '花礼的歌单',
}, {
  name: '/admin/message', title: '花礼的提问箱',
}, {
  name: '/login', title: '登录',
},]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), routes: setupLayouts(routes).map(route => {
    if (route.path === "/admin") {
      route.component = () => import("/src/layouts/admin.vue");
    } else if (route.path === "/login") {
      route.component = () => import("/src/layouts/login.vue");
    }

    function setChildrenTitle(route) {
      if (!route.children) {
        return;
      }
      for (const child of route.children) {
        if (child.children) {
          setChildrenTitle(child)
        }
        if (!child.name) {
          continue;
        }
        if (!child.meta) {
          child.meta = {}
        }
        child.meta.title = routerMap.find(item => item.name === child.name).title
      }

    }

    setChildrenTitle(route)
    return route;
  }),
})
// Set document title
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
