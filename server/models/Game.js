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
    this.handleNumber = 1
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
    if (this.isStart === false) {
      this.isStart = true
      this.setCurrentPlayer(null)
      this.users.forEach((user, index) => {
        user.role = this.createListOfRole(this.users.length)[index].type
        user.socket.emit('game_user_role', user.role)
      })
      let cards = this.createCards(this.users.length)
      shuffle(cards)
      this.giveCardToUser(cards)
      this.sendInfoToUser()
    }
  }

  endGame () {
    this.isFinish = true
    let res
    if (this.numberOfDefuseFound === this.users) {
      res = 'Sherlock Win'
    } else if (this.handleNumber === 5) {
      res = 'Moriarty win'
    } else if (this.bombExploded === true) {
      res = 'Moriarty win'
    }
    return res
  }

  startNewHandle () {
    let cards = []
    this.handleNumber++
    this.users.forEach(user => cards = cards.concat(user.cards))
    shuffle(cards)
    this.giveCardToUser(cards)
    return this.handleNumber
  }

  giveCardToUser (cards) {
    this.users.forEach(user => user.cards = [])
    cards.forEach((card, index) => {
      let userIndex = index % this.users.length
      this.users[userIndex].cards.push(card)
    })
  }

  sendInfoToUser () {
    this.users.forEach(user => {
      user.socket.emit('game_user_info', JSON.stringify({
        me: {
          uuid: user.uuid,
          name: user.name,
          cards: user.cards,
        },
        currentPlayer: this.users[this.currentPlayerIndex].name,
        numberOfDefuseFound: this.numberOfDefuseFound,
        handleNumber: this.handleNumber,
      }))

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
        }))
      }
      shuffle(user.cards)
    })

  }

  pickCard (userToId, index) {
    let userTo = this.users.find(u => u.uuid === userToId)
    if (userTo) {
      let card = userTo.cards.splice(index, 1)
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

  isEndOfHandle () {
    return this.cardPicked.length === this.handleNumber * this.users.length
  }

  isEndOfGame () {
    return this.handleNumber === 5 || this.numberOfDefuseFound === this.users ||
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