import request from '@/utils/request'

export function paymentList(params) {
  return request({
    url: '/order/captureExpends/list',
    method: 'get',
    params
  })
} 

