import { Router } from 'express';
import userController from '../controllers/userController.js';
import authController from '../controllers/authController.js';
import auth from '../middlewares/auth.js';
import commentController from '../controllers/commentController.js';

const router = new Router();

router.post('/auth', auth, authController.auth);
router.post('/user/signup', authController.signup);
router.post('/user/login', authController.login);
router.post('/user/rate', auth, userController.rateUser);
router.patch('/user/:id', auth, userController.update);
router.get('/user/:id', userController.show);
router.delete('/user/:id', auth, userController.delete);
router.get('/user', userController.index);
router.post('/recoverpassword', userController.recoverPassword);
router.post('/changepassword', userController.changePassword);
router.post('/comment/:id', auth, commentController.create);
router.delete('/comment/:id', auth, commentController.delete);
router.get('/comment/:id', commentController.index);

export default router;
