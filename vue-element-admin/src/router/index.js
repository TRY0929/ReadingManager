import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    name: 'book',
    path: '/book',
    redirect: '/book/create',
    component: Layout,
    meta: { title: '图书管理', icon: 'document' },
    children: [
      {
        name: 'bookCreate',
        path: 'create',
        meta: { title: '上传图书', icon: 'edit', roles: ['admin'], affix: true },
        component: () => import('@/views/book/create')
      },
      {
        name: 'bookList',
        path: 'list',
        meta: { title: '图书列表', icon: 'document', roles: ['admin', 'editor'] },
        component: () => import('@/views/book/create')
      },
      {
        name: 'bookEdit',
        path: 'edit/:fileName(.*)',
        meta: { title: '编辑图书', icon: 'edit', roles: ['admin'] },
        component: () => import('@/views/book/edit')
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
