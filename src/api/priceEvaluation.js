import request from '@/utils/request'

/**
 * 获取列表
 * @param params
 */
export function getList(params) {
  return request({
    url: '/order/usedCar/queryCreaditCarList',
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

/**
 * 保存二手车信息
 * @param params
 */
export function saveUsedCar(params) {
  return request({
    url: '/order/usedCar/newUserCar',
    method: 'post',
    data: params
  })
}

// app获取图片
export const deleteDocuments = params => request({
  method: 'post',
  url: '/order/usedCar/delUserCarDocument',
  data: params
})


//发起二手车评估
export const startUserCar = params => request({
  method: 'post',
  url: '/order/usedCar/startUserCar',
  data: params
})

//发起二手车评估
export const presentUserCar = params => request({
  method: 'post',
  url: '/order/usedCar/presentUserCar',
  data: params
})



//获取用户信息
export const getUserInfoByTo = () => request({
  method: 'get',
  url: '/user/getUserInfoByTo'
})


