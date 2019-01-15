const request = require('./../helpers/request')

const url = 'http://localhost:3001'
const GAME_URL = '/games'
const USER_URL = '/users'

module.exports.createGame = (name) => {
  return request.post(url + GAME_URL, {
      name: name,
    },
  )
}

module.exports.getGame = () => {
  return request.get(url + GAME_URL)
}

module.exports.joinGame = (gameId, userId) => {
  return request.post(url + '/games/' + gameId + '/join', {
      userId: userId,
    },
  )
}

module.exports.createUser = (name) => {
  return request.post(url + USER_URL, {
      name: name,
    },
  )
}