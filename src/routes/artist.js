import Router from 'express';
import ArtistController from '../controllers/artist.js';

const router = new Router();

router.route('/:id(\\d+)')
  .get(ArtistController.getOne)
  .patch(ArtistController.update)
  .delete(ArtistController.delete);
router.route('/')
  .get(ArtistController.getAll)
  .post(ArtistController.create);

export default router;
