import { Router } from 'express';
import { handleGetRepositories } from './routes/repositories';
import { error } from './routes/errors';
import { logAction } from './utils/logAction';

const router = Router();
router.use((req, res, next) => {
  logAction(req.method, req.url);
  next();
});

router.get('/repositories', handleGetRepositories);

router.get('/*', (req, res) => res.send(error(404)));

export default router;
