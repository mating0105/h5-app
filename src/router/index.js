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
    path: '/creditList',
    name: 'creditList',
    component: () => import('@/views/credit'),
    meta: {title: '征信查询'}
  },

  {
    path: '/reNewCredit',
    name: 'ReNewCredit',
    component: () => import('@/views/credit/reNewCredit'),
    meta: {title: '征信申请'}
  },

  {
    path: '/creditNextStep',
    name: 'creditNextStep',
    component: () => import('@/views/credit/creditNextStep'),
    meta: {title: '征信申请'}
  },

  {
    path: '/priceEvaluationList',
    name: 'priceEvaluationList',
    component: () => import('@/views/priceEvaluation/list'),
    meta: {title: '车价评估'}
  },

  {
    path: '/priceEvaluationDetail',
    name: 'priceEvaluationDetail',
    component: () => import('@/views/priceEvaluation/detail'),
    meta: {title: '评估详情'}
  },

  {
    path: '/bigDataQueryList',
    name: 'bigDataQueryList',
    component: () => import('@/views/credit/bigDataQuery/list'),
    meta: {title: '大数据查询'}
  },

  {
    path: '/bigDataQueryDetail',
    name: 'bigDataQueryDetail',
    component: () => import('@/views/credit/bigDataQuery/detail'),
    meta: {title: '基本资料'}
  },

  {
    path: '/bigDataReply',
    name: 'bigDataReply',
    component: () => import('@/views/credit/bigDataQuery/bigDataReply'),
    meta: {title: '征信回复'}
  },

  {
    path: '/bankQuery',
    name: 'bankQuery',
    component: () => import('@/views/credit/bankQuery'),
    meta: {title: '基本资料'}
  },

  {
    path: '/projectList',
    name: 'ProjectList',
    component: () => import('@/views/project/list'),
    meta: {title: '项目报单', icon: 'dashboard', keepAlive: true}
  },
  {
    path: '/vehicle',
    name: 'vehicle',
    component: () => import('@/views/credit/vehicle'),
    meta: {title: '新增车辆'},
  },

  {
    path: '/xhProject',
    name: 'Project',
    component: () => import('@/views/project/index'),
    meta: {title: '项目报单', icon: 'dashboard'}
  },
  {
    path: '/lendProcessList',
    name: 'lendProcessList',
    component: () => import('@/views/makeLoan/loadList/index'),
    // meta: {title: '待办', icon: 'dashboard'}
  },
  {
    path: '/lendProcess',
    name: 'lendProcess',
    component: () => import('@/views/makeLoan/lendProcess/index'),
    meta: {title: '发起做单', icon: 'dashboard'}
  },
  {
    path: '/bankLend',
    name: 'bankLend',
    component: () => import('@/views/makeLoan/bankLend/index'),
    meta: {title: '银行放款', icon: 'dashboard'}
  },

  {
    path: '/projectInfo',
    name: 'ProjectInfo',
    component: () => import('@/views/basicInfo/projectInfo/index'),
    meta: {title: '报单', keepAlive: true}
  },
  
  { 
    path: '/customerList',
    name: 'CustomerList',
    component: () => import('@/views/project/customerList'),
    meta: {title: '客户列表', icon: 'dashboard' }
  },
  { 
    path: '/clientIndex',
    name: 'ClientIndex',
    component: () => import('@/views/basicInfo/client/user'),
    meta: {title: '客户及配偶', icon: 'dashboard'}
  },
  { 
    path: '/addGuarantor',
    name: 'AddGuarantor',
    component: () => import('@/views/basicInfo/client/addGuarantor'),
    meta: {title: '担保人', icon: 'dashboard'}
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
    meta: {title: '房产信息', icon: 'dashboard'}
  },
  { 
    path: '/guarantor',
    name: 'Guarantor',
    component: () => import('@/views/basicInfo/client/guarantor'),
    meta: {title: '担保人信息', icon: 'dashboard'}
  },
  { 
    path: '/houseGuarantor',
    name: 'HouseGuarantor',
    component: () => import('@/views/basicInfo/house/guarantor'),
    meta: {title: '担保人房产', icon: 'dashboard'}
  },
  { 
    path: '/addHouseGuarantor',
    name: 'AddHouseGuarantor',
    component: () => import('@/views/basicInfo/house/addGuarantor'),
    meta: {title: '担保人房产', icon: 'dashboard'}
  },
  { 
    path: '/incomeFamily',
    name: 'IncomeFamily',
    component: () => import('@/views/basicInfo/income/family.vue'),
    meta: {title: '家庭收入', icon: 'dashboard'}
  },
  { 
    path: '/addIncome',
    name: 'AddIncome',
    component: () => import('@/views/basicInfo/income/addFamily.vue'),
    meta: {title: '家庭收入', icon: 'dashboard'}
  },
  { 
    path: '/addGuarantorIncome',
    name: 'AddGuarantorIncome',
    component: () => import('@/views/basicInfo/income/addGuarantor.vue'),
    meta: {title: '担保人收入', icon: 'dashboard'}
  },
  { 
    path: '/incomeGuarantor',
    name: 'IncomeGuarantor',
    component: () => import('@/views/basicInfo/income/guarantor.vue'),
    meta: {title: '担保人收入', icon: 'dashboard'}
  },
  { 
    path: '/vehicleList',
    name: 'VehicleList',
    component: () => import('@/views/basicInfo/vehicle/list.vue'),
    meta: {title: '名下车辆', icon: 'dashboard'}
  },
  { 
    path: '/addCars',
    name: 'AddCars',
    component: () => import('@/views/basicInfo/vehicle/addCars.vue'),
    meta: {title: '名下车辆', icon: 'dashboard'}
  },
  {
    path: '/applyPayment',
    name: 'ApplyPayment',
    component: () => import('@/views/payment/applyPayment'),
    meta: {title: '缴费走款申请', icon: 'dashboard'}
  },
  {
    path: '/applyPaymentList',
    name: 'ApplyPaymentList',
    component: () => import('@/views/payment/list'),
    meta: {title: '缴费走款', icon: 'dashboard'}
  },
  {
    path: '/paymentSure',
    name: 'PaymentSure',
    component: () => import('@/views/payment/paymentSure'),
    meta: {title: '走款确认', icon: 'dashboard'}
  },
  {
    path: '/paymentProjectInfo',
    name: 'PaymentProjectInfo',
    component: () => import('@/views/payment/projectInfo'),
    meta: {title: '项目基本信息', icon: 'dashboard'}
  },
  {
    path: '/costDetail',
    name: 'CostDetail',
    component: () => import('@/views/payment/costDetail'),
    meta: {title: '费用信息', icon: 'dashboard'}
  },
  {
    path: '/paymentDocument',
    name: 'PaymentDocument',
    component: () => import('@/views/payment/document'),
    meta: {title: '相关文档', icon: 'dashboard'}
  },
  {
    path: '/controlMeasure',
    name: 'ControlMeasure',
    component: () => import('@/views/payment/controlMeasure'),
    meta: {title: '风控措施', icon: 'dashboard'}
  },
  {
    path: '/gps',
    name: 'Gps',
    component: () => import('@/views/gps/index'),
    meta: {title: 'GPS', icon: 'dashboard'}
  },
  {
    path: '/gpsurl',
    name: 'Gpsurl',
    component: () => import('@/views/gps/urlPage'),
    meta: {title: 'GPS', icon: 'dashboard'}
  },
  { 
    path: '/survey',
    name: 'Survey',
    component: () => import('@/views/basicInfo/survey/index.vue'),
    meta: {title: '调查结论', icon: 'dashboard'}
  },
  { 
    path: '/proDocument',
    name: 'ProDocment',
    component: () => import('@/views/basicInfo/documents/index.vue'),
    meta: {title: '相关文档', icon: 'dashboard'}
  },
  { 
    path: '/relatedDocs',
    name: 'RelatedDocs',
    component: () => import('@/views/relatedDocs/relatedDocs.vue'),
    meta: {title: '相关文档', icon: 'dashboard'}
  },
  { 
    path: '/creatCustomer',
    name: 'CreatCustomer',
    component: () => import('@/views/createCustomer/index'),
    meta: {title: '新建客户', icon: 'dashboard'}
  },
  { 
    path: '/contractList',
    name: 'contractList',
    component: () => import('@/views/contractUpload/index'),
    meta: {title: '合同上传', icon: 'dashboard', keepAlive: true}
  },
  { 
    path: '/contractUpload/',
    name: 'contractUpload',
    component: () => import('@/views/contractUpload/upload'),
    meta: {title: '合同上传', icon: 'dashboard', keepAlive: true}
  },
  {
    path: '/heavyRightSupplement',
    name: 'HeavyRightSupplement',
    component: () => import('@/views/heavyRightSupplement/index'),
    meta: {title: '重权补录', icon: 'dashboard'}
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('@/views/help/index'),
    meta: {title: '流程说明', icon: 'dashboard'}
  },
  { 
    path: '/heavyRightManage/:id/:customerNum/:customerId',
    name: 'HeavyRightManage',
    component: () => import('@/views/heavyRightSupplement/manage/heavyRightManage'),
    meta: {title: '重权管理', icon: 'dashboard'},
    children:[
      {
        path: 'basic',
        name: 'HeavyRightBasic',
        component: () => import('@/views/heavyRightSupplement/manage/basic'),
        meta: {title: '重权管理', icon: 'dashboard'},
      },
      {
        path: 'relatedDocs',
        name: 'HeavyRelatedDocs',
        component: () => import('@/views/relatedDocs/relatedDocs'),
        meta: {title: '重权管理', icon: 'dashboard'},
      },
      {
        path: 'approval',
        name: 'HeavyApproval',
        component: () => import('@/views/heavyRightSupplement/manage/approval'),
        meta: {title: '重权管理', icon: 'dashboard'},
      },
    ]
   
  },
  {
    path: '/userAgreement',
    name: 'userAgreement',
    component: () => import('@/views/userAgreement/index'),
    //meta: {title: '用户协议', icon: 'dashboard'},
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
