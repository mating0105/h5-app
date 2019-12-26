import request from '@/utils/request'

/**
 * 获取列表
 * @param params
 */
export function getList(params) {
  return request({
    url: '/order/creditInfo/queryCreaditCarList',
    method: 'get',
    params
  })
}

/**
 * 车辆评估
 * @param params
 */
export function save(params) {
  return request({
    url: '/order/creditInfo/assessmentCar',
    method: 'post',
    data: params
  })
}

/**
 * 检查贷款金额和评估价
 * @param params
 */
export function checkAssessmentCar(params) {
  return request({
    url: '/order/creditInfo/checkAssessmentCar',
    method: 'get',
    params
  })
}
