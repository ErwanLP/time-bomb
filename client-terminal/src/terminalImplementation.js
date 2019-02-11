const output = require('./output/index')
const input = require('./input/index')

module.exports.init = function (host) {
  return output.figlet('Time Bomb', output.logPlay).then(() => {
    output.logInfo('Connecting to ' + host + ' ...')
  })
}

module.exports.displayUser = function (data) {
  let info = JSON.parse(data)
  output.logInfo('Your name is : ' + info.name)
  this.createOrListInstance()
}

module.exports.createOrListInstance = function () {
  input.createOrListInstance().then((createOrJoin) => {
    if (createOrJoin === 'CREATE') {
      input.nameInstance().then(newGameName => this.gameCreate(newGameName))
    } else {
      this.gameList()
    }
  })
}

module.exports.joinGameFromCreate = function (data) {
  let info = JSON.parse(data)
  this.gameJoin(info.uuid)
}

module.exports.joinGameFromList = function (data) {
  let games = JSON.parse(data)
  if (games && games.length > 0) {
    input.selectGame(games).then(game => {
      this.gameJoin(game.uuid)
    })
  } else {
    output.logInfo('No game instance available')
    input.refreshListOfGame().then(bool => {
      if (bool === true) {
        this.gameList()
      } else {
        this.createOrListInstance()
      }
    })
  }
}

module.exports.userJoinGameSuccess = function (data) {
  output.logSuccess(data)
}

module.exports.userJoinGameError = function (data) {
  output.logError(data)
  process.exit()
}

module.exports.gameListUser = function (data) {
  output.logInfo(data)
}

module.exports.gameAskStart = function (data) {
  let info = JSON.parse(data)
  input.confirmStartGame(info.numberOfPlayer).then(bool => {
    if (bool === true) {
      this.gameStart()
    }
  })
}

module.exports.gameStart = function (data) {
  output.tbGame('Start of the game, your role is ' + data)
}

module.exports.gameNewRound = function (data) {
  let info = JSON.parse(data)
  output.tbGame('New Round')
  output.displayVisibleCard(info.me.cards.map(c => c.type))
  output.log('Number of round : ' +
    info.roundNumber + ' / 4')
  output.log('Number of defusing card found : ' +
    info.numberOfDefuseFound + ' / ' + info.numberOfDefuseToFind)
  output.log('Waiting for ' + info.currentPlayer + ' ....')
}

module.exports.gameInfo = function (data) {
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
}

module.exports.gameUserPlay = function (bot, data) {
  let info = JSON.parse(data)
  if (!bot) {
    output.tbPlay('It is your turn')
    input.pickCardSelectUser(info.users).then(
      user => {
        let hiddenCards = output.displayHiddenCard(user.cardsLength)
        input.pickCardSelectIndex(hiddenCards.map((val, i) => '' + i)).then(
          index => {
            this.gamePickCard(user.uuid, index)
          },
        )
      },
    )
  } else {
    this.gamePickCard(info.users[0].uuid, 0)
  }
}

module.exports.gameEnd = function (data) {
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
}

module.exports.gameStopError = function (data) {
  output.logError(data)
  process.exit()
}

module.exports.wrongVersion = function (data) {
  let info = JSON.parse(data)
  output.logError('Please change the version of the package to : ' +
    info.expectedVersion)
  output.log('npm install -g time-bomb-client-terminal@' +
    info.expectedVersion)
  process.exit()
}

module.exports.error = function (data) {
  output.logError(data)
  process.exit()
}

module.exports.disconnect = function (data) {
  output.logError('User disconnect')
  process.exit()
}
