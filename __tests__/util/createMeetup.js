import { resolve } from 'path';
import request from 'supertest';

import factory from '../factories';

import app from '../../src/app';

export default async function createMeetup(token) {
  const path = resolve(__dirname, '..', 'assets', 'banner.jpg');
  const FileResponse = await request(app)
    .post('/files')
    .set('Authorization', `bearer ${token}`)
    .attach('file', path);

  const file_id = FileResponse.body.id;

  const meetup = await factory.attrs('Meetup-1day', { file_id });
  const response = await request(app)
    .post('/meetups')
    .set('Authorization', `bearer ${token}`)
    .send(meetup);

  return response.body;
}
