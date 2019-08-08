import { isBefore, startOfHour, endOfHour } from 'date-fns';
import { Op } from 'sequelize';

import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';

class SubscriptionService {
  async run({ meetup, userId }) {
    const meetupDB = await Meetup.findByPk(meetup.id);
    if (meetup.user_id === userId) {
      throw new Error('You cannot subscribe to your own meetup');
    }

    if (isBefore(meetupDB.date, new Date())) {
      throw new Error(
        'You cannot subscribe to meetups that has already happened'
      );
    }

    const isSubscribed = await Subscription.findOne({
      where: { user_id: userId, meetup_id: meetup.id },
    });

    if (isSubscribed) {
      throw new Error('You cannot subscribe to the same meetup twice');
    }

    const isBusy = await Subscription.findOne({
      include: [
        {
          model: Meetup,
          as: 'meetup',
          attributes: ['date'],
          where: {
            date: {
              [Op.between]: [
                startOfHour(meetupDB.date),
                endOfHour(meetupDB.date),
              ],
            },
          },
        },
      ],
      where: {
        user_id: userId,
      },
    });

    if (isBusy) {
      throw new Error(
        'You cannot subscribe to a meetup that happens in the same hour of another meetup that you already are subscribed'
      );
    }
  }
}

export default new SubscriptionService();
