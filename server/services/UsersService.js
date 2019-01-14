const User = require('@models/User')

let userList = []

module.exports.create = function (uuid, name) {
  return new Promise((resolve, reject) => {
    let g = new User(uuid, name)
    userList.push(g)
    resolve(g)
  })
}

module.exports.read = function () {
  return new Promise((resolve, reject) => {
    resolve(userList)
  })
}

module.exports.getById = function (id) {
  return new Promise((resolve, reject) => {
    resolve(userList.find(u => u.uuid === id))
  })
}