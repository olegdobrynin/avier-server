import Router from 'express';
import userRouter from './user.js';

const router = new Router();

router.use('/user', userRouter);

export default router;
