import request from 'supertest';
import app from '~/app';

import factory from '../factories';

import truncate from '../util/truncate';

describe('Session', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should create a session', async () => {
    const user = await factory.attrs('User');
    await request(app)
      .post('/users')
      .send(user);

    const response = await request(app)
      .post('/session')
      .send(user);

    expect(response.body).toHaveProperty('token');
  });

  it('the password should not match', async () => {
    const user = await factory.attrs('User');
    await request(app)
      .post('/users')
      .send(user);
    user.password = 'outroPassword';

    const response = await request(app)
      .post('/session')
      .send(user);

    expect(response.status).toBe(400);

    expect(response.body).toHaveProperty('error');

    expect(response.body.error).toBe('Password does not match');
  });

  it('the email should not exist', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/session')
      .send(user);

    expect(response.status).toBe(400);

    expect(response.body).toHaveProperty('error');

    expect(response.body.error).toBe('User not found');
  });

  it('the should not accept empty email', async () => {
    const user = await factory.attrs('User', { email: '' });

    await request(app)
      .post('/users')
      .send(user);

    const response = await request(app)
      .post('/session')
      .send(user);

    expect(response.status).toBe(400);

    expect(response.body).toHaveProperty('error');

    expect(response.body.error).toBe('Validation fails');
  });

  it('the should not accept empty password', async () => {
    const user = await factory.attrs('User', { password: '' });

    await request(app)
      .post('/users')
      .send(user);

    const response = await request(app)
      .post('/session')
      .send(user);

    expect(response.status).toBe(400);

    expect(response.body.error).toBe('Validation fails');
  });
});
