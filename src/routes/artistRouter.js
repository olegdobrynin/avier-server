const Router = require('express')
const router = new Router()
const artistController = require('../controllers/artistController')

router.post('/', artistController.create)
router.post('/', artistController.edit)
router.get('/', artistController.getAll)
router.delete('/', artistController.delete)

module.exports = router