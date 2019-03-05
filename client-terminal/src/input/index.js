const inquirer = require('inquirer');

module.exports.createOrListInstance = () => {
  return inquirer.prompt([
    {
      name: 'createOrList',
      type: 'list',
      message: 'Join existing instance game or create your own instance of the game ?',
      choices: ['Join existing game', 'Create new game'],
      default: 0,
    }]).
      then(data => data.createOrList === 'Create new game' ? 'CREATE' : 'LIST');
};

module.exports.nameInstance = () => {
  return inquirer.prompt([
    {
      name: 'newGameName',
      type: 'input',
      message: 'what is the name your new instance ?',
    }]).then(data => data.newGameName);
};

module.exports.selectGame = (games) => {
  return inquirer.prompt([
    {
      name: 'selectedGame',
      type: 'list',
      message: 'Select the game you want to join ?',
      choices: games ? games.map(game => game.name) : [''],
      default: 0,
    }]).
      then(data => data.selectedGame).
      then(selectedGame => games.find((g) => g.name === selectedGame));
};

module.exports.confirmStartGame = (numberOfPlayer) => {
  return inquirer.prompt([
    {
      name: 'confirmStartGame',
      type: 'confirm',
      message: 'Start game with ' + numberOfPlayer +
      ' player(s) (or waiting for more player) ?',
    }]).then(data => data.confirmStartGame);
};

module.exports.refreshListOfGame = () => {
  return inquirer.prompt([
    {
      name: 'refreshListOfGame',
      type: 'confirm',
      message: 'Refresh list of instance ?',
    }]).then(data => data.refreshListOfGame);
};

module.exports.pickCardSelectUser = (users) => {
  return inquirer.prompt([
    {
      name: 'pickCardSelectUser',
      type: 'list',
      message: 'Which player would you like to take a card ?',
      choices: users ? users.filter(user => !user.isCurrentPlayer).
          map(user => user.name + (user.cardsLength !== null
              ? (' (' + user.cardsLength + ' cards)')
              : '')) : [''],
      default: 0,
    }]).
      then(data => data.pickCardSelectUser).
      then(pickCardSelectUser => pickCardSelectUser.split(
          new RegExp(' \\(\\d cards\\)'))[0]).
      then(userName => users.find((u) => u.name === userName));
};

module.exports.confirmPickCard = (userName, index) => {
  return inquirer.prompt([
    {
      name: 'confirmPickCard',
      type: 'confirm',
      message: 'Confirm you want to pick card number ' + index +
      ' to the player ' + userName,
    }]).then(data => data.confirmPickCard);
};

module.exports.pickCardSelectIndex = (arr) => {
  return inquirer.prompt([
    {
      name: 'pickCardSelectIndex',
      type: 'list',
      message: 'Which card would you like to take ?',
      choices: arr,
      default: 0,
    }]).
      then(data => data.pickCardSelectIndex);
};


