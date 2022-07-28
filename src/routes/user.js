import express, { Router } from 'express';
import UserController from '../controllers/user.js';
import authorization from '../middlewares/authorization.js';

const router = new Router();

router.get('/auth', authorization(), UserController.check);
router.post('/registration', express.json(), UserController.registration);
router.post('/login', express.json(), UserController.login);
router.patch('/role', authorization(1), express.json(), UserController.changeRole);
router.route('/:id(\\d+)')
  .delete(authorization(), UserController.delete);

export default router;
