import request from 'supertest';
import { subDays } from 'date-fns';
import app from '~/app';

import truncate from '../util/truncate';
import startSession from '../util/startSession';
import createMeetup from '../util/createMeetup';

import Meetup from '~/app/models/Meetup';

describe('subscription', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should create a subscriptions', async () => {
    const token = await startSession();

    const meetup = await createMeetup(token);

    const newToken = await startSession('outroEmail@mail.com');

    const response = await request(app)
      .post('/subscriptions')
      .set('Authorization', `bearer ${newToken}`)
      .send(meetup);

    expect(response.body).toHaveProperty('id');
  });

  it('should not subscribe to same meetup twice', async () => {
    const token = await startSession();

    const meetup = await createMeetup(token);

    const newToken = await startSession('outroEmail@mail.com');

    await request(app)
      .post('/subscriptions')
      .set('Authorization', `bearer ${newToken}`)
      .send(meetup);

    await request(app)
      .post('/subscriptions')
      .set('Authorization', `bearer ${newToken}`)
      .send(meetup)
      .expect(500);
  });

  it('should not subscribe to 2 meetups in the same time', async () => {
    const token = await startSession();

    const meetup = await createMeetup(token);

    const newToken = await startSession('outroEmail@mail.com');

    await request(app)
      .post('/subscriptions')
      .set('Authorization', `bearer ${newToken}`)
      .send(meetup);

    const newMeetup = await createMeetup(token);

    await request(app)
      .post('/subscriptions')
      .set('Authorization', `bearer ${newToken}`)
      .send(newMeetup)
      .expect(500);
  });

  it('should not create a subscription without a meetup', async () => {
    const token = await startSession();

    const response = await request(app)
      .post('/subscriptions')
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it('should not create a subscription for your own meetup', async () => {
    const token = await startSession();

    const meetup = await createMeetup(token);

    await request(app)
      .post('/subscriptions')
      .set('Authorization', `bearer ${token}`)
      .send(meetup)
      .expect(500);
  });

  it('should not create a subscription from the past', async () => {
    const token = await startSession();

    const meetup = await createMeetup(token);

    const meetupPast = await Meetup.findByPk(meetup.id);

    await meetupPast.update({
      date: subDays(new Date(), 3),
    });

    meetup.date = meetupPast.date;

    const newToken = await startSession('mail@mail.com');

    await request(app)
      .post('/subscriptions')
      .set('Authorization', `bearer ${newToken}`)
      .send(meetup)
      .expect(500);
  });

  it('should list subscriptions that hasn´t happened and that is yours', async () => {
    // create 1 meetup in the future and 1 in the past and subscribe in both
    const token = await startSession();

    let meetup = await createMeetup(token);

    const newToken = await startSession('email@email.com');

    await request(app)
      .post('/subscriptions')
      .set('Authorization', `bearer ${newToken}`)
      .send(meetup);

    const meetupPast = await Meetup.findByPk(meetup.id);

    await meetupPast.update({
      date: subDays(new Date(), 3),
    });

    meetup = await createMeetup(token);

    await request(app)
      .post('/subscriptions')
      .set('Authorization', `bearevr ${newToken}`)
      .send(meetup);

    // create another user and subscribe to one of the meetups

    const anotherToken = await startSession('anotheremail@email.com');

    await request(app)
      .post('/subscriptions')
      .set('Authorization', `bearer ${anotherToken}`)
      .send(meetup);

    // test the get

    const response = await request(app)
      .get('/subscriptions')
      .set('Authorization', `bearer ${newToken}`);

    // Test if array

    expect(Array.isArray(response.body)).toBe(true);
    // Test if came only 1 subscription (the one from the user and not from the past)

    expect(response.body.length).toBe(1);
  });

  it('should delete a subscription', async () => {
    const token = await startSession();

    const meetup = await createMeetup(token);

    const newToken = await startSession('outroEmail@mail.com');

    const response = await request(app)
      .post('/subscriptions')
      .set('Authorization', `bearer ${newToken}`)
      .send(meetup);

    await request(app)
      .delete(`/subscriptions/${response.body.id}`)
      .set('Authorization', `bearer ${newToken}`)
      .expect(200);
  });

  it('should raise an error when deleting a subscription with invalid id', async () => {
    const token = await startSession();

    const meetup = await createMeetup(token);

    const newToken = await startSession('outroEmail@mail.com');

    const response = await request(app)
      .post('/subscriptions')
      .set('Authorization', `bearer ${newToken}`)
      .send(meetup);

    await request(app)
      .delete(`/subscriptions/a`)
      .set('Authorization', `bearer ${newToken}`)
      .expect(400);
  });

  it('should not delete a subscription from another person', async () => {
    const token = await startSession();

    const meetup = await createMeetup(token);

    const newToken = await startSession('outroEmail@mail.com');

    const response = await request(app)
      .post('/subscriptions')
      .set('Authorization', `bearer ${newToken}`)
      .send(meetup);

    await request(app)
      .delete(`/subscriptions/${response.body.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(401);
  });
});
