import { Router } from 'express';
import artRouter from './art.js';
import artistRouter from './artist.js';
import likeRouter from './like.js';
import markRouter from './mark.js';
import typeRouter from './type.js';
import userRouter from './user.js';
import authorization from '../middlewares/authorization.js';

const router = new Router();

router.use('/art', artRouter);
router.use('/artist', artistRouter);
router.use('/like', authorization(2), likeRouter);
router.use('/mark', authorization(2), markRouter);
router.use('/type', typeRouter);
router.use('/user', userRouter);

export default router;
