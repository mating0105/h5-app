import request, { serviceOther } from '@/utils/request'
// 报单列表
export function getProjectList(params) {
  return request({
    url: '/order/project/list',
    method: 'get',
    params
  })
}
// 报单详情
export function getProjectInfo(params) {
  return request({
    url: '/order/project/getProjectInfo',
    method: 'get',
    params
  })
}
// 获取车商
export function getProjectCustomer(params) {
  return serviceOther({
    url: '/customer/cs/carDealer/getAllCarDealers',
    method: 'get',
    params
  })
}
// 获取盗抢险购买平台
export function getAllTpBuyPlatform(params) {
  return request({
    url: '/cooperation/tpBuyPlatform/getAllTpBuyPlatform',
    method: 'get',
    params
  })
}
// 查询1-查询业务模式，2-查询贷款期限，3-查询产品类别，4-查询产品列表，5-查询产品详细信息
export function getProductTypeList(params) {
  return request({
    url: '/product/ps/getProductCategory',
    method: 'get',
    params
  })
}
// 查询放款平台
export function getLoanPlatformTree(params) {
  return request({
    url: '/cooperation/loanPlatform/getLoanPlatformTree',
    method: 'get',
    params
  })
}
// 报单保存
export function setProjectInfo(params) {
  return request({
    url: '/order/project/saveProjectInfo',
    method: 'post',
    data: params
  })
}
// 报单流程提交返回人
export function setProjectTask(params) {
  return request({
    url: '/order/projProject/createTask',
    method: 'post',
    data: params
  })
}
// 报单流程提交
export function setProjectProcess(params) {
  return request({
    url: '/order/projProject/submitTask',
    method: 'post',
    data: params
  })
}

// 获取客户列表
export function getCustomerList(params) {
  return request({
    url: '/order/project/selectCustomer',
    method: 'get',
    params
  })
}
// 选择发起报单
export function getCuListManage(params) {
  return request({
    url: '/order/cuListManage/getCuListManage',
    method: 'get',
    params
  })
}
// 创建一个新报单
export function createNewProj(params) {
  return request({
    url: '/order/project/newProj',
    method: 'get',
    params
  })
}
// 是否出现终止
export function isEndActive(params) {
  return request({
    url: '/order/projProject/getProcesstype',
    method: 'get',
    params
  })
}
// 内勤 提交的接口
export function postGetUserIds(params) {
  return request({
    url: '/order/projProject/getUserIds',
    method: 'post',
    data: params
  })
}
// 风控选人
export function getAcceptList(params) {
  return request({
    url: '/order/projProject/chooseAccept',
    method: 'get',
    params
  })
}
// 保存 风控措施
export function postWindControl(params) {
  return request({
    url: '/order/project/saveRiskMeasureCondition',
    method: 'post',
    data: params
  })
}

// 记录保存结果红点是否存在
export function getIsSave(params) {
  return request({
    url: '/order/project/checkProjInfo',
    method: 'post',
    data: params
  })
}
// 是否可报单
export function getDeclaration(params) {
  return request({
    url: '/order/project/checkProj',
    method: 'get',
    params
  })
}
// 新增车辆 
export function setNewCar(params) {
  return request({
    url: '/order/project/saveCar',
    method: 'post',
    data: params
  })
}
// 删除车辆 
export function deleteCar(params) {
  return request({
    url: '/order/project/deleteCar',
    method: 'post',
    data: params
  })
}
// 报单流程回退
export function setProcessBack(params) {
  return request({
    url: '/order/projProject/returnTask',
    method: 'post',
    data: params
  })
}
// 报单流程终止
export function setProcessStop(params) {
  return request({
    url: '/order/creditProcess/stopTask',
    method: 'get',
    params
  })
}
// 获取GPS套餐
export function getGPSData(params) {
  console.log('接口',params)
  return serviceOther({
    url: `/admin/cmsPackcust/page/mobile/${ params.mobile }?page=1&limit=1000&insuranceflag=${ params.thiefRescue }`,
    method: 'get'
  })
}

// 项目信息增加车辆
export function addCar(params) {
  return request({
    url: '/order/project/saveCar',
    method: 'post',
    params
  })
}


