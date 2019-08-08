import request from 'supertest';
import { format, addDays } from 'date-fns';
import pt from 'date-fns/locale/pt';
import app from '~/app';

import truncate from '../util/truncate';
import startSession from '../util/startSession';
import createMeetup from '../util/createMeetup';

describe('available', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should list the first 10 itens', async () => {
    const token = await startSession();

    for (let i = 0; i < 12; i++) {
      await createMeetup(token);
    }
    const date = addDays(new Date(), 1);

    const queryDate = format(date, "yyyy'-'MM'-'dd", { locale: pt });

    let response = await request(app).get(
      `/meetups/available?date=${queryDate}`
    );

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(10);

    response = await request(app).get(
      `/meetups/available?date=${queryDate}&page=2`
    );

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);

    response = await request(app).get(`/meetups/available`);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });
});
