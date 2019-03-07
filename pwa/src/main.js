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
    connect: function() {},
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
      let info = JSON.parse(data);
      store.commit('editListInstance', info);
    },
    game_create_success: function(data) {
      let info = JSON.parse(data);
      this.$socket.emit('game_join', info.uuid);
    },
    user_join_game_success: function(data) {
      let info = JSON.parse(data);
      this.$router.push('/instance/' + info.gameId + '/lobby');
    },
    user_join_game_error: function(err) {
      throw err;
    },
    game_broadcast_list_user: function(data) {
      let info = JSON.parse(data);
      store.commit('editListUser', info.userList);
    },
    game_ask_start: function() {
      store.commit('canStartGame');
    },
    game_user_start: function(data) {
      let info = JSON.parse(data);
      store.commit('startGame');
      store.commit('editRole', info.role);
      this.$router.push('/instance/' + info.gameId + '/play');
    },
    game_user_new_round: function(data) {
      let info = JSON.parse(data);
      store.commit('editCards', info.me.cards);
      store.commit('editNumberOfDefuseFound', info.numberOfDefuseFound);
      store.commit('editCurrentPlayer', info.currentPlayer);
      store.commit('editNumberOfDefuseToFind', info.numberOfDefuseToFind);
      store.commit('editRoundNumber', info.roundNumber);
    },
    game_broadcast_info: function(data) {
      let info = JSON.parse(data);
      store.commit('editCurrentPlayer', info.currentPlayer);
      store.commit('editNumberOfDefuseFound', info.numberOfDefuseFound);
      store.commit('editNumberOfDefuseToFind', info.numberOfDefuseToFind);
      store.commit('editNumberOfCardsToPickThisRound',
          info.numberOfCardsToPickThisRound);
      store.commit('editNumberOfCardPickedThisRound',
          info.numberOfCardPickedThisRound);
      store.commit('pushPlayLog', {
        card: info.card,
        userFromName: info.userFromName,
        userToName: info.userToName,
      });

    },
    game_user_play: function(data) {
      let info = JSON.parse(data);
      store.commit('editPlayers', info.users);
      store.commit('editMyTurn', true);
    },
    game_broadcast_end: function(data) {
      let info = JSON.parse(data);
      let str = info.teamWin + ' Win - ' + info.cause;
      store.commit('editEndGameMsg', str);
    },
    game_broadcast_stop_error: function(data) {
      store.commit('editEndGameMsg', data);
    },
    wrong_version: function(data) {
      let info = JSON.parse(data);
      throw info;
    },
    error: function(err) {
      throw err;
    },
    disconnect: function(err) {
      throw err;
    },
  },
  router,
  store,
  render: h => h(App),
}).$mount('#app');
