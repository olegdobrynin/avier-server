import { Router } from 'express';
import folderController from '../controllers/folder.js';

const router = new Router();

router.route('/')
  .post(folderController.create)
  .get(folderController.getAll)
  .post(folderController.edit)
  .delete(folderController.delete);

export default router;
