const UsersService = require('@services/UsersService')
const uuidv4 = require('uuid/v4')
const randomFullName = require('random-fullName')

module.exports.create = (req, res, next) => {
  return UsersService.create(uuidv4(), req.body.name || randomFullName()).then(
    (data) => {
      res.json(data)
    },
    (err) => {
      console.error(err)
      res.status(400).send(err)
    },
  )
}

module.exports.read = (req, res, next) => {
  return UsersService.read().then(
    (data) => {
      res.json(data)
    },
    (err) => {
      console.error(err)
      res.status(400).send(err)
    },
  )
}