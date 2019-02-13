module.exports = function (config, io, implementation) {

  let socket = io(config.host,
    {query: 'name=' + config.name + '&version=' + config.version})

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
    implementation.userJoinGameSuccess,
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
   * Socket game broadcast info
   */
  socket.on('game_broadcast_info', implementation.gameInfo)

  /**
   * Socket game user play
   */
  socket.on('game_user_play', implementation.gameUserPlay.bind({
    gamePickCard: (userId, index) => socket.emit('game_pick_card', userId,
      index),
  }, config.bot))

  /**
   * Socket game broadcast end
   */
  socket.on('game_broadcast_end', implementation.gameEnd)

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
}