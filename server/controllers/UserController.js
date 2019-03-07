const UsersService = require('@services/UsersService');
const uuidv4 = require('uuid/v4');
const randomFullName = require('random-fullName');

module.exports.createBySocket = (socket, userName) => {
  return UsersService.create(uuidv4(),
      (userName === 'undefined' || userName === undefined || userName === null)
          ? randomFullName()
          : userName).then(
      (user) => {
        socket.userId = user.uuid;
        socket.userName = user.name;
        socket.emit('user_create_success', JSON.stringify(user));
      },
      (err) => {
        console.error(err);
        socket.emit('error', JSON.stringify(err));
      },
  );
};

module.exports.create = (req, res, next) => {
  return UsersService.create(uuidv4(), req.body.name || randomFullName()).then(
      (data) => {
        res.json(data);
      },
      (err) => {
        console.error(err);
        res.status(400).send(err);
      },
  );
};

module.exports.read = (req, res, next) => {
  return UsersService.read().then(
      (data) => {
        res.json(data);
      },
      (err) => {
        console.error(err);
        res.status(400).send(err);
      },
  );
};