const Router = require('express')
const router = new Router()
const markController = require('../controllers/markController')


router.post('/', markController.mark)
router.get('/', markController.getAll)
router.delete('/', markController.unMark)


module.exports = router