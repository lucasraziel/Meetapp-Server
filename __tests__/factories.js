import faker from 'faker';
import { factory } from 'factory-girl';
import { addDays, subDays } from 'date-fns';
import User from '../src/app/models/User';
import Meetup from '../src/app/models/Meetup';

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

factory.define('Meetup-1day', Meetup, {
  description: faker.lorem.sentence(20),
  title: faker.lorem.sentence(6),
  place: faker.address.streetAddress(),
  date: faker.date.between(addDays(new Date(), 1), addDays(new Date(), 2)),
  file_id: 1,
});

factory.define('Meetup-past', Meetup, {
  description: faker.lorem.sentence(20),
  title: faker.lorem.sentence(6),
  place: faker.address.streetAddress(),
  date: faker.date.between(subDays(new Date(), 2), subDays(new Date(), 1)),
  file_id: 1,
});

export default factory;
