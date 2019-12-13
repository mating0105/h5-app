import request from '@/utils/request'

// 获取品牌
export const getBrand = params => request({
  method: 'get',
  url: '/product/ps/carBrandInfo/findList',
  params
})

// 获取车系
export const getCarSeries = params => request({
  method: 'get',
  url: '/product/ps/carSeriesInfo/findList',
  params
})

// 获取车型
export const getCardModel = params => request({
  method: 'get',
  url: '/product/ps/carTypeInfo/findList',
  params
})
