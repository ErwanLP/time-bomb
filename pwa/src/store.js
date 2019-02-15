import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    role: null,
    host: null,
    instanceList: [],
    playerList: [],
  },
  mutations: {
    editUser (state, payload) {
      state.user = payload
    },
    editHost (state, payload) {
      state.host = payload
    },
    editListInstance (state, payload) {
      state.instanceList = payload
    },
    editListUser (state, payload) {
      state.playerList = payload
    },
    editRole (state, payload) {
      state.role = payload
    },

  },
  actions: {},
})
