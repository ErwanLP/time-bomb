const minimist = require('minimist')
const io = require('socket.io-client')
const chalk = require('chalk')
const figlet = require('figlet')
const input = require('./input')
const output = require('./output')
const log = (msg) => console.log(msg)
const logInfo = (msg) => console.log(chalk.blue(msg))
const logSuccess = (msg) => console.log(chalk.green(msg))
const logError = (msg) => console.log(chalk.blue(msg))
const randomFullName = require('random-fullName')
const url = 'http://localhost:3001'
let socket

module.exports = function () {

  let params = minimist(process.argv.slice(2))
  let name = params.name || randomFullName()
  logInfo('Your name is : ' + name)

  //figlet('Time Bomb', function(err, data) {
  //console.log(data)
  input.host().then((answers) => {
    if (answers.host === 'Host') {
      //create instance of game
      input.nameInstance().
        then(answers => output.createGame(answers.newGameName ||
          ('Instance of ' + name)).
          then(game => {
              logSuccess('Instance created with name : ' + game.name)
              lobby(game)
            },
          ),
        )
    } else {
      // see list of games
      output.getGame().then(
        data => {
          input.selectGame().then((answers) => {
            let game = data.find((g) => g.name === answers.selectGame)
            lobby(game)
          })
        },
      )
    }
  })

  function lobby (game) {
    logInfo('Try to connect to lobby : ' + game.name)
    output.createUser(name).then(
      user => {
        output.joinGame(game.uuid, user.uuid).then(() => {
          socket = io(url)
          socket.on('connect', function () {
            socket.emit('join_game', game.uuid, user.uuid)
            socket.on('broadcast_user_join_game', data => {
              logSuccess(data)
            })
            socket.on('broadcast_list_user_in_game', data => {
              logInfo(data)
            })
          })
        })

      },
    )
  }
}

/*        socket.on('event', function (data) {
          console.log(data)
        })
        socket.on('broadcast', function (data) {
          console.log(data)
        })
        socket.on('disconnect', function () {
          console.log('User disconnect')
        })*/
