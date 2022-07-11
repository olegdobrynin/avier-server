import { Router } from 'express';
import LikeController from '../controllers/like.js';

const router = new Router();

router.route('/:id(\\d+)')
  .get(LikeController.getAll);
router.route('/:id(\\d+)/art/:artId(\\d+)')
  .post(LikeController.like)
  .delete(LikeController.unLike);

export default router;
