//地图 请求省市区
import request from '@/utils/request'

export function mapMethod(params) {
  return request({
    url: '/manage/area/getAreaList',
    method: 'get',
    params
  })
} 

export function mapMethodGaoDe() {
  return request({
    url: '/customer/cs/cuPersonalInfo/amap/v3',
    method: 'get',
    data: {
      key: '',
      subdistrict: 3
    }
  })
} 
