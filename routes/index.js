const Router = require('express')
const router = new Router()
const artistRouter = require('./artistRouter')
const folderRouter = require('./folderRouter')
const artRouter = require('./artRouter')
const markRouter = require('./markRouter')
const typeRouter = require('./typeRouter')
const userRouter = require('./userRouter')

router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/mark', markRouter)
router.use('/art', artRouter)
router.use('/folder', folderRouter)
router.use('/artist', artistRouter)

module.exports = router