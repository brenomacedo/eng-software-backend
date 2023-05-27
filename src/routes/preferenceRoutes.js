import { Router } from 'express';
import preferenceController from '../controllers/preferenceController.js';
import auth from '../middlewares/auth.js';

const router = new Router();

router.post('/preference', auth, preferenceController.addPreference);
router.delete(
  '/preference/:categoryId',
  auth,
  preferenceController.removePreference
);

export default router;
