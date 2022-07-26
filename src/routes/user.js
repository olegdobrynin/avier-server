import express, { Router } from 'express';
import UserController from '../controllers/user.js';
import authorization from '../middlewares/authorization.js';

const router = new Router();

router.get('/auth', authorization, UserController.check);
router.post('/registration', express.json(), UserController.registration);
router.post('/login', express.json(), UserController.login);
router.route('/:id(\\d+)')
  .delete(UserController.delete);

export default router;
