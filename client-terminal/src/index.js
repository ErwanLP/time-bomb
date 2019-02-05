const minimist = require('minimist')
const io = require('socket.io-client')
const input = require('./input/index')
const output = require('./output/index')
const Configstore = require('configstore')
const pkg = require('./../package.json')
require('dotenv').config({path: __dirname + '/./../../.env'})
const conf = new Configstore(pkg.name, {})

module.exports = function () {
  let params = minimist(process.argv.slice(2))
  const bot = !!params.bot
  const save = !!params.save
  const version = !!params.v || !!params.version
  if (save) {
    conf.set('host', params.host)
    conf.set('name', params.name)
  }
  const host = params.host || conf.get('host') || 'http://localhost:' +
    (process.env.CUSTOM_PORT || '3000')
  const name = params.name || conf.get('name')

  if (version) {
    output.log(pkg.version)
    process.exit()
  }

  output.figlet('Time Bomb', output.logPlay).then(() => {
    if (name === 'YOUR_NAME') {
      output.logError('Your name can not be  : YOUR_NAME')
      process.exit()
    }

    output.logInfo('Connecting to ' + host + ' ...')
    let socket = io(host, {query: 'name=' + name + '&version=' + pkg.version})

    socket.on('create_user_success', data => {
      let info = JSON.parse(data)
      output.logInfo('Your name is : ' + info.user.name)
      input.createOrJoinInstance().then((createOrJoin) => {
        if (createOrJoin === 'CREATE') {
          input.nameInstance().
            then(newGameName => socket.emit('create_game', newGameName))
        } else {
          socket.emit('get_games')
        }
      })
    })

    socket.on('create_game_success', (data) => {
      let info = JSON.parse(data)
      socket.emit('join_game', info.uuid)
    })

    socket.on('list_games', (data) => {
      let games = JSON.parse(data)
      if (games && games.length > 0) {
        input.selectGame(games).then(game => {
          socket.emit('join_game', game.uuid)
        })
      } else {
        output.logInfo('No game instance available')
        input.refreshListOfGame().then(bool => {
          if (bool === true) {
            socket.emit('get_games')
          }
        })
      }
    })

    socket.on('join_game_success', data => {
      output.logSuccess(data)
    })

    socket.on('join_game_error', data => {
      output.logError(data)
      process.exit()
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
        info.roundNumber + ' / 4')
      output.log('Number of defusing card found : ' +
        info.numberOfDefuseFound + ' / ' + info.numberOfDefuseToFind)
      output.log('Waiting for ' + info.currentPlayer + ' ....')
    })

    socket.on('game_broadcast_info', data => {
      output.tbInfo('Game information')
      let info = JSON.parse(data)
      if (info.card === 'Defusing') {
        output.logSuccess(info.userFromName + ' has taken card ' + info.card +
          ' from ' + info.userToName)
      } else if (info.card === 'Bomb') {
        output.logError(info.userFromName + ' has taken card ' + info.card +
          ' from ' + info.userToName)
      } else {
        output.log(info.userFromName + ' has taken card ' + info.card +
          ' from ' + info.userToName)
      }
      output.log('Number of defusing card found : ' +
        info.numberOfDefuseFound + ' / ' + info.numberOfDefuseToFind)
      output.log('Number of card picked this round: ' +
        info.numberOfCardPickedThisRound + ' / ' +
        info.numberOfCardsToPickThisRound)
      output.log('Waiting for ' + info.currentPlayer + ' ...')
    })

    socket.on('game_user_play', data => {
      let info = JSON.parse(data)
      if (!bot) {
        output.tbPlay('It is your turn')
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
      } else {
        socket.emit('pick_card', info.users[0].uuid, 0)
      }
    })

    socket.on('game_broadcast_end', data => {
      let info = JSON.parse(data)
      let str = info.teamWin + ' Win - ' + info.cause
      output.tbGame(str)
      if (info.teamWin === 'Sherlock') {
        output.figlet('Defused', output.logSuccess).then(() => process.exit())
      } else if (info.teamWin === 'Moriarty') {
        output.figlet('Boom', output.logError).then(() => process.exit())
      } else {
        process.exit()
      }
    })

    socket.on('game_broadcast_stop_error', data => {
      output.logError(data)
      process.exit()
    })

    socket.on('wrong_version', data => {
      let info = JSON.parse(data)
      output.logError('Please change the version of the package to : ' +
        info.expectedVersion)
      output.log('npm install -g time-bomb-client-terminal@' +
        info.expectedVersion)
      process.exit()
    })

    socket.on('disconnect', function () {
      output.logError('User disconnect')
      process.exit()
    })
  })
}
