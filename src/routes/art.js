import { Router } from 'express';
import multer from 'multer';
import { defaultLimits, fileFilter } from '../utils/multer.js';
import ArtController from '../controllers/art.js';
import authorization from '../middlewares/authorization.js';

const router = new Router();
const upload = multer({ fileFilter, limits: { ...defaultLimits, fields: 7, files: 5 } });

router.route('/:id(\\d+)')
  .get(ArtController.getOne)
  .delete(authorization(2), ArtController.delete);
router.route('/')
  .get(ArtController.getAll)
  .post(authorization(2), upload.array('img'), ArtController.create);

export default router;
