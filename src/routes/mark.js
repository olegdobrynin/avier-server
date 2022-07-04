import Router from 'express';
import MarkController from '../controllers/mark.js';

const router = new Router();

router.route('/:id(\\d+)')
  .get(MarkController.getAll);
router.route('/:id(\\d+)/art/:artId(\\d+)')
  .get(MarkController.getOne)
  .post(MarkController.mark)
  .delete(MarkController.unMark);

export default router;
