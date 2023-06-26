import { Router } from 'express';
import requestController from '../controllers/requestController.js';
import auth from '../middlewares/auth.js';

const router = new Router();

router.get('/request/me', auth, requestController.searchRequests)
router.post('/request', auth, requestController.create);
router.patch('/request/:id', auth, requestController.respond);


export default router;
 