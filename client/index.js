const minimist = require('minimist')
const io = require('socket.io-client')
const request = require('./helpers/request')
const inquirer = require('inquirer')
const chalk = require('chalk')
const figlet = require('figlet')
const log = (msg) => console.log(msg)
const logInfo = (msg) => console.log(chalk.blue(msg))
const logSuccess = (msg) => console.log(chalk.blue(msg))
const logError = (msg) => console.log(chalk.blue(msg))
const randomFullName = require('random-fullName')

const url = 'http://localhost:3001'

module.exports = function () {

  let params = minimist(process.argv.slice(2))
  let host = params.host
  let name = params.name || randomFullName()
  /*  console.log('host', host)
    console.log('name', name)*/

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
        request.post(url + '/games/create', {
            host: host,
            name: answers.newGameName || 'instance game',
          },
        ).then(
          data => {
            logInfo('Info : Instance created with id : ' + data.uuid)
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

  //});

  function lobby (uuid) {
    logInfo('Info : Connected to lobby with id : ' + uuid)

    let socket = io(url)

    socket.on('connect', function () {
      console.log('User connected')
    })
    socket.on('event', function (data) {
      console.log(data)
    })
    socket.on('broadcast', function (data) {
      console.log(data)
    })
    socket.on('disconnect', function () {
      console.log('User disconnect')
    })
  }
}
