const request = require('../helpers/request')
const GAME_URL = '/games'
const USER_URL = '/users'

module.exports = function (url) {
  let module = {}

  module.ping = () => {
    return request.post(url + '/ping', {})
  }

  module.getGame = () => {
    return request.get(url + GAME_URL)
  }

  module.createGame = (name, user) => {
    return request.post(url + GAME_URL, {
        name: name,
        userId: user.uuid,
      },
    )
  }
  module.createUser = (name) => {
    return request.post(url + USER_URL, {
        name: name,
      },
    )
  }
  return module
}