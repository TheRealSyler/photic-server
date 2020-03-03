import { config } from 'dotenv';
config();
import express from 'express';
import router from './router';

const port = process.env.PORT || 4000;

const app = express();

app.use(router);

app.listen(port, () => {
  console.log('listening on', port);
});
