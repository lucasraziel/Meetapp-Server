import { isBefore, startOfHour, endOfHour, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';

class SubscriptionService {
  async run({ meetup, userId }) {
    if (meetup.user_id === userId) {
      throw new Error('You cannot subscribe to your own meetup');
    }

    if (isBefore(parseISO(meetup.date), new Date())) {
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
                startOfHour(parseISO(meetup.date)),
                endOfHour(parseISO(meetup.date)),
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
