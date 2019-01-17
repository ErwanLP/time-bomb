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
  }

  addUser (user, socket) {
    if (this.isStart === false && this.users.length < this.maxPlayer) {
      socket.join(this.uuid)
      this.users.push({
        uuid: user.uuid,
        name: user.name,
        role: user.null,
        socket: socket,
        cards: [],
        isCreator: this.creator.uuid === user.uuid,
      })
      if (this.creator.uuid === user.uuid) {
        this.creator.socket = socket
      }
      socket.emit('join_game_success', 'Success to connect to lobby as ' +
        (this.creator.uuid === user.uuid ? 'creator' : 'player'))
    }
  }

  startGame () {
    return new Promise((resolve, reject) => {
      if (this.isStart === false) {
        this.isStart = true
        let roles = this.createListOfRole(this.users.length)
        this.users.forEach((user, index) => {
          user.role = roles[index].type
        })
        let cards = this.createListOfCable(this.users.length)
        cards.forEach((card, index) => {
          let userIndex = index % this.users.length
          this.users[userIndex].cards.push(card)
        })
        this.users.forEach((user, index) => {
          user.socket.emit('game_info_user', JSON.stringify({
            uuid: user.uuid,
            name: user.name,
            cards: user.cards,
            role: user.role,
          }))
        })
        resolve()
      } else {
        reject()
      }
    })
  }

  createListOfRole (nbOfPlayer) {
    function getNumberOfPlayerInEachTeam () {
      if (nbOfPlayer === 2) return [1, 1]
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

  createListOfCable (nbOfPlayer) {
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
    shuffle(res)
    return res
  }

  hasEnoughPlayer () {
    return this.users.length >= this.minPlayer
  }
}