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

module.exports.selectGame = () => {
  return inquirer.prompt([
    {
      name: 'selectGame',
      type: 'list',
      message: 'Select the game you want to join ?',
      choices: data ? data.map(game => game.name) : [''],
      default: 1,
    }])
}







