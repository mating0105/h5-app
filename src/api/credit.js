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
    url: 'http://192.168.0.81:8086/order/creditInfo/cuCreditRegisterFormMob?lpCertificateNum=340102198407165395&id=191204537544 ',
    method: 'get',
    params
  })
}
