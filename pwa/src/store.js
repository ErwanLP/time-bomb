import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    host: null,
    playerList: [],
  },
  mutations: {
    editUser (state, payload) {
      state.user = payload
    },
    editHost (state, payload) {
      state.host = payload
    },
    editListUser (state, payload) {
      state.playerList = payload.userList
    },

  },
  actions: {},
})
