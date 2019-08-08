import request from 'supertest';
import app from '../../src/app';

import factory from '../factories';

export default async function startSession(email) {
  const user = await factory.attrs('User', email ? { email } : undefined);
  await request(app)
    .post('/users')
    .send(user);

  const response = await request(app)
    .post('/session')
    .send(user);

  return response.body.token;
}
