import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import VueSocketIO from 'vue-socket.io'

Vue.config.productionTip = false

const base_url = window.location.origin
let socket_url
if (base_url === 'http://localhost:8080') {
  socket_url = 'http://localhost:3002'
} else {
  socket_url = base_url
}

Vue.use(new VueSocketIO({
  debug: true,
  connection: socket_url,
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
    user_create_success: function () {
    },
  },
  router,
  store,
  render: h => h(App),
}).$mount('#app')
