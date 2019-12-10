import request from '@/utils/request'
let base = '/api'

export function getList(params) {
  return request({
    url: '/api/table/list',
    method: 'get',
    params
  })
}
