const GamesService = require('@services/GamesService')
const UsersService = require('@services/UsersService')
const uuidv4 = require('uuid/v4')

module.exports.create = (req, res) => {
  return GamesService.create(uuidv4(), req.body.name, req.body.userId).then(
    data => res.json(data),
    err => res.status(400).send(err),
  )
}

module.exports.read = (req, res) => {
  return GamesService.read().then(
    data => res.json(data),
    err => res.status(400).send(err),
  )
}

module.exports.socketJoinGameInstance = (socket, io, gameId, userId) => {
  Promise.all([UsersService.getById(userId), GamesService.getById(gameId)]).
    then(data => {
        [user, game] = data
        if (user && game) {
          socket.gameId = gameId
          socket.userId = userId
          game.addUser(user, socket)
          let listUser = 'List of users : ' +
            game.users.reduce(
              (acc, val) => ((val ? acc + val.name : acc) + ' - '),
              '')
          io.sockets.in(gameId).
            emit('broadcast_list_user_in_game', listUser)
          if (game.hasEnoughPlayer()) {
            game.creator.socket.emit('ask_start_game', game.users.length)
          }
        } else {
          console.error('ERROR : game or user not found')
          console.error(game, user)
        }
      },
    )
}

module.exports.socketLeaveGameInstance = (socket, io, gameId, userId) => {
  console.log('socketLeaveGameInstance', gameId, userId)
}

module.exports.socketStartGameInstance = (socket, io, gameId) => {
  return GamesService.getById(gameId).
    then(game => game.startGame())
}

module.exports.socketPickCard = (
  socket, io, gameId, userFromId, userToId, index) => {
  return GamesService.getById(gameId).
    then(game => {
      let card = game.pickCard(userToId, index)
      Promise.all(
        [UsersService.getById(userFromId), UsersService.getById(userToId)]).
        then(data => {
          io.sockets.in(gameId).
            emit('game_broadcast_info', JSON.stringify({
              card: card.type,
              userFromName: data[0] ? data[0].name : 'one player',
              userToName: data[1] ? data[1].name : 'other player',
              currentPlayer: game.users[game.currentPlayerIndex].name,
              numberOfDefuseFound: game.numberOfDefuseFound,
            }))
        }).then(
        () => {
          if (game.isEndOfHandle()) {
            if (game.isEndOfGame()) {
              let res = game.endGame()
              io.sockets.in(gameId).
                emit('game_broadcast_end', res)
            } else {
              game.startHandle()
            }
          } else {
            game.startNewPlay()
          }
        },
      )
    })
}