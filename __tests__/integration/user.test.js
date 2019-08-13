import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '~/app';

import factory from '../factories';

import truncate from '../util/truncate';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to register', async () => {
    const user = await factory.attrs('User');
    const response = await request(app)
      .post('/users')
      .send(user);
    expect(response.body).toHaveProperty('id');
  });

  it('should encrypt user password when new user created', async () => {
    const user = await factory.create('User', {
      password: '123456',
    });

    const compareHash = await bcrypt.compare('123456', user.password_hash);

    expect(compareHash).toBe(true);
  });

  it('should return an invalid password error', async () => {
    const user = await factory.attrs('User', { password: '123' });

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.status).toBe(400);
  });

  it('should return an invalid name error', async () => {
    const user = await factory.attrs('User', { name: '' });

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.status).toBe(400);
  });

  it('should not registar a duplicated email user', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.status).toBe(400);
  });

  it('should avoid update with password and without old password', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    user.name = 'Outro Nome';

    const responseToken = await request(app)
      .post('/session')
      .send(user);

    const { token } = responseToken.body;

    const response = await request(app)
      .put('/users')
      .set('Authorization', `bearer ${token}`)
      .send(user);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should be able to update', async () => {
    const user = await factory.attrs('User', { password: '123456' });

    await request(app)
      .post('/users')
      .send(user);

    user.name = 'Outro Nome';

    const responseToken = await request(app)
      .post('/session')
      .send(user);

    const { token } = responseToken.body;

    user.password = '12345678';
    user.oldPassword = '123456';
    user.confirmPassword = '12345678';
    user.email = 'teste@teste.com';

    const response = await request(app)
      .put('/users')
      .set('Authorization', `bearer ${token}`)
      .send(user);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name');
    expect(response.body.name).toBe('Outro Nome');
    expect(response.body).toHaveProperty('email');
    expect(response.body.email).toBe('teste@teste.com');
  });

  it('should avoid updates with oldPassword wrong', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    user.name = 'Outro Nome';

    const responseToken = await request(app)
      .post('/session')
      .send(user);

    const { token } = responseToken.body;

    user.password = '12345678';
    user.oldPassword = '123456';
    user.confirmPassword = '12345678';

    const response = await request(app)
      .put('/users')
      .set('Authorization', `bearer ${token}`)
      .send(user);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('should avoid updates with an email already existent', async () => {
    const userExistent = await factory.attrs('User', {
      email: 'teste@teste.com',
    });

    await request(app)
      .post('/users')
      .send(userExistent);

    const user = await factory.attrs('User', { password: '123456' });

    await request(app)
      .post('/users')
      .send(user);

    const responseToken = await request(app)
      .post('/session')
      .send(user);

    user.email = 'teste@teste.com';
    user.password = '12345678';
    user.oldPassword = '123456';
    user.confirmPassword = '12345678';

    const { token } = responseToken.body;

    const response = await request(app)
      .put('/users')
      .set('Authorization', `bearer ${token}`)
      .send(user);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
