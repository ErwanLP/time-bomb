const User = require('@models/User');

let userList = [];

module.exports.create = function(uuid, name) {
  return new Promise((resolve, reject) => {
    try {
      let suffix = '';
      while (nameAlreadyExist(name + suffix)) {
        if (suffix === '') {
          suffix = 2;
        } else {
          suffix++;
        }
      }
      let u = new User(uuid, suffix === '' ? name : name + ' ' + suffix);
      userList.push(u);
      resolve(u);
    } catch (e) {
      reject(e);
    }
  });
};

function nameAlreadyExist(name) {
  return userList.find(user => user.name === name) !== undefined;
}

module.exports.read = function() {
  return new Promise((resolve) => {
    resolve(userList);
  });
};

module.exports.getById = function(id) {
  return new Promise((resolve, reject) => {
    let u = userList.find(u => u.uuid === id);
    if (u !== undefined) {
      resolve(u);
    } else {
      reject();
    }
  });
};

module.exports.getByName = function(name) {
  return new Promise((resolve) => {
    if (!name) {
      resolve();
    } else {
      let u = userList.find(u => u.name === name);
      if (u !== undefined) {
        resolve(u);
      } else {
        resolve();
      }
    }
  });
};

module.exports.deleteById = function(id) {
  return new Promise((resolve, reject) => {
    let index = userList.findIndex(u => u.uuid === id);
    if (index !== -1) {
      userList.splice(index, 1);
      resolve();
    } else {
      reject();
    }
  });
};