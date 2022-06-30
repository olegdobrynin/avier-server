const Router = require('express')
const router = new Router()
const folderController = require('../controllers/folderController')

router.post('/', folderController.create)
router.get('/', folderController.getAll)
router.post('/', folderController.edit)
router.delete('/', folderController.delete)


module.exports = router