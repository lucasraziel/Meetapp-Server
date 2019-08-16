import request from 'supertest';
import { resolve } from 'path';
import { subDays } from 'date-fns';
import app from '~/app';

import factory from '../factories';

import truncate from '../util/truncate';
import startSession from '../util/startSession';

import Meetup from '~/app/models/Meetup';

describe('Meetup', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should create a Meetup', async () => {
    const token = await startSession();

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

    expect(response.body).toHaveProperty('id');
  });

  it('should list Meetups', async () => {
    const token = await startSession();

    const path = resolve(__dirname, '..', 'assets', 'banner.jpg');
    const FileResponse = await request(app)
      .post('/files')
      .set('Authorization', `bearer ${token}`)
      .attach('file', path);

    const file_id = FileResponse.body.id;

    const meetup = await factory.attrs('Meetup-1day', { file_id });
    await request(app)
      .post('/meetups')
      .set('Authorization', `bearer ${token}`)
      .send(meetup);

    const response = await request(app)
      .get('/meetups')
      .set('Authorization', `bearer ${token}`);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should delete a meetup', async () => {
    const token = await startSession();

    const path = resolve(__dirname, '..', 'assets', 'banner.jpg');
    const FileResponse = await request(app)
      .post('/files')
      .set('Authorization', `bearer ${token}`)
      .attach('file', path);

    const file_id = FileResponse.body.id;

    const meetup = await factory.attrs('Meetup-1day', { file_id });
    const responseMeetup = await request(app)
      .post('/meetups')
      .set('Authorization', `bearer ${token}`)
      .send(meetup);

    const { id } = responseMeetup.body;

    const response = await request(app)
      .delete(`/meetups/${id}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.body).toHaveProperty('title');
  });

  it('should not delete a meetup without proper id', async () => {
    const token = await startSession();

    const path = resolve(__dirname, '..', 'assets', 'banner.jpg');
    const FileResponse = await request(app)
      .post('/files')
      .set('Authorization', `bearer ${token}`)
      .attach('file', path);

    const file_id = FileResponse.body.id;

    const meetup = await factory.attrs('Meetup-1day', { file_id });
    await request(app)
      .post('/meetups')
      .set('Authorization', `bearer ${token}`)
      .send(meetup);

    const response = await request(app)
      .delete('/meetups/a')
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it('should update a meetup', async () => {
    const token = await startSession();

    const path = resolve(__dirname, '..', 'assets', 'banner.jpg');
    const FileResponse = await request(app)
      .post('/files')
      .set('Authorization', `bearer ${token}`)
      .attach('file', path);

    const file_id = FileResponse.body.id;

    const meetup = await factory.attrs('Meetup-1day', { file_id });
    const responseMeetup = await request(app)
      .post('/meetups')
      .set('Authorization', `bearer ${token}`)
      .send(meetup);

    meetup.title = 'New Title';
    meetup.id = responseMeetup.body.id;

    const response = await request(app)
      .put(`/meetups/${meetup.id}`)
      .set('Authorization', `bearer ${token}`)
      .send(meetup);

    expect(response.body).toHaveProperty('title');
    expect(response.body.title).toBe('New Title');
  });

  it('should not update a meetup with fail validation', async () => {
    const token = await startSession();

    const path = resolve(__dirname, '..', 'assets', 'banner.jpg');
    const FileResponse = await request(app)
      .post('/files')
      .set('Authorization', `bearer ${token}`)
      .attach('file', path);

    const file_id = FileResponse.body.id;

    const meetup = await factory.attrs('Meetup-1day', { file_id });
    const responseMeetup = await request(app)
      .post('/meetups')
      .set('Authorization', `bearer ${token}`)
      .send(meetup);

    meetup.title = '';
    meetup.id = responseMeetup.body.id;

    const response = await request(app)
      .put(`/meetups/${meetup.id}`)
      .set('Authorization', `bearer ${token}`)
      .send(meetup);

    expect(response.body).toHaveProperty('error');
    expect(response.status).toBe(400);
  });

  it('should not update a meetup that belongs to another person', async () => {
    const token = await startSession();

    const path = resolve(__dirname, '..', 'assets', 'banner.jpg');
    const FileResponse = await request(app)
      .post('/files')
      .set('Authorization', `bearer ${token}`)
      .attach('file', path);

    const file_id = FileResponse.body.id;

    const meetup = await factory.attrs('Meetup-1day', { file_id });
    const responseMeetup = await request(app)
      .post('/meetups')
      .set('Authorization', `bearer ${token}`)
      .send(meetup);

    const newToken = await startSession('outroEmail@MediaList.com');

    meetup.title = 'New Title';
    meetup.id = responseMeetup.body.id;

    const response = await request(app)
      .put(`/meetups/${meetup.id}`)
      .set('Authorization', `bearer ${newToken}`)
      .send(meetup);

    expect(response.body).toHaveProperty('error');
    expect(response.status).toBe(400);
  });

  it('should not delete a meetup that belongs to another person', async () => {
    const token = await startSession();

    const path = resolve(__dirname, '..', 'assets', 'banner.jpg');
    const FileResponse = await request(app)
      .post('/files')
      .set('Authorization', `bearer ${token}`)
      .attach('file', path);

    const file_id = FileResponse.body.id;

    const meetup = await factory.attrs('Meetup-1day', { file_id });
    const responseMeetup = await request(app)
      .post('/meetups')
      .set('Authorization', `bearer ${token}`)
      .send(meetup);

    const newToken = await startSession('outroEmail@MediaList.com');

    const { id } = responseMeetup.body;

    const response = await request(app)
      .delete(`/meetups/${id}`)
      .set('Authorization', `bearer ${newToken}`);

    expect(response.body).toHaveProperty('error');
    expect(response.status).toBe(400);
  });

  it('should not update a meetup from the past', async () => {
    const token = await startSession();

    const path = resolve(__dirname, '..', 'assets', 'banner.jpg');
    const FileResponse = await request(app)
      .post('/files')
      .set('Authorization', `bearer ${token}`)
      .attach('file', path);

    const file_id = FileResponse.body.id;

    const meetup = await factory.attrs('Meetup-1day', { file_id });
    const responseMeetup = await request(app)
      .post('/meetups')
      .set('Authorization', `bearer ${token}`)
      .send(meetup);

    const meetupPast = await Meetup.findByPk(responseMeetup.body.id);

    meetupPast.date = subDays(new Date(), 3);

    await meetupPast.save();

    meetup.title = 'New Title';
    meetup.id = responseMeetup.body.id;

    const response = await request(app)
      .put(`/meetups/${meetup.id}`)
      .set('Authorization', `bearer ${token}`)
      .send(meetup);

    expect(response.body).toHaveProperty('error');
    expect(response.status).toBe(400);
  });

  it('should not delete a meetup from the past', async () => {
    const token = await startSession();

    const path = resolve(__dirname, '..', 'assets', 'banner.jpg');
    const FileResponse = await request(app)
      .post('/files')
      .set('Authorization', `bearer ${token}`)
      .attach('file', path);

    const file_id = FileResponse.body.id;

    const meetup = await factory.attrs('Meetup-1day', { file_id });
    const responseMeetup = await request(app)
      .post('/meetups')
      .set('Authorization', `bearer ${token}`)
      .send(meetup);

    const meetupPast = await Meetup.findByPk(responseMeetup.body.id);

    meetupPast.date = subDays(new Date(), 3);

    await meetupPast.save();

    const { id } = meetupPast;

    const response = await request(app)
      .delete(`/meetups/${id}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.body).toHaveProperty('error');
    expect(response.status).toBe(400);
  });

  it('should not allow empty title', async () => {
    const token = await startSession();

    const path = resolve(__dirname, '..', 'assets', 'banner.jpg');
    const FileResponse = await request(app)
      .post('/files')
      .set('Authorization', `bearer ${token}`)
      .attach('file', path);

    const file_id = FileResponse.body.id;

    const meetup = await factory.attrs('Meetup-1day', { title: '', file_id });
    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `bearer ${token}`)
      .send(meetup);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should not allow empty description', async () => {
    const token = await startSession();

    const path = resolve(__dirname, '..', 'assets', 'banner.jpg');
    const FileResponse = await request(app)
      .post('/files')
      .set('Authorization', `bearer ${token}`)
      .attach('file', path);

    const file_id = FileResponse.body.id;

    const meetup = await factory.attrs('Meetup-1day', {
      description: '',
      file_id,
    });
    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `bearer ${token}`)
      .send(meetup);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should not allow empty place', async () => {
    const token = await startSession();

    const path = resolve(__dirname, '..', 'assets', 'banner.jpg');
    const FileResponse = await request(app)
      .post('/files')
      .set('Authorization', `bearer ${token}`)
      .attach('file', path);

    const file_id = FileResponse.body.id;

    const meetup = await factory.attrs('Meetup-1day', { place: '', file_id });
    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `bearer ${token}`)
      .send(meetup);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should not allow events within less than 1 hour', async () => {
    const token = await startSession();

    const path = resolve(__dirname, '..', 'assets', 'banner.jpg');
    const FileResponse = await request(app)
      .post('/files')
      .set('Authorization', `bearer ${token}`)
      .attach('file', path);

    const file_id = FileResponse.body.id;

    const meetup = await factory.attrs('Meetup-1day', {
      date: new Date(),
      file_id,
    });
    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `bearer ${token}`)
      .send(meetup);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should block invalid file', async () => {
    const token = await startSession();

    const file_id = -1;

    const meetup = await factory.attrs('Meetup-1day', { file_id });
    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `bearer ${token}`)
      .send(meetup);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
  });

  it('should block an invalid token', async () => {
    const token = await startSession();

    const path = resolve(__dirname, '..', 'assets', 'banner.jpg');
    const FileResponse = await request(app)
      .post('/files')
      .set('Authorization', `bearer ${token}`)
      .attach('file', path);

    const file_id = FileResponse.body.id;

    const meetup = await factory.attrs('Meetup-1day', { file_id });
    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `bearer 123456`)
      .send(meetup);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('should block a non-logged access', async () => {
    const token = await startSession();

    const path = resolve(__dirname, '..', 'assets', 'banner.jpg');
    const FileResponse = await request(app)
      .post('/files')
      .set('Authorization', `bearer ${token}`)
      .attach('file', path);

    const file_id = FileResponse.body.id;

    const meetup = await factory.attrs('Meetup-1day', { file_id });
    const response = await request(app)
      .post('/meetups')
      .set('Authorization', null)
      .send(meetup);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });
});
