import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    host: null,
  },
  mutations: {
    editUser (state, payload) {
      state.user = payload
    },
    editHost (state, payload) {
      state.host = payload
    },
  },
  actions: {},
})
