const inquirer = require('inquirer')

module.exports.host = () => {
  return inquirer.prompt([
    {
      name: 'host',
      type: 'list',
      message: 'Join existing instance game or host your own instance of the game ?',
      choices: ['Join existing game', 'Host'],
      default: 1,
    }])
}

module.exports.nameInstance = () => {
  return inquirer.prompt([
    {
      name: 'newGameName',
      type: 'input',
      message: 'what is the name your new instance ?',
    }])
}

module.exports.selectGame = (data) => {
  return inquirer.prompt([
    {
      name: 'selectGame',
      type: 'list',
      message: 'Select the game you want to join ?',
      choices: data ? data.map(game => game.name) : [''],
      default: 0,
    }])
}

module.exports.confirmStartGame = (numberOfPlayer) => {
  return inquirer.prompt([
    {
      name: 'confirmStartGame',
      type: 'confirm',
      message: 'Start game with ' + numberOfPlayer +
      ' player(s) or waiting for more player ?',
    }]).then(data => data.confirmStartGame)
}







