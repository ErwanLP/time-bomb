let express = require('express')
let router = express.Router()
let path = require('path')

router.post('/ping', function (req, res, next) {
  res.status(200).send({})
})

router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname + './../../pwa/dist/index.html'))
})

module.exports = router
