let express = require('express')
const GameController = require('@controllers/GameController')
let router = express.Router()

router.post('/:id/join', GameController.join)

router.post('/', GameController.create)

router.get('/', GameController.read)

module.exports = router
