import Router from 'express';
import MarkController from '../controllers/mark.js';

const router = new Router();

router.route('/:id(\\d+)')
  .get(MarkController.getAll)
  .post(MarkController.mark)
  .delete(MarkController.unMark);

export default router;
