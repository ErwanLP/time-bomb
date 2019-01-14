const Game = require('@models/Game')

let gameList = []

module.exports.create = function (uuid, name) {
  return new Promise((resolve, reject) => {
    let g = new Game(uuid, name)
    gameList.push(g)
    resolve(g)
  })
}

module.exports.read = function () {
  return new Promise((resolve, reject) => {
    resolve(gameList)
  })
}

module.exports.getById = function (id) {
  return new Promise((resolve, reject) => {
    resolve(gameList.find(u => u.uuid === id))
  })
}

module.exports.join = function (gameId, user) {
  return this.getById(gameId).then(
    game => {
      game.addUser(user)
      return game
    },
  )
}