import { Router } from 'express';
import LikeController from '../controllers/like.js';

const router = new Router();

router.get('/', LikeController.getAll);
router.route('/:artId(\\d+)')
  .post(LikeController.like)
  .delete(LikeController.unLike);

export default router;
