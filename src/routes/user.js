import Router from 'express';
import UserController from '../controllers/user.js';
import authMiddleware from '../middlewares/auth.js';

const router = new Router();

router.get('/auth', authMiddleware, UserController.check);
router.post('/registration', UserController.registration);
router.post('/login', UserController.login);
router.route('/:id(\\d+)')
  .get(UserController.info)
  .delete(UserController.delete);

export default router;
