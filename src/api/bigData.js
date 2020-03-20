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

/**
 * 垫款查询列表
 * @param params
 */
export function getAdvanceEnquiryList(params) {
    return request({
      url: '/order/advanceOrder/list',
      method: 'post',
      data: params
    })
  }
//提前告知征信结果
  export function informInAdvanceResult(params) {
    return request({
      url: '/order/standardCreditInfo/informInAdvanceResult',
      method: 'post',
      data: params
    })
  }


