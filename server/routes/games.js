let express = require('express')
const GameController = require('@controllers/GameController')
let router = express.Router()

router.get('/notStarted', GameController.readNotStartedGames)

module.exports = router
