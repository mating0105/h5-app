const state = {
  carData: null,
  index: -1
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
}

const actions = {
  setCarData ({commit}, {data, index}) {
    commit('SET_CAR_DATA', data)
    commit('SET_CAR_INDEX', index)
  },
  removeCarData({commit}) {
    commit('SET_CAR_DATA', null, -1)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
