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

// 获取紧急联系人
export function getContactInfo(params) {
  return request({
    url: '/customer/cs/cuEmergencyContact/getList',
    method: 'get',
    params
  })
}

// 保存紧急联系人
export function setContactSave(params) {
  return request({
    url: '/customer/cs/cuEmergencyContact/save',
    method: 'post',
    data: params
  })
}
// --------------------------------------- 主借人房产
// 获取主借人房产列表
export function getHouseList(params) {
  return request({
    url: '/customer/cs/cuPersonalHouse/getList',
    method: 'get',
    params
  })
}
// 保存主借人房产信息
export function setHouseInfo(params) {
  return request({
    url: '/customer/cs/cuPersonalHouse/insert',
    method: 'post',
    data: params
  })
}
// 删除主借人房产列表信息
export function deleteHouseList(params) {
  return request({
    url: '/customer/cs/cuPersonalHouse/delete',
    method: 'get',
    params
  })
}
// 修改主借人房产信息
export function editHouseInfo(params) {
  return request({
    url: '/customer/cs/cuPersonalHouse/update',
    method: 'post',
    data: params
  })
}
// 获取主借人房产信息
export function getHouseInfo(params) {
  return request({
    url: '/order/cuGuarantee/findOwnedHouses',
    method: 'post',
    params
  })
}
// --------------------------------------- 主借人收入
// 获取主借人收入列表
export function getIncomeList(params) {
  return request({
    url: '/customer/cs/cuIncomeDtl/getByCondition',
    method: 'get',
    params
  })
}
// 删除主借人收入列表信息
export function deleteIncomeList(params) {
  return request({
    url: '/customer/cs/cuIncomeDtl/delete',
    method: 'get',
    params
  })
}

