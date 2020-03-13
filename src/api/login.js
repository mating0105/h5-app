import request from '@/utils/request'
import {serviceOther} from '@/utils/request'

export function login(params) {
  return serviceOther({
    url: '/userauth/oauth/token',
    method: 'post',
    params,
    headers: {
      Authorization: 'Basic c29yZGVyOnNvcmRlcg=='
    }
  })
} 

export function setBookObj(params) {
  return serviceOther({
    url: '/manage/dict/getDictByTypes',
    method: 'post',
    data: params
  })
}
