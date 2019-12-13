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
