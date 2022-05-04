const Router = require('express')
const userController = require('../controllers/userController')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', userController.registration)
router.post('/login',userController.login)
router.get('/auth', authMiddleware, userController.check)
router.get('/info', userController.info)

module.exports = router