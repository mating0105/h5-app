import Vue from 'vue'
import './rem'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import 'vant/lib/index.css';
import mixins from "@/mixins/common";
Vue.mixin(mixins);

import Bridge from './utils/JSbridge'
Vue.prototype.$bridge = Bridge;
// Vue.prototype.$prefixurl = 'http://172.16.10.5:10004/#/';//测试gps
Vue.prototype.$prefixurl = 'http://xhh5.wwvas.com/#/';// 正式gps
// Vue.prototype.$prefixurl = 'http://192.168.50.55:8089/#/';//
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

import { mockXHR } from '../mock'

if (process.env.NODE_ENV === 'production') {
  mockXHR()
}

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
