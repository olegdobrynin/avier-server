import Router from 'express';
import artistRouter from './artist.js';
import typeRouter from './type.js';
import userRouter from './user.js';

const router = new Router();

router.use('/artist', artistRouter);
router.use('/type', typeRouter);
router.use('/user', userRouter);

export default router;
