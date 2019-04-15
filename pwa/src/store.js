import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    host: null,
    version: null,
    instanceList: [],
    error: null,
    instanceJoined: {
      '0': {
        role: {
          type: 'MORIARTY',
          image: 'moriarty_0.png',
          label: 'Moriarty'
        },
        cards: [
          {type: 'SECURE_CABLE'},
          {type: 'DEFUSING'},
          {type: 'SECURE_CABLE'},
          {type: 'BOMB'},
          {type: 'SECURE_CABLE'}
        ],
        playLog: [
          {
            type: 'NEW_ROUND',
            roundNumber: 1
          },
          {
            type: 'NEW_PICK',
            userFromName: 'tata',
            userToName: 'toto',
            card: {type: 'DEFUSING_CABLE'}
          },
          {
            type: 'NEW_PICK',
            userFromName: 'tata',
            userToName: 'toto',
            card: {type: 'SECURE_CABLE'}
          },
          {
            type: 'NEW_PICK',
            userFromName: 'tata',
            userToName: 'toto',
            card: {type: 'DEFUSING_CABLE'}
          },
          {
            type: 'NEW_ROUND',
            roundNumber: 2
          },
          {
            type: 'NEW_PICK',
            userFromName: 'tata',
            userToName: 'toto',
            card: {type: 'SECURE_CABLE'}
          },
          {
            type: 'NEW_PICK',
            userFromName: 'tata',
            userToName: 'toto',
            card: {type: 'DEFUSING_CABLE'}
          },
          {
            type: 'NEW_PICK',
            userFromName: 'tata',
            userToName: 'toto',
            card: {type: 'DEFUSING_CABLE'}
          },
          {
            type: 'NEW_PICK',
            userFromName: 'tata',
            userToName: 'toto',
            card: {type: 'SECURE_CABLE'}
          },
          {
            type: 'NEW_ROUND',
            roundNumber: 3
          },
          {
            type: 'NEW_PICK',
            userFromName: 'toto',
            userToName: 'toto',
            card: {type: 'BOMB'}
          }
        ],
        numberOfCardPickedThisRound: 4,
        numberOfCardsToPickThisRound: 6,
        numberOfDefuseFound: 2,
        numberOfDefuseToFind: 4,
        roundNumber: 2,
        currentPlayer: 'toto',
        dialogEndGame: false,
        dialogPause: false,
        dialogPauseMsg: 'toto',
        endGame: {},
        myTurn: true,
        players: [
          {

            user: {name: 'toto', uuid: 11},
            cardsLength: 5,
            isCurrentPlayer: true
          },
          {

            user: {name: 'toto 1', uuid: 12},
            cardsLength: 3
          },
          {

            user: {name: 'toto 2', uuid: 13},
            cardsLength: 4
          },
          {

            user: {name: 'toto 3', uuid: 14},
            cardsLength: 5
          },
          {

            user: {name: 'toto 4', uuid: 15},
            cardsLength: 6
          }
        ]

      }
    }
  },
  mutations: {
    setVersion(state, payload) {
      state.version = payload;
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
            dialogPause: false,
            dialogPauseMsg: null,
            endGame: false
          }
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
        roundNumber: payload.roundNumber
      });
    },
    newPick(state, payload) {
      state.instanceJoined[payload.gameId].currentPlayer = payload.currentPlayer;
      state.instanceJoined[payload.gameId].numberOfDefuseFound = payload.numberOfDefuseFound;
      state.instanceJoined[payload.gameId].numberOfDefuseToFind = payload.numberOfDefuseToFind;
      state.instanceJoined[payload.gameId].numberOfCardsToPickThisRound = payload.numberOfCardsToPickThisRound;
      state.instanceJoined[payload.gameId].numberOfCardPickedThisRound = payload.numberOfCardPickedThisRound;
      state.instanceJoined[payload.gameId].playLog.unshift({
        type: 'NEW_PICK',
        card: payload.card,
        userFromName: payload.userFromName,
        userToName: payload.userToName
      });

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
            dialogPause: false,
            dialogPauseMsg: null,
            endGame: false
          }
        };
      }
    },
    unSetPause(state, payload) {
      state.instanceJoined[payload.gameId].dialogPause = false;
      state.instanceJoined[payload.gameId].dialogPauseMsg = null;
    },
    endGame(state, payload) {
      state.instanceJoined[payload.gameId].dialogEndGame = true;
      state.instanceJoined[payload.gameId].endGame = payload;
    }
  },
  actions: {}
});
