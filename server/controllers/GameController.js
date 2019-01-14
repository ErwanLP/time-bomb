const GamesService = require('@services/GamesService')
const uuidv4 = require('uuid/v4')

module.exports.create = (req, res, next) => {
  return GamesService.create(uuidv4(), req.body.name).then(
    (data) => {
      console.log(data)
      res.json(data)
    },
    (err) => {
      console.error(err)
      res.status(400).send(err)
    },
  )
}

module.exports.read = (req, res, next) => {
  return GamesService.read().then(
    (data) => {
      res.json(data)
    },
    (err) => {
      console.error(err)
      res.status(400).send(err)
    },
  )
}