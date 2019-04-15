const UsersService = require('@services/UsersService');
const uuidv4 = require('uuid/v4');
const pokemon = require('pokemon');

module.exports.createBySocket = (socket, name) => {

  let isNameValid = (name) => !(name === 'undefined' || name === undefined ||
      name === null);

  let generatedName = isNameValid(name) ? name : pokemon.random('fr');

  return UsersService.getByName(generatedName).then(
      user => {
        if (user) {
          if (user.isActive()) {
            return UsersService.create(uuidv4(), generatedName);
          } else {
            return user;
          }
        } else {
          return UsersService.create(uuidv4(), generatedName);
        }
      }
  ).then(
      user => {
        socket.userId = user.uuid;
        socket.userName = user.name;
        user.setSocket(socket);
        user.setActive();
        socket.emit('user_create_success', user.stringify());
        return user;
      }
  ).catch((err) => {
    console.error(err);
    socket.emit('custom_error', JSON.stringify(err));
  });
};

module.exports.socketLeave = (socket, io) => {
  return UsersService.getById(socket.userId).
      then(
          user => {
            if (user) {
              user.setInactive();
            }
          }
      ).catch(console.error);
};

module.exports.deleteAllUser = UsersService.deleteAllUser;
