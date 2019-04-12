import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import VueSocketIO from 'vue-socket.io';
import localforage from 'localforage';

Vue.config.productionTip = false;

store.commit('editHost', window.location.origin === 'http://localhost:8080'
    ? 'http://localhost:3002'
    : window.location.origin);

Vue.use(new VueSocketIO({
  debug: true,
  connection: store.state.host,
  vuex: {
    store,
    actionPrefix: '',
    mutationPrefix: ''
  }
}));

new Vue({
  sockets: {
    connect: function() {
      this.$router.push('/');
    },
    reconnecting: function() {
      this.$router.push('/');
    },
    disconnect: function() {
      this.$router.push('/');
    },
    connection_success: function() {
      localforage.getItem('PLAYER_NAME', (err, value) => {
        if (err || !value) {
          this.$socket.emit('user_create');
        } else {
          this.$socket.emit('user_create', value);
        }
      });
    },
    user_create_success: function(data) {
      store.commit('editUser', JSON.parse(data));
    },
    game_list_success: function(data) {
      store.commit('editListInstance', JSON.parse(data));
    },
    game_create_success: function(data) {
      let info = JSON.parse(data);
      this.$socket.emit('game_join', info.uuid);
    },
    user_join_game_success: function(data) {
      let info = JSON.parse(data);
      store.commit('createJoinedInstance', info.gameId);
      if (info.state === 'LOBBY') {
        this.$router.push('/instance/' + info.gameId + '/lobby');
      }
    },
    game_broadcast_pause: function(data) {
      store.commit('setPause', JSON.parse(data));
    },
    game_user_resume: function(data) {
      store.commit('userResume', JSON.parse(data));
    },
    game_broadcast_resume: function(data) {
      let info = JSON.parse(data);
      store.commit('unSetPause', info);
      this.$router.push('/instance/' + info.gameId + '/play');
    },
    game_broadcast_list_player: function(data) {
      store.commit('editListPlayer', JSON.parse(data));
    },
    game_ask_start: function(data) {
      store.commit('canStartGame', JSON.parse(data));
    },
    game_user_start: function(data) {
      let info = JSON.parse(data);
      store.commit('startGame', info);
      store.commit('editRole', info);
      this.$router.push('/instance/' + info.gameId + '/play');
    },
    game_user_new_round: function(data) {
      store.commit('newRound', JSON.parse(data));
    },
    game_broadcast_info: function(data) {
      store.commit('newPick', JSON.parse(data));
    },
    game_user_play: function(data) {
      let info = JSON.parse(data);
      store.commit('myTurn', {
        gameId: info.gameId,
        b: true,
        players: info.players
      });
    },
    game_broadcast_message: function(data) {
      store.commit('setMessages', JSON.parse(data));
    },
    game_broadcast_end: function(data) {
      store.commit('endGame', JSON.parse(data));
    },
    wrong_version: function(err) {
      throw err;
    },
    error: function(err) {
      throw err;
    }
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app');
