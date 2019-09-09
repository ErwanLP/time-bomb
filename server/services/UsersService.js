const User = require('@models/User');

let userList = [];

module.exports.create = function(name) {
  return new Promise((resolve, reject) => {
    let u = new User(name);
    userList.push(u);
    resolve(u);
  });
};

module.exports.read = function() {
  return new Promise((resolve) => {
    resolve(userList.sort((a, b) => b.connectionDate - a.connectionDate));
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

module.exports.deleteAllUser = function() {
  userList = [];
};