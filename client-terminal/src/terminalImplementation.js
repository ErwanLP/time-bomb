const output = require('./output/index');
const input = require('./input/index');

module.exports.init = function(host, dev) {
  if (dev) {
    return Promise.resolve(() => {
      output.logInfo('Connecting to ' + host + ' ...');
    });
  } else {
    return output.figlet('Time Bomb', output.logPlay).then(() => {
      output.logInfo('Connecting to ' + host + ' ...');
    });
  }
};

module.exports.connectionSuccess = function() {
  this.userCreate();
};

module.exports.displayUser = function(data) {
  let info = JSON.parse(data);
  output.logInfo('Your name is : ' + info.name);
  this.createOrListInstance();
};

module.exports.createOrListInstance = function() {
  input.createOrListInstance().then((createOrJoin) => {
    if (createOrJoin === 'CREATE') {
      input.nameInstance().then(newGameName => this.gameCreate(newGameName));
    } else {
      this.gameList();
    }
  });
};

module.exports.joinGameFromCreate = function(data) {
  let info = JSON.parse(data);
  this.gameJoin(info.uuid);
};

module.exports.joinGameFromList = function(data) {
  let games = JSON.parse(data);
  if (games && games.length > 0) {
    input.selectGame(games).then(game => {
      this.gameJoin(game.uuid);
    });
  } else {
    output.logInfo('No game instance available');
    input.refreshListOfGame().then(bool => {
      if (bool === true) {
        this.gameList();
      } else {
        this.createOrListInstance();
      }
    });
  }
};

module.exports.userJoinGameSuccess = function(data) {
  let info = JSON.parse(data);
  output.logSuccess('Success to connect to lobby as ' + info.as);
};

module.exports.userJoinGameError = function(data) {
  output.logError(data);
  process.exit();
};

module.exports.gameListPlayer = function(data) {
  let info = JSON.parse(data);
  let listUser = 'List of users : ' +
      info.playerList.reduce(
          (acc, userName) => ((userName ? acc + userName : acc) + ' - '),
          '');
  output.logInfo(listUser);
};

module.exports.gameAskStart = function(data) {
  let info = JSON.parse(data);
  input.confirmStartGame(info.numberOfPlayer).then(bool => {
    if (bool === true) {
      this.gameStart();
    }
  });
};

module.exports.gameStart = function(data) {
  let info = JSON.parse(data);
  output.tbGame('Start of the game, your role is ' + info.role.label);
};

module.exports.gameNewRound = function(data) {
  let info = JSON.parse(data);
  output.tbGame('New Round - [' + info.roundNumber + '/4]');
  output.displayVisibleCard(info.me.cards.map(c => c.label));
  output.log('There are ' +
      (info.numberOfDefuseToFind - info.numberOfDefuseFound) +
      ' defusing card(s) left to find, waiting for ' + info.currentPlayer);

};

module.exports.pickInfo = function(data) {
  let info = JSON.parse(data);
  output.tbInfo('Pick Information - [' + info.numberOfCardPickedThisRound +
      '/' + info.numberOfCardsToPickThisRound + ']');
  if (info.card.type === 'DEFUSING_CABLE') {
    output.logSuccess(info.userFromName + ' has taken card ' + info.card.label +
        ' from ' + info.userToName);
    if (info.numberOfDefuseToFind - info.numberOfDefuseFound > 0) {
      output.log('There are ' +
          (info.numberOfDefuseToFind - info.numberOfDefuseFound) +
          ' defusing card(s) left to find, waiting for ' + info.currentPlayer);
    }
  } else if (info.card.type === 'BOMB') {
    output.logError(info.userFromName + ' has taken card ' + info.card.label +
        ' from ' + info.userToName);
  } else {
    output.log(info.userFromName + ' has taken card ' + info.card.label +
        ' from ' + info.userToName);
    output.log('Waiting for ' + info.currentPlayer);
  }
};

module.exports.gameUserPlay = function(bot, data) {

  let selectPlayerAndCard = (info, loopFn) => {
    return input.pickCardSelectPlayer(info.players).then(
        player => {
          let hiddenCards = output.displayHiddenCard(player.cardsLength);
          input.pickCardSelectIndex(hiddenCards.map((val, i) => '' + i)).then(
              index => {
                input.confirmPickCard(player.user.name, index).then(
                    want => {
                      if (want) {
                        return this.gamePickCard(player.user.uuid, index);
                      } else {
                        loopFn(info, loopFn);
                      }
                    }
                );

              }
          );
        }
    );
  };

  let info = JSON.parse(data);
  if (!bot) {
    output.tbPlay('It is your turn');
    selectPlayerAndCard(info, selectPlayerAndCard);
  } else {
    this.gamePickCard(info.users[0].uuid, 0);
  }
};

module.exports.gameEnd = function(data) {
  let info = JSON.parse(data);
  let str = info.teamWin + ' Win - ' + info.cause;
  output.tbGame(str);
  if (info.teamWin === 'Sherlock') {
    output.figlet('Defused', output.logSuccess).then(() => process.exit());
  } else if (info.teamWin === 'Moriarty') {
    output.figlet('Boom', output.logError).then(() => process.exit());
  } else {
    process.exit();
  }
};

module.exports.gamePause = function(data) {
  let info = JSON.parse(data);
  output.logError(info.label);
};

module.exports.gameResume = function(data) {
  let info = JSON.parse(data);
  output.logSuccess(info.label);
};

module.exports.wrongVersion = function(data) {
  let info = JSON.parse(data);
  output.logError('Please change the version of the package to : ' +
      info.expectedVersion);
  output.log('npm install -g time-bomb-client-terminal@' +
      info.expectedVersion);
  process.exit();
};

module.exports.CustomError = function(data) {
  output.logError(data);
  process.exit();
};

module.exports.disconnect = function(data) {
  output.logError('User disconnect');
  process.exit();
};
