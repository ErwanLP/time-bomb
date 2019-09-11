const shuffle = require('shuffle-array');

const LOBBY = 'LOBBY';
const IN_GAME = 'IN_GAME';
const FINISHED = 'FINISHED';
const PAUSE = 'PAUSE';
const SECURE_CABLE = 'SECURE_CABLE';
const DEFUSING_CABLE = 'DEFUSING_CABLE';
const BOMB = 'BOMB';
const SHERLOCK = 'SHERLOCK';
const MORIARTY = 'MORIARTY';

module.exports = class Game {

  constructor(uuid, name, userId) {
    this.name = name;
    this.uuid = uuid;
    this.createdDate = new Date();
    this.creator = {
      uuid: userId,
    };
    this.players = [];
    this.playerMessages = [];
    this.MIN_PLAYER_NUMBER = 2;
    this.MAX_PLAYER_NUMBER = 8;
    this.MAX_ROUND_NUMBER = 4;
    this.CARD_PLAYER_NUMBER = 5;
    this.currentPlayerIndex = null;
    this.cardPicked = [];
    this.roundNumber = 0;
    this.numberOfDefuseFound = 0;
    this.bombExploded = false;
    this.state = LOBBY;
  }

  json() {
    return ({
      name: this.name,
      uuid: this.uuid,
      state: this.state,
      createdDate: this.createdDate,
    });
  }

  addPlayer(user) {

    let playerCanAccess = () => {
      return this.players.length < this.MAX_PLAYER_NUMBER;
    };

    if (playerCanAccess()) {
      this.players.push({
        user: user,
        role: null,
        isCreator: this.creator.uuid === user.uuid,
        cards: [],
      });
      if (this.creator.uuid === user.uuid) {
        this.creator = user;
      }

      user.socket.emit('user_join_game_success', JSON.stringify({
        as: this.creator.uuid === user.uuid ? 'creator' : 'player',
        gameId: this.uuid,
        state: this.state,
      }));
      return true;
    } else {
      user.socket.emit('user_join_game_error', JSON.stringify({
        playerLength: this.players.length,
        MAX_PLAYER_NUMBER: this.MAX_PLAYER_NUMBER,
      }));
      return false;
    }
  }

  shuffledCards(cards) {
    let _cards = JSON.parse(JSON.stringify(cards));
    shuffle(_cards);
    return _cards;
  }

  removePlayer(userId) {
    let index = this.players.findIndex(p => p.user.uuid === userId);
    if (index > -1) {
      this.players.splice(index, 1);
    }
  }

  hasUser(user) {
    return this.players.findIndex(p => p.user.uuid === user.uuid) > -1;
  }

  setPause() {
    this.state = PAUSE;
  }

  unsetPause() {
    this.state = IN_GAME;
  }

  setCurrentPlayer(userId) {
    if (userId === null) {
      this.currentPlayerIndex = Math.floor(Math.random() * this.players.length);
    } else {
      this.currentPlayerIndex = this.players.findIndex(
          p => p.user.uuid === userId);
    }
    this.players.forEach((player, index) => {
      player.isCurrentPlayer = index === this.currentPlayerIndex;
    });
  }

  isCurrentPlayer(userId) {
    let player = this.players.find(p => p.user.uuid === userId);
    return player ? player.isCurrentPlayer : false;

  }

  startGame() {
    let canStartGame = () => {
      return LOBBY === this.state && this.players.length >=
          this.MIN_PLAYER_NUMBER;
    };

    if (canStartGame()) {
      this.state = IN_GAME;
      this.setCurrentPlayer(null);
      let roles = this.createListOfRole(this.players.length);
      this.players.forEach((player, index) => {
        player.role = roles[index];
        player.user.socket.emit('game_user_start', JSON.stringify({
          role: player.role,
          gameId: this.uuid,
        }));
      });
      let cards = this.createCards(this.players.length);
      shuffle(cards);
      this.giveCardToUser(cards);
      this.startRound();
    }
  }

  startRound() {
    if (this.roundNumber !== 0) {
      let cards = [];
      this.players.forEach(player => cards = cards.concat(
          player.cards.filter(c => !c.isPicked)));
      shuffle(cards);
      this.giveCardToUser(cards);
      this.playerMessages = [];
    }
    this.roundNumber++;
    this.players.forEach(player => {
      this.setMessage(player.user.uuid,
          {type: 'nbCard', value: player.cards.length});
      player.user.socket.emit('game_user_new_round', JSON.stringify({
        me: {
          uuid: player.user.uuid,
          name: player.user.name,
          cards: this.shuffledCards(player.cards),
        },
        currentPlayer: this.players[this.currentPlayerIndex].user.name,
        numberOfDefuseFound: this.numberOfDefuseFound,
        numberOfDefuseToFind: this.players.length,
        numberOfCardsToPickThisRound: this.players.length,
        numberOfCardPickedThisRound: 0,
        roundNumber: this.roundNumber,
        gameId: this.uuid,
      }));
    });
    this.startNewPlay();
  }

  giveCardToUser(cards) {
    this.players.forEach(user => user.cards = []);
    cards.forEach((card, index) => {
      let userIndex = index % this.players.length;
      this.players[userIndex].cards.push(card);
    });
  }

  startNewPlay() {
    this.players.forEach(player => {
      if (player.isCurrentPlayer) {
        player.user.socket.emit('game_user_play', JSON.stringify({
          players: this.players.map(player => {
            return {
              user: {
                uuid: player.user.uuid,
                name: player.user.name,
              },
              isCurrentPlayer: player.isCurrentPlayer,
              cardsLength: player.cards.filter(c => !c.isPicked).length,
            };
          }),
          myUserId: player.user.uuid,
          gameId: this.uuid,
        }));
      }
    });
  }

  historyOf(userId) {
    let player = this.players.find(p => p.user.uuid === userId);
    return {
      me: {
        uuid: player.user.uuid,
        name: player.user.name,
        cards: this.shuffledCards(player.cards),
      },
      role: player.role,
      currentPlayer: this.players[this.currentPlayerIndex].user.name,
      numberOfDefuseFound: this.numberOfDefuseFound,
      numberOfDefuseToFind: this.players.length,
      numberOfCardsToPickThisRound: this.players.length,
      numberOfCardPickedThisRound: this.cardPicked.length -
      ((this.roundNumber - 1) * this.players.length),
      roundNumber: this.roundNumber,
      gameId: this.uuid,
      playerMessages: this.playerMessages,
    };
  }

  pickCard(userFromId, userToId, index) {
    let playerTo = this.players.find(p => p.user.uuid === userToId);
    let playerFrom = this.players.find(p => p.user.uuid === userFromId);
    if (playerFrom.isCurrentPlayer && playerTo) {
      let card = playerTo.cards.filter(c => !c.isPicked)[index];
      if (card) {
        card.isPicked = true;
        this.setMessage(userToId, {
          type: 'nbCard',
          value: playerTo.cards.filter(c => !c.isPicked).length,
        });
        this.cardPicked.push(card);
        if (card.type === DEFUSING_CABLE) {
          this.numberOfDefuseFound++;
          let nbDefuseFound = this.playerMessages.find(
              m => m.userId === playerTo.user.uuid && m.type ==='nbDefuseFound');
          if (nbDefuseFound) {
            nbDefuseFound.value++;
          } else {
            this.setMessage(userToId,
                {type: 'nbDefuseFound', value: 1});
          }
        }
        if (card.type === BOMB) {
          this.bombExploded = true;
        }
        this.setCurrentPlayer(userToId);
        return card;
      }
    }
  }

  setMessage(userId, message) {
    let player = this.players.find(p => p.user.uuid === userId);
    let playerMessage = this.playerMessages.find(
        m => m.userId === userId && m.type === message.type);
    if (!playerMessage) {
      this.playerMessages.push({
        userId: userId,
        userName: player.user.name,
        type: message.type,
        value: message.value,
        date: new Date(),
      });
    } else {
      playerMessage.value = message.value;
      playerMessage.date = new Date();
    }
  }

  getMessages() {
    return this.playerMessages;
  }

  endGame() {
    this.state = FINISHED;
    let res = {
      gameId: this.uuid,
      sherlock: this.players.filter(p => p.role.type === SHERLOCK).
          map(p => p.user.name),
      moriarty: this.players.filter(p => p.role.type === MORIARTY).
          map(p => p.user.name),
    };
    if (this.numberOfDefuseFound === this.players.length) {
      res.teamWin = 'Sherlock';
      res.cause = 'DEFUSED';
      res.msg = 'The bomb has been defused !';
    } else if (this.roundNumber === 4 && this.isEndOfRound()) {
      res.teamWin = 'Moriarty';
      res.cause = 'NOT_DEFUSED';
      res.msg = 'The bomb has been not defused';
    } else if (this.bombExploded === true) {
      res.teamWin = 'Moriarty';
      res.cause = 'BOMB';
      res.msg = 'The bomb exploded !';
    }
    return res;
  }

  isEndOfRound() {
    return this.cardPicked.length === this.roundNumber * this.players.length;
  }

  isEndOfGame() {
    return (this.roundNumber === this.MAX_ROUND_NUMBER &&
        this.isEndOfRound()) ||
        this.numberOfDefuseFound === this.players.length ||
        this.bombExploded === true;
  }

  createListOfRole(nbOfPlayer) {
    function getNumberOfPlayerInEachTeam() {
      return [Math.round(nbOfPlayer * 2 / 3), Math.ceil(nbOfPlayer / 3)];
    }

    let res = [], nbOfSherlock, nbOfMoriarty;
    [nbOfSherlock, nbOfMoriarty] = getNumberOfPlayerInEachTeam();
    for (let i = 0; i < nbOfSherlock; i++) {
      res.push({
        type: SHERLOCK,
        image: 'sherlock_' + i + '.png',
        label: 'Sherlock',
      });
    }
    for (let i = 0; i < nbOfMoriarty; i++) {
      res.push({
        type: MORIARTY,
        image: 'moriarty_' + i + '.png',
        label: 'Moriarty',
      });
    }
    shuffle(res);
    return res.slice(0, nbOfPlayer);
  }

  createCards(nbOfPlayer) {
    let getNumberOfCableOfEachType = () => {
      const NUMBER_OF_BOMB = 1;
      return [
        (this.CARD_PLAYER_NUMBER * nbOfPlayer) - (nbOfPlayer + NUMBER_OF_BOMB),
        nbOfPlayer,
        NUMBER_OF_BOMB];
    };

    let res = [];
    let [nbOfSecured, nbOfDefusing, nbOfBomb] = getNumberOfCableOfEachType();
    for (let i = 0; i < nbOfSecured; i++) {
      res.push({
        type: SECURE_CABLE,
        label: 'Secure',
        isPicked: false,
      });
    }
    for (let i = 0; i < nbOfDefusing; i++) {
      res.push({
        type: DEFUSING_CABLE,
        label: 'Defusing',
        isPicked: false,
      });
    }
    for (let i = 0; i < nbOfBomb; i++) {
      res.push({
        type: BOMB,
        label: 'Bomb',
        isPicked: false,
      });
    }
    return res;
  }

  hasEnoughPlayer() {
    return this.players.length >= this.MIN_PLAYER_NUMBER;
  }

  iEmpty() {
    return this.players.every(player => !player.user.socket.connected);
  }

  allPlayersAreActives() {
    return this.players.every(player => player.user.socket.connected);
  }
};