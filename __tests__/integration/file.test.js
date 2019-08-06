import request from 'supertest';
import { resolve } from 'path';
import fs from 'mz/fs';
import app from '~/app';

import truncate from '../util/truncate';

describe('File', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should storage a file', async () => {
    const path = resolve(__dirname, '..', 'assets', 'banner.jpg');
    const response = await request(app)
      .post('/files')
      .attach('file', path);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('path');

    const fileName = response.body.path;

    const destPath = resolve(__dirname, '..', 'tmp', fileName);

    expect(await fs.exists(destPath)).toBe(true);
  });
});
