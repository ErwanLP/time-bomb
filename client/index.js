const minimist = require('minimist')
const io = require('socket.io-client')
const chalk = require('chalk')
const figlet = require('figlet')
const input = require('./input')
const output = require('./output')
const log = (msg) => console.log(msg)
const logInfo = (msg) => console.log('\n' + chalk.blue(msg))
const logSuccess = (msg) => console.log('\n' + chalk.green(msg))
const logPlay = (msg) => console.log('\n' + chalk.yellow(msg))
const logError = (msg) => console.log('\n' + chalk.red(msg))
const randomFullName = require('random-fullName')
const {table} = require('table')
const url = 'http://localhost:3002'

let currentGameId
let localUserId
const card = '░░░░░░░░░' + '\n' + '░░░░░░░░░' +
  '\n' + '░░░░░░░░░' + '\n' + '░░░░░░░░░' + '\n' + '░░░░░░░░░' + '\n' +
  '░░░░░░░░░' + '\n' + '░░░░░░░░░'

module.exports = function () {
  let params = minimist(process.argv.slice(2))
  let name = params.name || randomFullName()
  figlet('Time Bomb', function (err, data) {
    //console.log(data)
    logInfo('Your name is : ' + name)
    output.ping().then(() => {
      let socket = io(url)
      output.createUser(name).then(user => {
        localUserId = user.uuid
        input.host().then((host) => {
          if (host === 'Host') {
            //create instance of game
            input.nameInstance().
              then(newGameName => output.createGame(newGameName ||
                ('Instance of ' + name), user).
                then(game => {
                    logSuccess('Success to create instance with name : ' +
                      game.name)
                    logInfo('Try to connect to lobby : ' + game.name)
                  currentGameId = game.uuid
                    socket.emit('join_game', game.uuid, user.uuid)
                  },
                ),
              )
          } else {
            // see list of games
            output.getGame().then(
              games => {
                input.selectGame(games).then((game) => {
                  logInfo('Try to connect to lobby : ' + game.name)
                  currentGameId = game.uuid
                  socket.emit('join_game', game.uuid, user.uuid)
                })
              },
            )
          }
        })
      })

      socket.on('join_game_success', data => {
        logSuccess(data)
      })

      socket.on('broadcast_list_user_in_game', data => {
        logInfo(data)
      })

      socket.on('ask_start_game', (numberOfPlayer) => {
        input.confirmStartGame(numberOfPlayer).then(bool => {
          if (bool === true) {
            socket.emit('start_game', currentGameId)
          }
        })
      })

      socket.on('game_user_info', data => {
        let info = JSON.parse(data)
        logPlay('Your role is : ' + info.me.role)
        logPlay('Here is the list of your cards: ')
        let cards = info.me.cards.map(c => c.type)
        let output = table([cards], {})
        console.log(output)
        logPlay('Current player is  : ' + info.currentPlayer)
      })

      socket.on('game_user_play', data => {
        let info = JSON.parse(data)
        input.pickCardSelectUser(info.users).then(
          user => {
            let hiddenCard = new Array(user.cardsLength).fill(card)
            let output2 = table([hiddenCard.map((val, i) => i), hiddenCard], {
              columnDefault: {
                width: 16,
                alignment: 'center',
              },
            })
            console.log(output2)
            input.pickCardSelectIndex(hiddenCard.map((val, i) => '' + i)).then(
              index => {
                socket.emit('pick_card', currentGameId, localUserId, user.uuid,
                  index)
              },
            )

          },
        )
      })

      socket.on('card_picked', data => {
        log(data)
      })

      socket.on('disconnect', function () {
        logError('User disconnect')
      })

    })
  })
}
