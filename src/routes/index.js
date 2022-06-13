import Router from 'express';
import typeRouter from './type.js';
import userRouter from './user.js';

const router = new Router();

router.use('/type', typeRouter);
router.use('/user', userRouter);

export default router;
