const state = {
  carData: null,
  index: -1,
  customerData: null,
  setProject:null
}

const mutations = {
  SET_CAR_DATA (state, data) {
    state.carData = data
  },
  SET_CAR_INDEX (state, index) {
    if(index || index >= 0)
      state.index = index
    else
      state.index = -1
  },
  SET_CUSTOMER_DATA (state, data) {
    state.customerData = data
  },
  SET_CUSTOMER_INDEX (state, index) {
    if(index || index >= 0)
    state.index = index
    else
    state.index = -1
  },
  SET_PROJECT(state,data){
    state.setProject = data
  }
}

const actions = {
  setCarData ({commit}, {data, index}) {
    commit('SET_CAR_DATA', data)
    commit('SET_CAR_INDEX', index)
  },
  removeCarData({commit}) {
    commit('SET_CAR_DATA', null, -1)
  },
  setCustomerData ({commit}, {data, index}) {
    commit('SET_CUSTOMER_DATA', data)
    commit('SET_CUSTOMER_INDEX', index)
  },
  removeCustomerData({commit}) {
    commit('SET_CUSTOMER_DATA', null, -1)
  },
  temporaryProjectId({commit},data){
    console.log('data',data)
    commit('SET_PROJECT', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

