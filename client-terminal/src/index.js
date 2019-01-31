const minimist = require('minimist')
const io = require('socket.io-client')
const input = require('./input/index')
const output = require('./output/index')

module.exports = function () {
  let params = minimist(process.argv.slice(2))
  const name = params.name
  const host = params.host || 'http://localhost:3002'
  const services = require('./services/index')(host)

  output.figlet('Time Bomb').then(() => {
    let socket = io(host, {query: 'name=' + name})

    socket.on('create_user_success', data => {
      let info = JSON.parse(data)
      output.logInfo('Your name is : ' + info.user.name)
      input.createOrJoinInstance().then((createOrJoin) => {
        if (createOrJoin === 'Create new game') {
          input.nameInstance().
            then(newGameName => socket.emit('create_game', newGameName))
        } else {
          services.getGame().then(
            games => {
              if (games && games.length > 0) {
                input.selectGame(games).then(game => {
                  socket.emit('join_game', game.uuid)
                })
              } else {
                output.logInfo('No game instance available')
                process.exit()
              }
            },
          )
        }
      })
    })

    socket.on('create_game_success', (data) => {
      let info = JSON.parse(data)
      socket.emit('join_game', info.game.uuid)
    })

    socket.on('join_game_success', data => {
      output.logSuccess(data)
    })

    socket.on('broadcast_list_user_in_game', data => {
      output.logInfo(data)
    })

    socket.on('ask_start_game', (data) => {
      let info = JSON.parse(data)
      input.confirmStartGame(info.numberOfPlayer).then(bool => {
        if (bool === true) {
          socket.emit('start_game')
        }
      })
    })

    socket.on('game_user_start', role => {
      output.tbGame('Start of the game, your role is ' + role)
    })

    socket.on('game_user_new_round', data => {
      let info = JSON.parse(data)
      output.tbGame('New Round')
      output.displayVisibleCard(info.me.cards.map(c => c.type))
      output.log('Number of round : ' +
        info.roundNumber)
      output.log('Number of defusing card found : ' +
        info.numberOfDefuseFound)
      output.log('Waiting for ' + info.currentPlayer + ' ....')
    })

    socket.on('game_broadcast_info', data => {
      output.tbInfo('Game information')
      let info = JSON.parse(data)
      output.log(info.userFromName + ' have taken card ' + info.card +
        ' from ' + info.userToName)
      output.log('Number of defusing card found : ' +
        info.numberOfDefuseFound)
      output.log('Waiting for ' + info.currentPlayer + ' ....')
    })

    socket.on('game_user_play', data => {
      output.tbPlay('It is your turn')
      let info = JSON.parse(data)
      input.pickCardSelectUser(info.users).then(
        user => {
          let hiddenCards = output.displayHiddenCard(user.cardsLength)
          input.pickCardSelectIndex(hiddenCards.map((val, i) => '' + i)).then(
            index => {
              socket.emit('pick_card', user.uuid, index)
            },
          )
        },
      )
    })

    socket.on('game_broadcast_end', data => {
      output.tbGame(data)
      process.exit()
    })

    socket.on('game_broadcast_stop_error', data => {
      output.logError(data)
      process.exit()
    })

    socket.on('disconnect', function () {
      output.logError('User disconnect')
      process.exit()
    })
  })
}
