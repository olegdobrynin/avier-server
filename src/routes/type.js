import Router from 'express';
import TypeController from '../controllers/type.js';
import checkRole from '../middlewares/checkRole.js';

const router = new Router();

router.delete('/:id(\\d+)', checkRole('ADMIN'), TypeController.delete);
router.route('/')
  .get(TypeController.getAll)
  .post(checkRole('ADMIN'), TypeController.create);

export default router;
