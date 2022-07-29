import { Router } from 'express';
import multer from 'multer';
import { defaultLimits, fileFilter } from '../utils/multer.js';
import ArtistController from '../controllers/artist.js';
import authorization from '../middlewares/authorization.js';

const router = new Router();
const upload = multer({ fileFilter, limits: { ...defaultLimits, fields: 3, files: 1 } });

router.route('/:id(\\d+)')
  .get(ArtistController.getOne)
  .patch(authorization(1), upload.single('img'), ArtistController.update)
  .delete(authorization(1), ArtistController.delete);
router.route('/')
  .get(authorization(2), ArtistController.getAll)
  .post(authorization(1), upload.single('img'), ArtistController.create);

export default router;
