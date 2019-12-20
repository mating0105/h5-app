import request from '@/utils/request'

/**
 * 获取列表
 * @param params
 */
export function getList(params) {
  return request({
    url: '/order/creditInfo/queryInternetCreaditRegister',
    method: 'get',
    params
  })
}

/**
 * 回复
 * @param params
 */
export function reply(params) {
  return request({
    url: 'order/creditInfo/updateCreditResult',
    method: 'post',
    data: params
  })
}

