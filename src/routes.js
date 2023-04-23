import { Router } from 'express';

const API_ENTRYPOINT = '/api/v1';
const router = Router();

router.get(`${API_ENTRYPOINT}/test`, async (_, res) => {
  return res.json({
    funcionando: true
  });
});

export default router;
