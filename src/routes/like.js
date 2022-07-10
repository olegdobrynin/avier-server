import { Router } from 'express';
import LikeController from '../controllers/like.js';

const router = new Router();

router.get('/:id(\\d+)', LikeController.getAll);
router.route('/:id(\\d+)/art/:artId(\\d+)')
  .post(LikeController.like)
  .delete(LikeController.unLike);

export default router;
