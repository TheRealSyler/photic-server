import { error } from './routes/errors';
import { logAction } from './utils/logAction';
import { Server } from '.';
import { fetchRepositories } from './db';

export function setUpRouter(this: Server) {
  this.router.use(async (req, res, next) => {
    logAction(req.method, req.url);
    next();

    if (this.lastDBUpdate + 1000 * 60 * 60 * 6 <= Date.now()) {
      this.lastDBUpdate = Date.now();
      logAction('DB Update', 'Repositories');
      this.db.set('repositories', await fetchRepositories());
      logAction('DB Update', 'Repositories Finished');
    }
  });

  this.router.get('/repositories', (req, res) => {
    res.json(this.db.get('repositories'));
  });

  this.router.get('/*', (req, res) => res.status(404).send(error(404)));
}
