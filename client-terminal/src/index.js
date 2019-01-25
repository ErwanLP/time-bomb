const minimist = require('minimist')
const io = require('socket.io-client')
const input = require('./input/index')
const output = require('./output/index')
const clear = require('clear')
const api = 'http://localhost:3002'
const services = require('./services/index')(api)

let currentGameId
let localUserId

module.exports = function () {
  let params = minimist(process.argv.slice(2))
  let name = params.name
  output.figlet('Time Bomb').then(() => {
    services.ping().then(() => {
      let socket = io(api)
      services.createUser(name).then(user => {
        localUserId = user.uuid
        output.logInfo('Your name is : ' + user.name)
        input.host().then((host) => {
          if (host === 'Host') {
            //create instance of game
            input.nameInstance().
              then(newGameName => services.createGame(newGameName ||
                ('Instance of ' + user.name), user).
                then(game => {
                    currentGameId = game.uuid
                    socket.emit('join_game', game.uuid, user.uuid)
                  },
                ),
              )
          } else {
            // see list of games
            services.getGame().then(
              games => {
                input.selectGame(games).then(game => {
                  currentGameId = game.uuid
                  socket.emit('join_game', game.uuid, user.uuid)
                })
              },
            )
          }
        })
      })

      socket.on('join_game_success', data => {
        output.logSuccess(data)
      })

      socket.on('broadcast_list_user_in_game', data => {
        output.logInfo(data)
      })

      socket.on('ask_start_game', (numberOfPlayer) => {
        input.confirmStartGame(numberOfPlayer).then(bool => {
          if (bool === true) {
            socket.emit('start_game', currentGameId)
          }
        })
      })

      socket.on('game_user_start', role => {
        output.tb('Start of the game, your role is ' + role)
      })

      socket.on('game_user_new_handle', data => {
        clear()
        output.tb('New Handle')
        let info = JSON.parse(data)
        output.displayVisibleCard(info.me.cards.map(c => c.type))
        output.log('Number of handle ' +
          info.handleNumber)
        output.log('Number of defusing card found ' +
          info.numberOfDefuseFound)
        output.log('Waiting for ' + info.currentPlayer + ' ....')
      })

      socket.on('game_user_info', data => {
        output.tb('Game information')
        let info = JSON.parse(data)
        output.log('Number of defusing card found ' +
          info.numberOfDefuseFound)
        output.log('Waiting for ' + info.currentPlayer + ' ....')
      })

      socket.on('game_user_play', data => {
        output.tb('It is your turn')
        let info = JSON.parse(data)
        input.pickCardSelectUser(info.users).then(
          user => {
            let hiddenCards = output.displayHiddenCard(user.cardsLength)
            input.pickCardSelectIndex(hiddenCards.map((val, i) => '' + i)).then(
              index => {
                socket.emit('pick_card', currentGameId, localUserId, user.uuid,
                  index)
              },
            )
          },
        )
      })

      socket.on('end_game', data => {
        output.logInfo(data)
      })

      socket.on('disconnect', function () {
        output.logError('User disconnect')
      })

    }, () => {
      output.logError('Server Offline')
      process.exit()
    })
  })
}
