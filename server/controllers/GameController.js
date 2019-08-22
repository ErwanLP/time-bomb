const GamesService = require('@services/GamesService');
const UsersService = require('@services/UsersService');
const uuidv4 = require('uuid/v4');

module.exports.socketGetGames = (socket) => {
  return GamesService.read().then(
      (games) => {
        socket.emit('game_list_success', JSON.stringify(games));
      },
      (err) => {
        socket.emit('error', JSON.stringify(err));
      },
  );
};

module.exports.deleteAllInstance = GamesService.deleteAllInstance;

module.exports.socketCreateGameInstance = (socket, io, name) => {

  function getHours() {
    function addZero(i) {
      if (i < 10) {
        i = '0' + i;
      }
      return i;
    }

    let d = new Date();
    let h = addZero(d.getHours());
    let m = addZero(d.getMinutes());
    return h + ':' + m;
  }

  return GamesService.create(uuidv4(),
      name ? name : ('Instance of ' + socket.userName + ' - ' + getHours()),
      socket.userId).then(
      (game) => {
        socket.emit('game_create_success', JSON.stringify(game));
      },
      (err) => {
        socket.emit('error', JSON.stringify(err));
      },
  );
};

module.exports.socketJoinGameInstance = (socket, io, gameId) => {
  Promise.all(
      [UsersService.getById(socket.userId), GamesService.getById(gameId)]).
      then(data => {
            [user, game] = data;
            if (user && game) {
              if (game.state === 'LOBBY') {
                if (game.hasUser(user)) {
                  socket.emit('user_join_game_error', JSON.stringify({
                    msg: 'Your are already in the instance',
                    player: game.player,
                    user: user.json(),
                  }));
                } else {
                  if (game.addPlayer(user)) {
                    socket.gameId = gameId;
                    user.socket.join(game.uuid);
                    askStartGame(game, io);
                  }
                }
              } else if (game.state === 'PAUSE') {
                if (game.hasUser(user)) {
                  socket.gameId = gameId;
                  user.socket.join(game.uuid);
                  user.socket.emit('game_user_resume',
                      JSON.stringify(game.historyOf(user.uuid)));
                  if (game.isCurrentPlayer(user.uuid)) {
                    game.startNewPlay();
                  }
                  if (game.allPlayersAreActives()) {
                    game.unsetPause();
                    io.sockets.in(game.uuid).
                        emit('game_broadcast_resume', JSON.stringify({
                          gameId: game.uuid,
                          label: 'The instance is now resuming',
                        }));
                  }
                } else {
                  socket.emit('user_join_game_error', JSON.stringify({
                    msg: 'Your are not in the list of player',
                    player: game.player,
                    user: user.json(),
                  }));
                }
              } else {
                socket.emit('user_join_game_error', JSON.stringify({
                  gameState: game.state,
                  msg: 'Can not join game in current state : ' + game.state,
                }));
              }
            } else {
              socket.emit('user_join_game_error', JSON.stringify({
                user: user ? user.json() : undefined,
                game: game ? game.json() : undefined,
                msg: 'User or game not found',
              }));
            }

          },
      );
};

module.exports.socketLeaveGameInstance = (socket, io, from) => {
  return Promise.all(
      [
        GamesService.getById(socket.gameId),
        UsersService.getById(socket.userId)]).
      then(
          data => {
            let user = data[1];
            let game = data[0];
            if (user && game) {
              if (game.state === 'IN_GAME' && from !== 'LOBBY') {
                game.setPause();
                io.sockets.in(game.uuid).
                    emit('game_broadcast_pause', JSON.stringify({
                      gameId: game.uuid,
                      label: 'Pause because ' + user.name +
                      ' left the instance',
                    }));
              } else if (game.state === 'LOBBY') {
                game.removePlayer(socket.userId);
                socket.gameId = game.uuid;
                askStartGame(game, io);
              }
              if (game && game.iEmpty()) {
                GamesService.deleteById(socket.gameId).catch(() => {
                });
              }
            }
          },
      ).catch(() => {
      });
};

function askStartGame(game, io) {
  io.sockets.in(game.uuid).
      emit('game_broadcast_list_player', JSON.stringify({
        playerList: game.players.map(player => player.user.name),
        gameId: game.uuid,
      }));
  if (game.hasEnoughPlayer()) {
    game.creator.socket.emit('game_ask_start', JSON.stringify({
      numberOfPlayer: game.players.length,
      gameId: game.uuid,
    }));
  }
}

module.exports.socketStartGameInstance = (socket, io) => {
  return GamesService.getById(socket.gameId).
      then(game => game.startGame());
};

module.exports.socketPickCard = (
    socket, io, userToId, index) => {
  return GamesService.getById(socket.gameId).
      then(game => {
        if (game) {
          let card = game.pickCard(socket.userId, userToId, index);
          Promise.all(
              [
                UsersService.getById(socket.userId),
                UsersService.getById(userToId)]).
              then(data => {
                game.players.forEach(player => {
                  player.user.socket.emit('game_broadcast_info',
                      JSON.stringify({
                        me: {
                          uuid: player.user.uuid,
                          name: player.user.name,
                          cards: game.shuffledCards(player.cards),
                        },
                        gameId: game.uuid,
                        card: card,
                        userFromName: data[0] ? data[0].name : 'one player',
                        userToName: data[1] ? data[1].name : 'other player',
                        currentPlayer: game.players[game.currentPlayerIndex].user.name,
                        numberOfDefuseFound: game.numberOfDefuseFound,
                        numberOfDefuseToFind: game.players.length,
                        numberOfCardsToPickThisRound: game.players.length,
                        numberOfCardPickedThisRound: game.cardPicked.length -
                        ((game.roundNumber - 1) * game.players.length),
                      }));
                });
              }).then(
              () => {
                if (game.isEndOfGame()) {
                  let res = game.endGame();
                  io.sockets.in(socket.gameId).
                      emit('game_broadcast_end', JSON.stringify(res));
                } else if (game.isEndOfRound()) {
                  game.startRound();
                } else {
                  game.startNewPlay();
                }
              },
          );
        }

      });
};

module.exports.socketMessage = (
    socket, io, message) => {
  return GamesService.getById(socket.gameId).
      then(game => {
        if (game) {
          game.setMessage(socket.userId, JSON.parse(message));
          io.sockets.in(socket.gameId).
              emit('game_broadcast_message', JSON.stringify({
                gameId: socket.gameId,
                playerMessages: game.getMessages(),
              }));
        }

      });
};

module.exports.socketDeleteGame = (socket, uuid) => {
  return GamesService.deleteById(uuid).then(
      () => {
        socket.emit('game_delete_success');
      },
  ).catch((err) => {
    console.error(err);
    socket.emit('custom_error', JSON.stringify(err));
  });
};