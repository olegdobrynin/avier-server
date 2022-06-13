import Router from 'express';
import MarkController from '../controllers/mark.js';

const router = new Router();

router.route('/:id(\\d+)')
  .post(MarkController.mark);

export default router;
