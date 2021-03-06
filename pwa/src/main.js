/* eslint-disable no-console */
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
    mutationPrefix: '',
  },
}));

new Vue({
  sockets: {
    connect: function() {
      store.commit('setConnected', 'connect');
      this.$router.push('/');
    },
    reconnecting: function() {
      store.commit('setConnected', 'reconnecting');

    },
    disconnect: function() {
      store.commit('setConnected', 'disconnect');
    },
    connection_success: function(data) {
      let info = JSON.parse(data);
      store.commit('setVersion', info.version);
      localforage.getItem('PLAYER_NAME', (getNameErr, name) => {
        if (getNameErr || !name) {
          this.$socket.emit('user_create', JSON.stringify({}));
        } else {
          localforage.getItem('PLAYER_UUID', (getUuidErr, uuid) => {
            if (getUuidErr || !uuid) {
              this.$socket.emit('user_create', JSON.stringify({}));
            } else {
              this.$socket.emit('user_create',
                  JSON.stringify({name: name, uuid: uuid}));
            }
          });
        }
      });
    },
    user_list_success: function(data) {
      store.commit('editListUser', JSON.parse(data));
    },
    user_delete_success: function() {
      this.$router.push('/admin/users');
    },
    user_create_success: function(data) {
      let info = JSON.parse(data);
      store.commit('editUser', info);
      localforage.setItem('PLAYER_NAME', info.name, () => {
      });
      localforage.setItem('PLAYER_UUID', info.uuid, () => {
      });
    },
    game_list_success: function(data) {
      store.commit('editListInstance', JSON.parse(data));
    },
    game_delete_success: function() {
      this.$router.push('/admin/games');
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
    user_join_game_error: function(err) {
      store.commit('displayAlert', JSON.parse(err));

    },
    game_broadcast_pause: function(data) {
      store.commit('setPause', JSON.parse(data));
    },
    game_user_resume: function(data) {
      let info = JSON.parse(data);
      store.commit('userResume', info);
      this.$router.push('/instance/' + info.gameId + '/play');
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
        players: info.players,
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
      store.commit('displayAlert', JSON.parse(err));
    },
    custom_error: function(err) {
      store.commit('displayAlert', JSON.parse(err));
    },
    create_user_error: function(err) {
      store.commit('displayAlert', JSON.parse(err));
      this.$router.push('/settings');
    },
  },
  router,
  store,
  render: h => h(App),
}).$mount('#app');
