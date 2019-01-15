const GamesService = require('@services/GamesService')
const UsersService = require('@services/UsersService')
const uuidv4 = require('uuid/v4')

module.exports.create = (req, res, next) => {
  return GamesService.create(uuidv4(), req.body.name).then(
    (data) => {
      console.log(data)
      res.json(data)
    },
    (err) => {
      console.error(err)
      res.status(400).send(err)
    },
  )
}

module.exports.join = (req, res, next) => {
  return UsersService.getById(req.body.userId).
    then(user => GamesService.join(req.params.id, user)).
    then(
      (data) => {
        console.log(data)
        res.json(data)
      },
      (err) => {
        console.error(err)
        res.status(400).send(err)
      },
    )
}

module.exports.read = (req, res, next) => {
  return GamesService.read().then(
    (data) => {
      res.json(data)
    },
    (err) => {
      console.error(err)
      res.status(400).send(err)
    },
  )
}

module.exports.socketJoinGame = (socket, io, gameId, userId) => {
  Promise.all([UsersService.getById(userId), GamesService.getById(gameId)]).
    then(data => {
        [user, game] = data
        if (user && game) {
          socket.join(gameId)
          io.sockets.in(gameId).
            emit('broadcast_user_join_game', user.name +
              ' join lobby of instance :  ' +
              game.name)
          let str = 'List of users : ' +
            game.users.reduce((acc, val) => ((val ? acc + val.name : acc) + ' '),
              '')
          io.sockets.in(gameId).
            emit('broadcast_list_user_in_game', str)
        } else {
          console.error('ERROR : game or user not found')
          console.error(game, user)
        }

      },
    )
}