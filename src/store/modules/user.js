import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import {login, setBookObj } from '@/api/login'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  wordbook: null, // 字典集合
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_WORDBOOK: (state, wordbook) => {
    state.wordbook = wordbook
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data && data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  //
  // // get user info
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     getInfo(state.token).then(response => {
  //       const { data } = response
  //
  //       if (!data) {
  //         reject('Verification failed, please Login again.')
  //       }
  //
  //       const { name, avatar } = data
  //
  //       commit('SET_NAME', name)
  //       commit('SET_AVATAR', avatar)
  //       resolve(data)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },
  //
  // // user logout
  // logout({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     logout(state.token).then(() => {
  //       commit('SET_TOKEN', '')
  //       removeToken()
  //       resetRouter()
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },
  //
  // // remove token
  // resetToken({ commit }) {
  //   return new Promise(resolve => {
  //     commit('SET_TOKEN', '')
  //     removeToken()
  //     resolve()
  //   })
  // }
  getWordBook({ commit }) {
    const list = [
      "certificateType", //证件类型
      "marriage_type", //婚姻状况
      "DegreeOfEducation", //文化程度
      "unit_Property", //单位性质
      "children", //子女情况
      "RELATION_SHIP", //与申请人关系.
      "income_person", //收入人
      "OccupationalStatus", //职业状况
      "belong_industry", //行业领域
      "site_Properties", //场地性质
      "income_prove", //收入佐证
      "Shares", //股份构成
      "Property_nature", //房产性质
      "Property_area", //房产区域
      "Purchase_method", //购买方式
      "relation_Cus", //担保人与客户的关系
      "school_Situation", //上学情况
      "kinship_type", //第一联系人类型
      "IncomeStatus", //	月固定收入状况
      "car_use", //车辆用途
      "provider_type", //提供人类型
      "counter_Guarantee_Status", // 反担保状况
      "car_type", // 车辆类别
      "car_type2", // 车辆类别2
      "car_nature", // 车辆性质
      "Margin_Ratio", // 保证金比例
      "vehicle_specifications", // 车辆规格
      "CAR_SOURCE", // 车辆来源
      "ON_HOUSE_TYPE", // 上户类型
      "DOWN_PAYMENT", // 首付比例
      "business_mode", // 业务模式
      "yes_no", // 是否
      "apply_status", // 报单流程状态
      "is_Access_Car", // 是否准入
      "document_type", // 文档类型
      "cu_credit_status", //征信调查状态
      "credit_result", //征信调查状态
      "credit_object_type", //征信对象类型
      "business_type",//流程类型
      "proj_status", // 项目状态
      "credit_result", // 征信状态
    ]
    return new Promise((resolve, reject) => {
      setBookObj(list).then(response => {
        const { data } = response
        commit('SET_WORDBOOK', data )
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

