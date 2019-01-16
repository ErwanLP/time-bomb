const Game = require('@models/Game')

let gameList = []

module.exports.create = function (uuid, name, userId) {
  return new Promise((resolve, reject) => {
    let g = new Game(uuid, name, userId)
    gameList.push(g)
    resolve(g)
  })
}

module.exports.read = function () {
  return new Promise((resolve, reject) => {
    resolve(gameList.map(g => {
      return {
        name: g.name,
        uuid: g.uuid,
      }
    }))
  })
}

module.exports.getById = function (id) {
  return new Promise((resolve, reject) => {
    resolve(gameList.find(u => u.uuid === id))
  })
}