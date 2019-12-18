import request from '@/utils/request'

export function getBank(params) {
  return request({
    url: '/cooperation/loanPlatform/getLoanPlatformTree',
    method: 'get',
    params
  })
}

export function getCreditInfo(params) {
  return request({
    url: '/order/creditInfo/cuCreditRegisterFormMob',
    method: 'get',
    params
  })
}

export function getList(params) {
  return request({
    url: '/order/creditInfo/queryCreaditRegister',
    method: 'get',
    params
  })
}

export function saveCreditInfo(params) {
  return request({
    url: '/order/creditInfo/creditRegisterInput',
    method: 'post',
    data: params
  })
}

export function createTask(params) {
  return request({
    url: '/order/creditProcess/createTask',
    method: 'post',
    data: params
  })
}

export function getUsers(params) {
  return request({
    url: '/order/creditProcess/findCreditChoosePer',
    method: 'post',
    data: params
  })
}

export function submitCredit(params) {
  return request({
    url: 'order/creditProcess/submitCredit',
    method: 'post',
    data: params
  })
}
