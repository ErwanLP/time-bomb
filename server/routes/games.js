let express = require('express')
const GameController = require('@controllers/GameController')
let router = express.Router()

router.post('/', GameController.create)

router.get('/', GameController.read)

router.get('/notStarted', GameController.readNotStartedGames)

module.exports = router
