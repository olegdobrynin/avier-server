const Router = require('express')
const router = new Router()
const artController = require('../controllers/artController')

router.post('/', artController.create)
router.get('/', artController.getAll)
router.get('/:id', artController.getOne)
router.delete('/', artController.delete)


module.exports = router