const minimist = require('minimist')
const io = require('socket.io-client')
const request = require('./helpers/request')
const inquirer = require('inquirer')
const chalk = require('chalk')
const figlet = require('figlet')
const log = (msg) => console.log(msg)
const logInfo = (msg) => console.log(chalk.blue(msg))
const logSuccess = (msg) => console.log(chalk.green(msg))
const logError = (msg) => console.log(chalk.blue(msg))
const randomFullName = require('random-fullName')

const url = 'http://localhost:3001'
let socket

module.exports = function () {

  let params = minimist(process.argv.slice(2))
  let host = params.host
  let name = params.name || randomFullName()
  logInfo('Your default name is : ' + name)

  //figlet('Time Bomb', function(err, data) {
  //console.log(data)
  inquirer.prompt([
    {
      name: 'host',
      type: 'list',
      message: 'Join existing instance game or host your own instance of the game ?',
      choices: ['Join existing game', 'Host'],
      default: 1,
    }]).then((answers) => {
    if (answers.host === 'Host') {
      //create instance of game
      inquirer.prompt([
        {
          name: 'newGameName',
          type: 'input',
          message: 'what is the name your new instance ?',
        }]).then((answers) => {
        request.post(url + '/games', {
            host: host,
          name: answers.newGameName || ('instance of ' + name),
          },
        ).then(
          data => {
            logSuccess('Instance created with id : ' + data.uuid)
            lobby(data.uuid)
          },
        )
      })
    } else {
      // see list of games
      request.get(url + '/games',
      ).then(
        data => {
          inquirer.prompt([
            {
              name: 'selectGame',
              type: 'list',
              message: 'Select the game you want to join ?',
              choices: data ? data.map(game => game.name) : [''],
              default: 1,
            }]).then((answers) => {
            let game = data.find((g) => g.name === answers.selectGame)
            lobby(game.uuid)
          })
        },
      )
    }
  })

  function lobby (gameId) {
    logInfo('Try to create to lobby with id : ' + gameId)
    request.post(url + '/users', {
        name: name,
      },
    ).then(
      data => {
        request.post(url + '/games/' + gameId + '/join', {
            userId: data.uuid,
          },
        ).then(data => {
          socket = io(url)
          socket.on('connect', function () {
            socket.emit('join game', gameId)
            socket.on('broadcast user join game', function (data) {
              logSuccess(data)
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
