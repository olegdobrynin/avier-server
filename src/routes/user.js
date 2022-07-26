import Router from 'express';
import UserController from '../controllers/user.js';
import authorization from '../middlewares/authorization.js';

const router = new Router();

router.get('/auth', authorization, UserController.check);
router.post('/registration', UserController.registration);
router.post('/login', UserController.login);
router.route('/:id(\\d+)')
  .delete(UserController.delete);

export default router;
