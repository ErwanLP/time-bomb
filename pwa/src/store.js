import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    host: null,
    isConnected: 'disconnect',
    version: null,
    instanceList: [],
    userList: [],
    error: {
      type: 'info',
      displayed: false,
      msg: '',
    },
    instanceJoined: {
      '0': {
        role: {
          type: 'MORIARTY',
          image: 'moriarty_0.png',
          label: 'Moriarty',
        },
        cards: [
          {type: 'SECURE_CABLE', isPicked: true},
          {type: 'DEFUSING_CABLE'},
          {type: 'SECURE_CABLE'},
          {type: 'BOMB'},
          {type: 'SECURE_CABLE'},
        ],
        playLog: [
          {
            type: 'NEW_ROUND',
            roundNumber: 1,
          },
          {
            type: 'NEW_PICK',
            userFromName: 'tata',
            userToName: 'toto',
            card: {type: 'DEFUSING_CABLE'},
          },
          {
            type: 'NEW_PICK',
            userFromName: 'tata',
            userToName: 'toto',
            card: {type: 'SECURE_CABLE'},
          },
          {
            type: 'NEW_PICK',
            userFromName: 'tata',
            userToName: 'toto',
            card: {type: 'DEFUSING_CABLE'},
          },
          {
            type: 'NEW_ROUND',
            roundNumber: 2,
          },
          {
            type: 'NEW_PICK',
            userFromName: 'tata',
            userToName: 'toto',
            card: {type: 'SECURE_CABLE'},
          },
          {
            type: 'NEW_PICK',
            userFromName: 'tata',
            userToName: 'toto',
            card: {type: 'DEFUSING_CABLE'},
          },
          {
            type: 'NEW_PICK',
            userFromName: 'tata',
            userToName: 'toto',
            card: {type: 'DEFUSING_CABLE'},
          },
          {
            type: 'NEW_PICK',
            userFromName: 'tata',
            userToName: 'toto',
            card: {type: 'SECURE_CABLE'},
          },
          {
            type: 'NEW_ROUND',
            roundNumber: 3,
          },
          {
            type: 'NEW_PICK',
            userFromName: 'toto',
            userToName: 'toto',
            card: {type: 'BOMB'},
          },
        ],
        numberOfCardPickedThisRound: 4,
        numberOfCardsToPickThisRound: 6,
        numberOfDefuseFound: 2,
        numberOfDefuseToFind: 4,
        roundNumber: 2,
        currentPlayer: 'Erwan',
        dialogEndGame: false,
        dialogPause: false,
        dialogPauseMsg: '',
        dialogPickCard: false,
        dialogPickCardType: {type: 'DEFUSING_CABLE'},
        dialogPickCardPlayerName: 'Erwan',
        dialogNewRound: false,
        endGame: {
          teamWin : 'Sherlock',
          cause : 'DEFUSED',
          msg : 'The bomb has been defused',
        },
        myTurn: true,
        players: [
          {

            user: {name: 'Erwan', uuid: 11},
            cardsLength: 5,
            isCurrentPlayer: true,
          },
          {

            user: {name: 'Camille', uuid: 12},
            cardsLength: 3,
          },
          {

            user: {name: 'Nicolas', uuid: 13},
            cardsLength: 4,
          },
          {

            user: {name: 'Paul', uuid: 14},
            cardsLength: 5,
          },
          {

            user: {name: 'Lionel', uuid: 15},
            cardsLength: 6,
          },
        ],
        playerMessages: [
          {userId: 11, userName: 'Erwan', type: 'mood', value: 128520},
          {userId: 11, userName: 'Erwan', type: 'bomb', value: true},
          {userId: 12, userName: 'Camille', type: 'defusing', value: 0},
          {userId: 12, userName: 'Camille', type: 'bomb', value: true},
          {userId: 13, userName: 'Nicolas', type: 'defusing', value: 3},
          {userId: 13, userName: 'Nicolas', type: 'bomb', value: false},
          {userId: 11, userName: 'Erwan', type: 'nbCard', value: 5},
          {userId: 12, userName: 'Camille', type: 'nbCard', value: 3},
          {userId: 12, userName: 'Camille', type: 'nbDefuseFound', value: 2},
          {userId: 11, userName: 'Erwan', type: 'nbDefuseFound', value: 1},
          {userId: 11, userName: 'Erwan', type: 'charge', value: 12},
        ],

      },
    },
  },
  mutations: {
    setVersion(state, payload) {
      state.version = payload;
    },
    setConnected(state, payload) {
      state.isConnected = payload;
    },
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
      state.userList = payload;
    },
    displayAlert(state, payload) {
      state.error.msg = payload.msg;
      state.error.type = payload.type || 'error';
      state.error.displayed = true;
      setTimeout(function() {
        state.error.displayed = false;
      }, 2000);

    },
    createJoinedInstance(state, payload) {
      if (!state.instanceJoined[payload]) {
        state.instanceJoined = {
          ...state.instanceJoined, [payload]: {
            playerNameList: [],
            players: [],
            playerMessages: [],
            canStartGame: false,
            role: null,
            gameIsStart: false,
            cards: [],
            numberOfDefuseFound: null,
            currentPlayer: null,
            numberOfDefuseToFind: null,
            roundNumber: null,
            numberOfCardsToPickThisRound: null,
            numberOfCardPickedThisRound: null,
            playLog: [],
            myTurn: false,
            dialogEndGame: false,
            dialogPickCard: false,
            dialogPickCardType: null,
            dialogPause: false,
            dialogPauseMsg: null,
            dialogNewRound: false,
            dialogPickCardPlayerName: '',
            endGame: false,
          },
        };
      }
    },
    editListPlayer(state, payload) {
      state.instanceJoined[payload.gameId].playerNameList = payload.playerList;
    },
    canStartGame(state, payload) {
      state.instanceJoined[payload.gameId].canStartGame = true;
    },
    startGame(state, payload) {
      state.instanceJoined[payload.gameId].gameIsStart = true;
    },
    editRole(state, payload) {
      state.instanceJoined[payload.gameId].role = payload.role;
    },
    newRound(state, payload) {
      state.instanceJoined[payload.gameId].cards = payload.me.cards;
      state.instanceJoined[payload.gameId].numberOfDefuseFound = payload.numberOfDefuseFound;
      state.instanceJoined[payload.gameId].currentPlayer = payload.currentPlayer;
      state.instanceJoined[payload.gameId].numberOfDefuseToFind = payload.numberOfDefuseToFind;
      state.instanceJoined[payload.gameId].roundNumber = payload.roundNumber;
      state.instanceJoined[payload.gameId].numberOfCardsToPickThisRound = payload.numberOfCardsToPickThisRound;
      state.instanceJoined[payload.gameId].numberOfCardPickedThisRound = payload.numberOfCardPickedThisRound;
      state.instanceJoined[payload.gameId].playLog.unshift({
        type: 'NEW_ROUND',
        roundNumber: payload.roundNumber,
      });
      if (payload.roundNumber > 1) {
        setTimeout(function() {
          state.instanceJoined[payload.gameId].dialogNewRound = true;
        }, 2500);
      } else {
        state.instanceJoined[payload.gameId].dialogNewRound = true;
      }

    },
    newPick(state, payload) {
      state.instanceJoined[payload.gameId].cards = payload.me.cards;
      state.instanceJoined[payload.gameId].currentPlayer = payload.currentPlayer;
      state.instanceJoined[payload.gameId].numberOfDefuseFound = payload.numberOfDefuseFound;
      state.instanceJoined[payload.gameId].numberOfDefuseToFind = payload.numberOfDefuseToFind;
      state.instanceJoined[payload.gameId].numberOfCardsToPickThisRound = payload.numberOfCardsToPickThisRound;
      state.instanceJoined[payload.gameId].numberOfCardPickedThisRound = payload.numberOfCardPickedThisRound;
      state.instanceJoined[payload.gameId].dialogPickCardType = payload.card;
      state.instanceJoined[payload.gameId].dialogPickCardPlayerName = payload.userToName;
      state.instanceJoined[payload.gameId].dialogPickCard = true;
      state.instanceJoined[payload.gameId].playLog.unshift({
        type: 'NEW_PICK',
        card: payload.card,
        userFromName: payload.userFromName,
        userToName: payload.userToName,
      });
      setTimeout(function() {
        state.instanceJoined[payload.gameId].dialogPickCard = false;
      }, 2000);

    },
    myTurn(state, payload) {
      state.instanceJoined[payload.gameId].myTurn = payload.b;
      state.instanceJoined[payload.gameId].players = payload.players;
    },
    setMessages(state, payload) {
      state.instanceJoined[payload.gameId].playerMessages = payload.playerMessages;
    },
    setPause(state, payload) {
      state.instanceJoined[payload.gameId].dialogPause = true;
      state.instanceJoined[payload.gameId].dialogPauseMsg = payload.label;
    },
    userResume(state, payload) {
      if (!state.instanceJoined[payload.gameId]) {
        state.instanceJoined = {
          ...state.instanceJoined, [payload.gameId]: {
            players: [],
            role: payload.role,
            playerMessages: payload.playerMessages,
            gameIsStart: true,
            cards: payload.me.cards,
            numberOfDefuseFound: payload.numberOfDefuseFound,
            currentPlayer: payload.currentPlayer,
            numberOfDefuseToFind: payload.numberOfDefuseToFind,
            roundNumber: payload.roundNumber,
            numberOfCardsToPickThisRound: payload.numberOfCardsToPickThisRound,
            numberOfCardPickedThisRound: payload.numberOfCardPickedThisRound,
            playLog: [],
            myTurn: false,
            dialogEndGame: false,
            dialogPickCard: false,
            dialogPickCardType: null,
            dialogPause: false,
            dialogPauseMsg: null,
            dialogNewRound: false,
            endGame: false,
          },
        };
      }
    },
    unSetPause(state, payload) {
      state.instanceJoined[payload.gameId].dialogPickCard = false;
      state.instanceJoined[payload.gameId].dialogPause = false;
      state.instanceJoined[payload.gameId].dialogPauseMsg = null;
    },
    endGame(state, payload) {
      state.instanceJoined[payload.gameId].dialogPickCard = false;
      state.instanceJoined[payload.gameId].dialogEndGame = true;
      state.instanceJoined[payload.gameId].endGame = payload;
    },
    editDialogPickCard(state, payload) {
      state.instanceJoined[payload.gameId].dialogPickCard = payload.value;
    },
    editDialogNewRound(state, payload) {
      state.instanceJoined[payload.gameId].dialogNewRound = payload.value;
    },
    editDialogEndGame(state, payload) {
      state.instanceJoined[payload.gameId].dialogEndGame = payload.value;
    },
  },
  actions: {},
});
