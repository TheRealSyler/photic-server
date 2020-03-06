import { config } from 'dotenv';
config();
import express, { Router } from 'express';
import { Data, fetchRepositories } from './db';
import { setUpRouter } from './router';
import { logAction } from './utils/logAction';
import Conf from 'conf';
import cors from 'cors';

export class Server {
  port = process.env.PORT || 4000;
  app = express();
  router = Router();
  db = new Conf<Data>();
  constructor() {
    this.init();
  }
  async init() {
    logAction('INIT', 'Server');
    // this.db.clear();
    this.app.use(
      cors({
        origin: process.env.MODE === 'development' ? '*' : process.env.WEBSITE_ORIGIN
      })
    );

    if (!this.db.has('repositories')) {
      logAction('DB INIT', 'Repositories');
      this.db.set('repositories', await fetchRepositories());
    }

    setInterval(async () => {
      logAction('DB Update', 'Repositories');
      this.db.set('repositories', await fetchRepositories());
    }, 1000 * 60 * 60 * 24);

    setUpRouter.call(this);

    this.app.use(this.router);

    this.app.listen(this.port, () => {
      logAction('LISTENING', this.port.toString());
    });
  }
}

new Server();
