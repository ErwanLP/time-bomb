const minimist = require('minimist')
const io = require('socket.io-client')
const input = require('./input/index')
const output = require('./output/index')
const Configstore = require('configstore')
const pkg = require('./../package.json')
const implementation = require('./terminalImplementation')
require('dotenv').config({path: __dirname + '/./../../.env'})
const conf = new Configstore(pkg.name, {})

module.exports = function () {
  let params = minimist(process.argv.slice(2))
  const bot = !!params.bot
  const save = !!params.save
  const dev = !!params.dev
  const version = !!params.v || !!params.version
  if (save) {
    conf.set('host', params.host)
    conf.set('name', params.name)
  }
  let host, name
  if (dev) {
    host = params.host || 'http://localhost:' +
      (process.env.CUSTOM_PORT || '3000')
    name = params.name
  } else {
    host = params.host || conf.get('host') || 'http://localhost:' +
      (process.env.CUSTOM_PORT || '3000')
    name = params.name || conf.get('name')
  }

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

    /**
     * Internal state create or list instance
     */
    let createOrListInstance = implementation.createOrListInstance.bind(
      {
        gameCreate: newGameName => socket.emit('game_create', newGameName),
        gameList: () => socket.emit('game_list'),
      },
    )

    /**
     * Socket on user create success
     */
    socket.on('user_create_success', implementation.displayUser.bind({
      createOrListInstance: createOrListInstance,
    }))

    /**
     * Socket on game create success
     */
    socket.on('game_create_success',
      implementation.joinGameFromCreate.bind(
        {
          gameJoin: (gameId) => socket.emit('game_join', gameId),
        },
      ),
    )

    /**
     * Socket on game list success
     */
    socket.on('game_list_success',
      implementation.joinGameFromList.bind(
        {
          gameJoin: (gameId) => socket.emit('game_join', gameId),
          gameList: () => socket.emit('game_list'),
          createOrListInstance: createOrListInstance,
        },
      ),
    )

    /**
     * Socket user join game success
     */
    socket.on('user_join_game_success',
      implementation.userJoinGameSuccess.bind(
        {
          gameJoin: (gameId) => socket.emit('game_join', gameId),
          gameList: () => socket.emit('game_list'),
          createOrListInstance: createOrListInstance,
        },
      ),
    )

    /**
     * Socket user join game error
     */
    socket.on('user_join_game_error', implementation.userJoinGameError)

    /**
     * Socket game broadcast list user
     */
    socket.on('game_broadcast_list_user', implementation.gameListUser)

    /**
     * Socket game ask start
     */
    socket.on('game_ask_start',
      implementation.gameAskStart.bind(
        {
          gameStart: () => socket.emit('game_start'),
        },
      ),
    )

    /**
     * Socket game user start
     */
    socket.on('game_user_start', implementation.gameStart)

    /**
     * Socket game new round
     */
    socket.on('game_user_new_round', implementation.gameNewRound)

    /**
     * Socket broadcast info
     */
    socket.on('game_broadcast_info',
      implementation.gameNewRound.bind(
        {
          gameStart: () => socket.emit('game_start'),
        },
      ),
    )

    /**
     * Socket game broadcast info
     */
    socket.on('game_broadcast_info', implementation.gameInfo)

    /**
     * Socket game user play
     */
    socket.on('game_user_play', implementation.gameUserPlay.bind({
      gamePickCard: (userId, index) => socket.emit('game_pick_card', userId,
        index),
    }, bot))

    /**
     * Socket game broadcast end
     */
    socket.on('game_broadcast_info', implementation.gameEnd)

    /**
     * Socket game broadcast stop error
     */
    socket.on('game_broadcast_stop_error', implementation.gameStopError)

    /**
     * Socket wrong version
     */
    socket.on('wrong_version', implementation.wrongVersion)

    /**
     * Socket error
     */
    socket.on('error', implementation.error)

    /**
     * Socket disconnect
     */
    socket.on('disconnect', implementation.disconnect)
  })
}
