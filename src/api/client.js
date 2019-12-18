import request, { serviceOther } from '@/utils/request';
// 获取客户及配偶信息
export function getClientInfo(params) {
  return request({
    url: '/order/viceProj/getCustomerInfo',
    method: 'get',
    params
  })
}
// 保存客户及配偶信息
export function setClientSave(params) {
  return request({
    url: '/order/viceProj/saveCustomerInfo',
    method: 'post',
    data: params
  })
}


