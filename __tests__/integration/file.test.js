import request from 'supertest';
import { resolve } from 'path';
import fs from 'mz/fs';
import app from '~/app';

import truncate from '../util/truncate';
import startSession from '../util/startSession';

describe('File', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should storage a file', async () => {
    const token = await startSession();

    const path = resolve(__dirname, '..', 'assets', 'banner.jpg');
    const response = await request(app)
      .post('/files')
      .set('Authorization', `bearer ${token}`)
      .attach('file', path);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('path');

    const fileName = response.body.path;

    const destPath = resolve(__dirname, '..', 'tmp', fileName);

    expect(await fs.exists(destPath)).toBe(true);
  });

  it('should raise an error', async () => {
    const token = await startSession();

    const response = await request(app)
      .post('/files')
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
  });

  it('should block a non-logged access', async () => {
    const response = await request(app).post('/files');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('should block an invalid token', async () => {
    const response = await request(app)
      .post('/files')
      .set('Authorization', `bearer 123456`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });
});
