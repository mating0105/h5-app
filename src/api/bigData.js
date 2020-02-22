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
 * 大数据和人保回复
 * @param url
 * @param params
 */
export function reply(url, params) {
  return request({
    url,
    method: 'post',
    data: params
  })
}

/**
 * 驻行回复
 * @param params
 */
export function bankReply(params) {
  return request({
    url: '/order/creditProcess/submitBankInsideCreditInfo',
    method: 'post',
    data: params
  })
}





