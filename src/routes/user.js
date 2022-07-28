import express, { Router } from 'express';
import UserController from '../controllers/user.js';
import authorization from '../middlewares/authorization.js';

const router = new Router();

router.get('/auth', authorization('admin', 'artist', 'user'), UserController.check);
router.post('/registration', express.json(), UserController.registration);
router.post('/login', express.json(), UserController.login);
router.patch('/role', authorization('admin'), express.json(), UserController.changeRole);
router.use(authorization('admin', 'artist', 'user')).route('/:id(\\d+)')
  .delete(UserController.delete);

export default router;
