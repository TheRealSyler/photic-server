import { error } from './routes/errors';
import { logAction } from './utils/logAction';
import { Server } from '.';

export function setUpRouter(this: Server) {
  this.router.use((req, res, next) => {
    req.query.logAction(req.method, req.url);
    next();
  });

  this.router.get('/repositories', (req, res) => {
    res.json(this.db.get('repositories'));
  });

  this.router.get('/*', (req, res) => res.send(error(404)));
}
