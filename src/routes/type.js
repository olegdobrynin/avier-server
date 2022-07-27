import express, { Router } from 'express';
import TypeController from '../controllers/type.js';
import authorization from '../middlewares/authorization.js';

const router = new Router();

router.delete('/:id(\\d+)', authorization('admin'), TypeController.delete);
router.route('/')
  .get(TypeController.getAll)
  .post(authorization('admin'), express.json(), TypeController.create);

export default router;
