const UsersService = require('@services/UsersService');
const pokemon = require('pokemon');

module.exports.createBySocket = (socket, userData) => {

  let userDataJson;
  try {
    userDataJson = JSON.parse(userData);
  } catch (e) {
    userDataJson = {};
  }
  let name = userDataJson.name;

  let isNameValid = (name) => !(name === 'undefined' || name ===
      undefined ||
      name === null || name === '');

  let generatedName = isNameValid(name) ? name : pokemon.random('fr');

  return UsersService.getByName(generatedName).then(
      user => {
        if (user) {
          if (user.socket && user.socket.connected) {
            if (userDataJson.uuid === user.uuid) {
              return user;
            } else {
              throw 'user name already exist : ' + generatedName;
            }
          } else {
            return user;
          }
        } else {
          return UsersService.create(generatedName);
        }
      },
  ).then(
      user => {
        socket.userId = user.uuid;
        socket.userName = user.name;
        user.setSocket(socket);
        socket.emit('user_create_success', JSON.stringify(user.json()));
        return user;
      },
  ).catch((err) => {
    console.error(err);
    socket.emit('create_user_error', JSON.stringify(err));
  });
};

module.exports.socketGetUsers = (socket) => {
  return UsersService.read().then(
      users => {
        socket.emit('user_list_success',
            JSON.stringify(users.map(u => u.json())));
      },
  ).catch((err) => {
    console.error(err);
    socket.emit('custom_error', JSON.stringify(err));
  });
};

module.exports.socketDeleteUser = (socket, uuid) => {
  return UsersService.deleteById(uuid).then(
      () => {
        socket.emit('user_delete_success');
      },
  ).catch((err) => {
    console.error(err);
    socket.emit('custom_error', JSON.stringify(err));
  });
};

module.exports.socketSetUserAdmin = (socket, data) => {
  let dataJson = JSON.parse(data);
  return UsersService.getById(dataJson.uuid).then(
      (user) => {
        user.isAdmin = dataJson.isAdmin;
      },
  ).catch((err) => {
    console.error(err);
    socket.emit('custom_error', JSON.stringify(err));
  });
};

module.exports.deleteAllUser = UsersService.deleteAllUser;
