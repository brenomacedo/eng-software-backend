import { Router } from "express";
import addressController from '../controllers/addressController.js'

const router = new Router();

router.post('/address', addressController.create);

router.patch('/address/:id', addressController.update)

export default router;