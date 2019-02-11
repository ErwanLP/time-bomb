import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import VueSocketIO from 'vue-socket.io'

Vue.config.productionTip = false

Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://localhost:3002',
  vuex: {
    store,
    actionPrefix: '',
    mutationPrefix: '',
  },
}))

new Vue({
  sockets: {
    connect: function () {},
    wrong_version: function (data) {},
    user_create_success: function (data) {
    },
  },
  router,
  store,
  render: h => h(App),
}).$mount('#app')
