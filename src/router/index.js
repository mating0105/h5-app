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
    meta: {title: '项目报单', icon: 'dashboard'}
  },
  {
    path: '/lendProcess',
    name: 'lendProcess',
    component: () => import('@/views/lendProcess/index'),
    meta: {title: '发起做单', icon: 'dashboard'}
  },

  {
    path: '/projectInfo',
    name: 'ProjectInfo',
    component: () => import('@/views/basicInfo/projectInfo/index'),
    meta: {title: '新建报单', icon: 'dashboard'}
  },

  { 
    path: '/clientIndex',
    name: 'ClientIndex',
    component: () => import('@/views/basicInfo/client/index'),
    meta: {title: '客户及配偶', icon: 'dashboard'}
  },

  { 
    path: '/contactPerson',
    name: 'ContactPerson',
    component: () => import('@/views/basicInfo/contact/index'),
    meta: {title: '紧急联系人', icon: 'dashboard'}
  }, 
  { 
    path: '/houseUser',
    name: 'HouseUser',
    component: () => import('@/views/basicInfo/house/user'),
    meta: {title: '房产信息', icon: 'dashboard'}
  },
  { 
    path: '/addHouseUser',
    name: 'AddHouseUser',
    component: () => import('@/views/basicInfo/house/addUser'),
    meta: {title: '新增房产信息', icon: 'dashboard'}
  },
  { 
    path: '/houseGuarantor',
    name: 'HouseGuarantor',
    component: () => import('@/views/basicInfo/house/guarantor'),
    meta: {title: '房产担保人', icon: 'dashboard'}
  },
  { 
    path: '/addHouseGuarantor',
    name: 'AddHouseGuarantor',
    component: () => import('@/views/basicInfo/house/addGuarantor'),
    meta: {title: '新增房产担保人', icon: 'dashboard'}
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
