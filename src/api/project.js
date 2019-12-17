import request from '@/utils/request'
// 报单列表
export function getProjectList(params) {
  return request({
    url: '/order/project/list',
    method: 'get',
    params
  })
}
// 保单详情
export function getProjectInfo(params) {
  return request({
    url: '/order/project/getProjectInfo',
    method: 'get',
    params
  })
}
// 获取车商
export function getProjectCustomer(params) {
  return request({
    url: '/customer/cs/carDealer/getAllCarDealers',
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
