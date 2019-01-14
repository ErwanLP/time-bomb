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