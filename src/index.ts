import { config } from 'dotenv';
config();
import express, { Router } from 'express';
import { Data, fetchRepositories } from './db';
import { setUpRouter } from './router';
import { logAction } from './utils/logAction';
import Conf from 'conf';
import cors from 'cors';

export class Server {
  port = process.env.PORT;
  app = express();
  router = Router();
  db = new Conf<Data>();
  lastDBUpdate = Date.now();
  constructor() {
    this.init();
  }
  async init() {
    logAction('INIT', 'Server');
    // this.db.clear();
    this.app.use(
      cors({
        origin: process.env.WEBSITE_ORIGIN
      })
    );

    if (!this.db.has('repositories')) {
      logAction('DB INIT', 'Repositories');
      this.db.set('repositories', await fetchRepositories());
      logAction('DB INIT', 'Repositories Finished');
    }

    setUpRouter.call(this);

    this.app.use(this.router);

    this.app.listen(this.port, () => {
      logAction('LISTENING', String(this.port));
    });
  }
}

new Server();
