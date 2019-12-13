import request from '@/utils/request'

export function getProjectList(params) {
  return request({
    url: '/order/project/list',
    method: 'get',
    params
  })
}
