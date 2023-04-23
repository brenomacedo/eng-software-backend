import { Router } from 'express';
import userController from '../controllers/userController.js';

const router = new Router();

// Route for userController.create
router.post('/user', userController.create);

// Route for userController.update
router.patch('/user/:id', userController.update);

// Route for userController.index
router.get('/user', userController.index);

// Route for userController.show
router.get('/user/:id', userController.show);

// Route for userController.delete
router.delete('/user/:id', userController.delete);

export default router;
