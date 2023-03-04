import { Application } from 'express';
import { Router } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { getStats, getStatus } from '../controllers/AppController';
import { addUser } from '../controllers/UsersController';
import { getConnect, getDisconnect } from '../controllers/AuthController';
import * as userRoutes from './users';

const router = Router();

const routeSetup = (app: Application) => {
  app.use(morgan('combined'));
  app.use(helmet());
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/users', userRoutes.authRoutes);
  app.route('/status').get(getStatus);
  app.route('/stats').get(getStats);
  app.route('/connect').get(getConnect);
  app.route('/disconnect').get(getDisconnect);
};

export { routeSetup };
