let express = require('express')
const UserController = require('@controllers/UserController')
let router = express.Router()

router.post('/', UserController.create)

router.get('/', UserController.read)

module.exports = router
