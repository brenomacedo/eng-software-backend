import { Router } from 'express';
import eventController from '../controllers/eventController.js';
import auth from '../middlewares/auth.js';

const router = new Router();

router.post('/event', auth, eventController.create);
router.get('/event/me', auth, eventController.indexUserEvents);
router.get('/event', auth, eventController.indexNearestEvents);
router.patch('/event/:id', auth, eventController.update);
router.delete('/event/:id', auth, eventController.delete);

export default router;
