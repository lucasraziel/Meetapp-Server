import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import validateUserStore from './app/validators/UserStore';
import validateSessionStore from './app/validators/SessionStore';

const routes = new Router();

routes.post('/users', validateUserStore, UserController.store);

routes.post('/session', validateSessionStore, SessionController.store);

export default routes;
