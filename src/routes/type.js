import Router from 'express';
import TypeController from '../controllers/type.js';
import checkRole from '../middlewares/checkRole.js';

const router = new Router();

router.delete('/:id(\\d+)', checkRole('admin'), TypeController.delete);
router.route('/')
  .get(TypeController.getAll)
  .post(checkRole('admin'), TypeController.create);

export default router;
