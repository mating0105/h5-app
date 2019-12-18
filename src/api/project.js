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