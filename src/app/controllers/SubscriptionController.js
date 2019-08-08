import { Op } from 'sequelize';
import SubscriptionMail from '../jobs/SubscriptionMail';
import Queue from '../../lib/Queue';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import User from '../models/User';
import SubscriptionService from '../services/SubscriptionService';

class SubscriptionController {
  async store(req, res) {
    await SubscriptionService.run({ userId: req.userId, meetup: req.body });
    const subscription = await Subscription.create({
      date: new Date(),
      user_id: req.userId,
      meetup_id: req.body.id,
    });

    const newSubscription = await Subscription.findByPk(subscription.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
        {
          model: Meetup,
          as: 'meetup',
          attributes: ['title', 'date'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['name', 'email'],
            },
          ],
        },
      ],
    });

    await Queue.add(SubscriptionMail.key, {
      subscription: newSubscription,
    });

    return res.status(200).send(subscription);
  }

  async index(req, res) {
    const subscriptions = await Subscription.findAll({
      include: [
        {
          model: Meetup,
          as: 'meetup',
          attributes: ['date'],
          order: ['date'],
          where: { date: { [Op.gt]: new Date() } },
        },
      ],
      where: { user_id: req.userId },
    });

    return res.status(200).send(subscriptions);
  }
}

export default new SubscriptionController();