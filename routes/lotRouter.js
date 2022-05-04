const Router = require('express')
const router = new Router()
const lotController = require('../controllers/lotController')

router.post('/', lotController.create)
router.get('/', lotController.getAll)
router.get('/:id', lotController.getOne)
router.delete('/', lotController.delete)


module.exports = router