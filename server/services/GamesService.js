const Game = require('@models/Game');

const LOBBY = 'LOBBY';
const PAUSE = 'PAUSE';

let gameList = [];

module.exports.create = function(uuid, name, userId) {
  return new Promise((resolve, reject) => {
    try {
      let g = new Game(uuid, name, userId);
      gameList.unshift(g);
      resolve(g);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports.read = function() {
  return new Promise((resolve) => {
    resolve(
        gameList.filter(g => g.state === LOBBY || g.state === PAUSE).map(g => {
          return {
            name: g.name,
            uuid: g.uuid,
            players: g.players.map(p => ({user: p.user.json()})),
            state: g.state
          };
        }));
  });
};

module.exports.getById = function(id) {
  return new Promise((resolve) => {
    let g = gameList.find(u => u.uuid === id);
    if (g !== undefined) {
      resolve(g);
    } else {
      resolve();
    }
  });
};

module.exports.deleteById = function(id) {
  return new Promise((resolve, reject) => {
    let index = gameList.findIndex(g => g.uuid === id);
    if (index > -1) {
      gameList.splice(index, 1);
      resolve();
    } else {
      reject();
    }
  });
};

module.exports.deleteAllInstance = function() {
  gameList = [];
};