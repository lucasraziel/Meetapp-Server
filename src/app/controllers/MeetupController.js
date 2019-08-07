import { isBefore } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupController {
  async store(req, res) {
    req.body.user_id = req.userId;
    const meetup = await Meetup.create(req.body);

    return res.status(200).send(meetup);
  }

  async update(req, res) {
    const meetup = await Meetup.findByPk(req.body.id);

    if (req.userId !== meetup.user_id) {
      res.status(400).send({ error: 'You can only update your meetups' });
    }

    if (isBefore(meetup.date, new Date())) {
      res
        .status(400)
        .send({ error: 'You can only update meetups in the future' });
    }

    await meetup.update(req.body);

    const meetupResponse = await Meetup.findByPk(req.body.id);

    res.status(200).send(meetupResponse);
  }

  async index(req, res) {
    const meetups = await Meetup.findAll({ where: { user_id: req.userId } });

    return res.status(200).send(meetups);
  }

  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.body.id);

    if (isBefore(meetup.date, new Date())) {
      res
        .status(400)
        .send({ error: 'You can only delete meetups in the future' });
    }

    if (req.userId !== meetup.user_id) {
      res.status(400).send({ error: 'You can only update your meetups' });
    }

    await meetup.destroy({ force: true });

    return res.status(200).send(meetup);
  }
}

export default new MeetupController();
