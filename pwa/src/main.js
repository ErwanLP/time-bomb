import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import VueSocketIO from 'vue-socket.io'

Vue.config.productionTip = false

store.commit('editHost', window.location.origin === 'http://localhost:8080'
  ? 'http://localhost:3002'
  : window.location.origin)

Vue.use(new VueSocketIO({
  debug: true,
  connection: store.state.host,
  vuex: {
    store,
    actionPrefix: '',
    mutationPrefix: '',
  },
}))

new Vue({
  sockets: {
    connect: function () {},
    user_create_success: function (data) {
      store.commit('editUser', JSON.parse(data))
    },
    game_list_success: function (data) {
      let info = JSON.parse(data)
      store.commit('editListInstance', info)
    },
    game_create_success: function (data) {
      let info = JSON.parse(data)
      this.$socket.emit('game_join', info.uuid)
    },
    user_join_game_success: function (data) {
      let info = JSON.parse(data)
      this.$router.push('/instance/' + info.gameId + '/lobby')
    },
    user_join_game_error: function (err) {
      console.error(err)
    },
    game_broadcast_list_user: function (data) {
      let info = JSON.parse(data)
      store.commit('editListUser', info.userList)
    },
    game_user_start: function (data) {
      let info = JSON.parse(data)
      store.commit('editRole', info.role)
      this.$router.push('/instance/' + info.gameId + '/play')
    },
    game_user_new_round: function (data) {
      let info = JSON.parse(data)
      console.log(info)
    },
    game_broadcast_info: function (data) {
      let info = JSON.parse(data)
      console.log(info)
    },
    game_user_play: function (data) {
      let info = JSON.parse(data)
      console.log(info)
    },
    game_broadcast_end: function (data) {
      let info = JSON.parse(data)
      console.log(info)
    },
    game_broadcast_stop_error: function (data) {
      let info = JSON.parse(data)
      console.log(info)
    },
    wrong_version: function (data) {
      let info = JSON.parse(data)
      console.log(info)
    },
    error: function (err) {
      console.error(err)
    },
    disconnect: function (err) {
      console.error(err)
    },
  },
  router,
  store,
  render: h => h(App),
}).$mount('#app')
