import express, { Router } from 'express';
import TypeController from '../controllers/type.js';
import authorization from '../middlewares/authorization.js';

const router = new Router();

router.delete('/:id(\\d+)', authorization(0), TypeController.delete);
router.route('/')
  .get(TypeController.getAll)
  .post(authorization(0), express.json(), TypeController.create);

export default router;
