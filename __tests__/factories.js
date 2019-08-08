import faker from 'faker';
import { factory } from 'factory-girl';
import { addDays } from 'date-fns';
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
  date: addDays(new Date(), 1),
  file_id: 1,
});

export default factory;
