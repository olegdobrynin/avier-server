import Router from 'express';
import multer from 'multer';
import { defaultLimits, fileFilter } from '../helpers/multer.js';
import ArtistController from '../controllers/artist.js';

const router = new Router();
const upload = multer({ fileFilter, limits: { ...defaultLimits, fields: 3, files: 1 } });

router.route('/:id(\\d+)')
  .get(ArtistController.getOne)
  .patch(upload.single('img'), ArtistController.update)
  .delete(ArtistController.delete);
router.route('/')
  .get(ArtistController.getAll)
  .post(upload.single('img'), ArtistController.create);

export default router;
