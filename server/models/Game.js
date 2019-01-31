var shuffle = require('shuffle-array')

module.exports = class Game {

  constructor (uuid, name, userId) {
    this.name = name
    this.uuid = uuid
    this.creationDate = new Date()
    this.creator = {
      uuid: userId,
    }
    this.users = []
    this.isStart = false
    this.minPlayer = 2
    this.maxPlayer = 8
    this.currentPlayerIndex = null
    this.cardPicked = []
    this.roundNumber = 0
    this.numberOfDefuseFound = 0
    this.isFinish = false
    this.bombExploded = false
  }

  addUser (user, socket) {
    // TODO check unic name in users
    if (this.isStart === false && this.users.length < this.maxPlayer) {
      socket.join(this.uuid)
      this.users.push({
        uuid: user.uuid,
        name: user.name,
        role: null,
        socket: socket,
        isCreator: this.creator.uuid === user.uuid,
      })
      if (this.creator.uuid === user.uuid) {
        this.creator.socket = socket
      }
      socket.emit('join_game_success', 'Success to connect to lobby as ' +
        (this.creator.uuid === user.uuid ? 'creator' : 'player'))
    }
  }

  removePlayer (userId) {
    let index = this.users.findIndex(u => u.uuid === userId)
    if (index > -1) {
      this.users.splice(index, 1)
    }
  }

  setCurrentPlayer (userId) {
    if (userId === null) {
      this.currentPlayerIndex = Math.floor(Math.random() * this.users.length)
      // returns a random integer from 0 to 99
    } else {
      this.currentPlayerIndex = this.users.findIndex(u => u.uuid === userId)
    }
    this.users.forEach((user, index) => {
      user.isCurrentPlayer = index === this.currentPlayerIndex
    })
  }

  startGame () {
    if (this.isStart === false && this.users.length >= this.minPlayer) {
      this.isStart = true
      this.setCurrentPlayer(null)
      let roles = this.createListOfRole(this.users.length)
      this.users.forEach((user, index) => {
        user.role = roles[index].type
        user.socket.emit('game_user_start', user.role)
      })
      let cards = this.createCards(this.users.length)
      shuffle(cards)
      this.giveCardToUser(cards)
      this.startRound()
    }
  }

  startRound () {
    if (this.roundNumber !== 0) {
      let cards = []
      this.users.forEach(user => cards = cards.concat(user.cards))
      shuffle(cards)
      this.giveCardToUser(cards)
    }
    this.roundNumber++
    this.users.forEach(user => {
      user.socket.emit('game_user_new_round', JSON.stringify({
        me: {
          uuid: user.uuid,
          name: user.name,
          cards: user.cards,
        },
        currentPlayer: this.users[this.currentPlayerIndex].name,
        numberOfDefuseFound: this.numberOfDefuseFound,
        roundNumber: this.roundNumber,
      }))
      shuffle(user.cards)
    })
    this.startNewPlay()
  }

  giveCardToUser (cards) {
    this.users.forEach(user => user.cards = [])
    cards.forEach((card, index) => {
      let userIndex = index % this.users.length
      this.users[userIndex].cards.push(card)
    })
  }

  startNewPlay () {
    this.users.forEach(user => {
      if (user.isCurrentPlayer) {
        user.socket.emit('game_user_play', JSON.stringify({
          users: this.users.map(user => {
            return {
              uuid: user.uuid,
              name: user.name,
              isCurrentPlayer: user.isCurrentPlayer,
              cardsLength: user.cards.length,
            }
          }),
          myUserId: user.uuid,
          gameId: this.uuid,
        }))
      }
    })

  }

  pickCard (userToId, index) {
    let userTo = this.users.find(u => u.uuid === userToId)
    if (userTo) {
      let card = userTo.cards.splice(index, 1)[0]
      this.cardPicked.push(card)
      if (card.type === 'Defusing') {
        this.numberOfDefuseFound++
      }
      if (card.type === 'Bomb') {
        this.bombExploded = true
      }
      this.setCurrentPlayer(userToId)
      return card
    }
  }

  endGame () {
    this.isFinish = true
    let res
    if (this.numberOfDefuseFound === this.users.length) {
      res = 'Sherlock Win'
    } else if (this.roundNumber === 4 && this.isEndOfRound()) {
      res = 'Moriarty win'
    } else if (this.bombExploded === true) {
      res = 'Moriarty win'
    }
    return res
  }

  isEndOfRound () {
    return this.cardPicked.length === this.roundNumber * this.users.length
  }

  isEndOfGame () {
    return (this.roundNumber === 4 && this.isEndOfRound()) ||
      this.numberOfDefuseFound === this.users.length ||
      this.bombExploded === true
  }

  createListOfRole (nbOfPlayer) {
    function getNumberOfPlayerInEachTeam () {
      if (nbOfPlayer === 2) return [1, 1]
      if (nbOfPlayer === 3) return [2, 1]
      if (nbOfPlayer === 4 || nbOfPlayer === 5) return [3, 2]
      if (nbOfPlayer === 6) return [4, 2]
      if (nbOfPlayer === 7 || nbOfPlayer === 8) return [6, 3]
      throw 'number of player incorrect'
    }

    let res = [], nbOfSherlock, nbOfMoriarty;
    [nbOfSherlock, nbOfMoriarty] = getNumberOfPlayerInEachTeam()
    for (let i = 0; i < nbOfSherlock; i++) {
      res.push({
        type: 'Sherlock',
      })
    }
    for (let i = 0; i < nbOfMoriarty; i++) {
      res.push({
        type: 'Moriarty',
      })
    }
    shuffle(res)
    return res.slice(0, nbOfPlayer)
  }

  createCards (nbOfPlayer) {
    function getNumberOfCableOfEachType () {
      if (nbOfPlayer === 2) return [7, 2, 1]
      if (nbOfPlayer === 3) return [11, 3, 1]
      if (nbOfPlayer === 4) return [15, 4, 1]
      if (nbOfPlayer === 5) return [19, 5, 1]
      if (nbOfPlayer === 6) return [23, 6, 1]
      if (nbOfPlayer === 7) return [27, 7, 1]
      if (nbOfPlayer === 8) return [31, 8, 1]
      throw 'number of player incorrect'
    }

    let res = [], nbOfSecured, nbOfDefusing, nbOfBomb;
    [nbOfSecured, nbOfDefusing, nbOfBomb] = getNumberOfCableOfEachType()
    for (let i = 0; i < nbOfSecured; i++) {
      res.push({
        type: 'Securised',
      })
    }
    for (let i = 0; i < nbOfDefusing; i++) {
      res.push({
        type: 'Defusing',
      })
    }
    for (let i = 0; i < nbOfBomb; i++) {
      res.push({
        type: 'Bomb',
      })
    }
    return res
  }

  hasEnoughPlayer () {
    return this.users.length >= this.minPlayer
  }
}