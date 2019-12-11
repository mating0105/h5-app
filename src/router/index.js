import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRoutes = [

  {
    path: '/404',
    component: () => import('@/views/404')
  },

  {
    path: '/',
    redirect: '/dashboard',
  },

  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index'),
    meta: {title: 'Dashboard'}
  },

  {
    path: '/reNewCredit',
    name: 'ReNewCredit',
    component: () => import('@/views/credit/reNewCredit'),
    meta: {title: '征信申请'}
  },

  {
    path: '/xhProject',
    name: 'Project',
    component: () => import('@/views/project/index'),
    meta: {title: 'Project', icon: 'dashboard'}
  },
  {
    path: '/lendProcess',
    name: 'lendProcess',
    component: () => import('@/views/lendProcess/index'),
    meta: {title: '发起做单', icon: 'dashboard'}
  },

  // 404 page must be placed at the end !!!
  {path: '*', redirect: '/404', hidden: true}
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
