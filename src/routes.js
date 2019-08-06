import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';

import validateUserStore from './app/validators/UserStore';
import validateSessionStore from './app/validators/SessionStore';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', validateUserStore, UserController.store);

routes.post('/session', validateSessionStore, SessionController.store);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
