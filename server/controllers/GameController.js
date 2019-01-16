const GamesService = require('@services/GamesService')
const UsersService = require('@services/UsersService')
const uuidv4 = require('uuid/v4')

module.exports.create = (req, res, next) => {
  return GamesService.create(uuidv4(), req.body.name, req.body.userId).then(
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

module.exports.socketJoinGameInstance = (socket, io, gameId, userId) => {
  Promise.all([UsersService.getById(userId), GamesService.getById(gameId)]).
    then(data => {
        [user, game] = data
        if (user && game) {
          socket.join(gameId)
          game.addUser(user, socket)
          let str = 'List of users : ' +
            game.users.reduce(
              (acc, val) => ((val ? acc + val.name : acc) + ' - '),
              '')
          io.sockets.in(gameId).
            emit('broadcast_list_user_in_game', str)
          game.creator.socket.emit('ask_start_game', game.users.length)
        } else {
          console.error('ERROR : game or user not found')
          console.error(game, user)
        }
      },
    )
}

module.exports.socketStartGameInstance = (socket, io, gameId) => {
  Promise.all([GamesService.getById(gameId)]).
    then(data => {
        [game] = data
        if (game) {
          game.startGame().then(
            data => {
              io.sockets.in(gameId).
                emit('game_starting', gameId)
            },
            err => {
              // try to start 2 time a game
            },
          )
        } else {
          console.error('ERROR : game found')
          console.error(game)
        }
      },
    )
}