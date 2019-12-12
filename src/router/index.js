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
    path: '/projectList',
    name: 'ProjectList',
    component: () => import('@/views/project/list'),
    meta: {title: '项目报单', icon: 'dashboard'}
  },
  {
    path: '/vehicle',
    name: 'vehicle',
    component: () => import('@/views/credit/vehicle'),
    meta: {title: '新增车辆'},
  },

  {
    path: '/brand',
    name: 'brand',
    component: () => import('@/views/carBrand/brand'),
    meta:{
      title: '选择品牌'
    }
  },
  {
    path: '/carSeries',
    name: 'carSeries',
    component: () => import('@/views/carBrand/carModel'),
    meta:{
      title: '选择车系'
    }
  },
  {
    path: '/carModel',
    name: 'carModel',
    component: () => import('@/views/carBrand/carSeries'),
    meta:{
      title: '选择车型'
    }
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
  {
    path: '/applyPayment',
    name: 'ApplyPayment',
    component: () => import('@/views/payment/applyPayment'),
    meta: {title: '缴费走款申请', icon: 'dashboard'}
  },
  { 
    path: '/incomeFamily',
    name: 'IncomeFamily',
    component: () => import('@/views/basicInfo/income/family.vue'),
    meta: {title: '家庭收入', icon: 'dashboard'}
  },
  { 
    path: '/vehicleList',
    name: 'VehicleList',
    component: () => import('@/views/basicInfo/vehicle/list.vue'),
    meta: {title: '名下车辆', icon: 'dashboard'}
  },

  // 404 page must be placed at the end !!!
  // {path: '*', redirect: '/404', hidden: true}
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
