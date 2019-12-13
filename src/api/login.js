import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/user/login',
    method: 'post',
    params
  })
} 

export function setBookObj(params) {
  return request({
    url: '/manage/dict/getDictByTypes',
    method: 'post',
    data: params
  })
}
