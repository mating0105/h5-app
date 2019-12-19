//合同上传
import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/order/project/list',
    method: 'get',
    params
  })
}