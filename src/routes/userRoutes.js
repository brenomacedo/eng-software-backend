import { Router } from 'express';
import userController from '../controllers/userController.js';
import authController from '../controllers/authController.js';

const router = new Router();

// Route for authController.create
router.post('/user/signup', authController.signup);

//Route for authController.login
//this route is used to make login
router.post('/user/login', authController.login);

// Route for userController.update
router.patch('/user/:id', userController.update);

// Route for userController.index
router.get('/user', userController.index);

// Route for userController.show
router.get('/user/:id', userController.show);

// Route for userController.delete
router.delete('/user/:id', userController.delete);

export default router;
