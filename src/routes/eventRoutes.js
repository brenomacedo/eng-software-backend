import { Router } from 'express';
import eventController from '../controllers/eventController.js';
import auth from '../middlewares/auth.js';

const router = new Router();

router.post('/event', auth, eventController.create);
router.get('/event/me', auth, eventController.indexUserEvents);
router.get('/event/all', eventController.indexNearestEvents);
router.get('/event/all/:title', eventController.searchAll)
router.get('/event', auth, eventController.indexNearestEvents);
router.get('/event/:title/:userId', eventController.search)
router.patch('/event/:id', auth, eventController.update);
router.delete('/event/:id', auth, eventController.delete);

export default router;
