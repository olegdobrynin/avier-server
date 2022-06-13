import Router from 'express';
import ArtController from '../c/art.js';

const router = new Router();

router.route('/:id(\\d+)')
  .get(ArtController.getOne);
router.route('/')
  .get(ArtController.getAll)
  .post(ArtController.create);

export default router;
