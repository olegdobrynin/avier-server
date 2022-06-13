import Router from 'express';
import ArtController from '../controllers/art.js';

const router = new Router();

router.route('/:id(\\d+)')
  .get(ArtController.getOne)
  .delete(ArtController.delete);
router.route('/')
  .get(ArtController.getAll)
  .post(ArtController.create);

export default router;
