const request = require('./../helpers/request')

const url = 'http://localhost:3002'
const GAME_URL = '/games'
const USER_URL = '/users'

module.exports.ping = () => {
  return request.post(url + '/ping', {})
}

module.exports.createGame = (name, user) => {
  return request.post(url + GAME_URL, {
      name: name,
    userId: user.uuid,
    },
  )
}

module.exports.getGame = () => {
  return request.get(url + GAME_URL)
}

module.exports.createUser = (name) => {
  return request.post(url + USER_URL, {
      name: name,
    },
  )
}