import { Router } from 'express';
import userController from '../controllers/userController.js';
import authController from '../controllers/authController.js';
import auth from '../middlewares/auth.js';

const router = new Router();

router.post('/auth', auth, authController.auth);
router.post('/user/signup', authController.signup);
router.post('/user/login', authController.login);
router.patch('/user/:id', auth, userController.update);
router.get('/user', userController.index);
router.get('/user/:id', userController.show);
router.delete('/user/:id', auth, userController.delete);
router.post('/recoverpassword', userController.recoverPassword);

export default router;
