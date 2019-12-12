import request from '@/utils/request'

export function getBank(params) {
  return request({
    url: '/api/cooperation/loanPlatform/getLoanPlatformTree',
    method: 'get',
    params
  })
}
