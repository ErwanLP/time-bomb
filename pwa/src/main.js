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
    wrong_version: function () {},
    user_create_success: function (data) {
      store.commit('editUser', JSON.parse(data))
    },
  },
  router,
  store,
  render: h => h(App),
}).$mount('#app')
