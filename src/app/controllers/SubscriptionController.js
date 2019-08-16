import { Op } from 'sequelize';
import SubscriptionMail from '../jobs/SubscriptionMail';
import Queue from '../../lib/Queue';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import User from '../models/User';
import File from '../models/File';
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
          attributes: ['date', 'id', 'place', 'title', 'description'],
          order: ['date'],
          where: { date: { [Op.gt]: new Date() } },
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name'],
            },
            {
              model: File,
              as: 'file',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
      where: { user_id: req.userId },
    });

    return res.status(200).send(subscriptions);
  }

  async delete(req, res) {
    const subscription = await Subscription.findByPk(req.params.id);

    if (req.userId !== subscription.user_id) {
      res
        .status(401)
        .send({ error: 'You cannot unsubscribe for another user' });
    }

    await subscription.destroy({ force: true });

    return res.status(200).send(subscription);
  }
}

export default new SubscriptionController();
