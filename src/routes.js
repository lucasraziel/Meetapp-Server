import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import SubscriptionController from './app/controllers/SubscriptionController';
import AvailableController from './app/controllers/AvailableController';

import validateUserStore from './app/validators/UserStore';
import validateSessionStore from './app/validators/SessionStore';
import validateMeetupStore from './app/validators/MeetupStore';
import validateMeetupUpdate from './app/validators/MeetupUpdate';
import validateMeetupDelete from './app/validators/MeetupDelete';
import validateSubscriptionStore from './app/validators/SubscriptionStore';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', validateUserStore, UserController.store);

routes.post('/session', validateSessionStore, SessionController.store);

routes.get('/meetups/available', AvailableController.store);

routes.use(authMiddleware);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/meetups', validateMeetupStore, MeetupController.store);

routes.put('/meetups', validateMeetupUpdate, MeetupController.update);

routes.get('/meetups', MeetupController.index);

routes.delete('/meetups/:id', validateMeetupDelete, MeetupController.delete);

routes.post(
  '/subscriptions',
  validateSubscriptionStore,
  SubscriptionController.store
);

routes.get('/subscriptions', SubscriptionController.index);

export default routes;
