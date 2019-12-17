import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'
import Vue from 'vue';
import { Notify } from 'vant';

Vue.use(Notify);

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

const requestFulfilled = config => {
  // do something before request is sent

  if (store.getters.token) {
    // let each request carry token
    // ['X-Token'] is a custom headers key
    // please modify it according to the actual situation
    config.headers['token'] = getToken()
  }
  return config
}

const requestRejected = error => {
  // do something with request error
  console.log(error) // for debug
  return Promise.reject(error)
}

const responseFulfilled = response => {
  const res = response.data

  // if the custom code is not 20000, it is judged as an error.
  if (res.code !== 200) {
    Notify({ type: 'danger', message: res.msg + '' });
    //
    return Promise.reject(new Error(res.message || 'Error'))
    //   return Promise.reject(new Error(res.message || 'Error'))
  } else {
    return res
  }
}

const responseRejected = error => {
  console.log('err' + error) // for debug
  Notify({ type: 'danger', message: error + '' });
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(
  requestFulfilled,
  requestRejected
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  responseFulfilled,
  responseRejected
)


/**
 * 不使用base url
 * @type {AxiosInstance}
 */
export const serviceOther = axios.create({
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

// request interceptor
serviceOther.interceptors.request.use(
  requestFulfilled,
  requestRejected
)

// response interceptor
serviceOther.interceptors.response.use(
  responseFulfilled,
  responseRejected
)

export default service
