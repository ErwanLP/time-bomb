const Game = require('@models/Game')

let gameList = []

module.exports.create = function (uuid, name, userId) {
  return new Promise((resolve, reject) => {
    let g = new Game(uuid, name, userId)
    gameList.unshift(g)
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

module.exports.readNotStartedGames = function () {
  return new Promise((resolve, reject) => {
    resolve(gameList.filter(g => g.isStart === false).map(g => {
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

module.exports.deleteById = function (id) {
  return new Promise((resolve, reject) => {
    let index = gameList.findIndex(g => g.uuid === id)
    if (index > -1) {
      gameList.splice(index, 1)
      resolve()
    } else {
      reject()
    }
  })
}