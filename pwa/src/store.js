import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    role: null,
    host: null,
    instanceList: [],
    playerList: [],
    canStartGame: false,
    gameIsStart: false,
    cards: [],
    numberOfDefuseFound: 0,
    currentPlayer: '',
    numberOfDefuseToFind: 0,
    roundNumber: 0,
    numberOfCardsToPickThisRound: 0,
    numberOfCardPickedThisRound: 0,
    playLog: [],
    players: [],
    myTurn: false,
    endGameMsg: null,
    error: null,
  },
  mutations: {
    editUser(state, payload) {
      state.user = payload;
    },
    editHost(state, payload) {
      state.host = payload;
    },
    editListInstance(state, payload) {
      state.instanceList = payload;
    },
    editListUser(state, payload) {
      state.playerList = payload;
    },
    editRole(state, payload) {
      state.role = payload;
    },
    canStartGame(state) {
      state.canStartGame = true;
    },
    startGame(state) {
      state.gameIsStart = true;
    },
    editCards(state, payload) {
      state.cards = payload;
    },
    editNumberOfDefuseFound(state, payload) {
      state.numberOfDefuseFound = payload;
    },
    editCurrentPlayer(state, payload) {
      state.currentPlayer = payload;
    },
    editNumberOfDefuseToFind(state, payload) {
      state.numberOfDefuseToFind = payload;
    },
    editRoundNumber(state, payload) {
      state.roundNumber = payload;
    },
    editNumberOfCardsToPickThisRound(state, payload) {
      state.numberOfCardsToPickThisRound = payload;
    },
    editNumberOfCardPickedThisRound(state, payload) {
      state.numberOfCardPickedThisRound = payload;
    },
    pushPlayLog(state, payload) {
      state.playLog.unshift(payload);
    },
    editPlayers(state, payload) {
      state.players = payload;
    },
    editMyTurn(state, payload) {
      state.myTurn = payload;
    },
    editEndGameMsg(state, payload) {
      state.endGameMsg = payload;
    },

  },
  actions: {},
});
