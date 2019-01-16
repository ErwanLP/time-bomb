let express = require('express')
let router = express.Router()

router.post('/ping', function (req, res, next) {
  res.status(200).send({})
})


module.exports = router
