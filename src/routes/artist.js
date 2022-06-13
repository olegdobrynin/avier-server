import Router from 'express';
import ArtistController from '../controllers/artist.js';

const router = new Router();

router.route('/')
  .get(ArtistController.getAll)
  .post(ArtistController.create);
router.route('/:id(\\d+)')
  .get(ArtistController.getOne)

export default router;
