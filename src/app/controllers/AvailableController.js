import { format, startOfDay, endOfDay, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';

class AvailableController {
  async store(req, res) {
    const today = new Date();
    const queryDate = format(today, "yyyy'-'MM'-'dd", { locale: pt });
    const { date = queryDate, page = 1 } = req.query;
    const dateBeginOfDay = startOfDay(parseISO(date));
    const dateEndOfDay = endOfDay(parseISO(date));
    const availableMeetups = await Meetup.findAll({
      where: { date: { [Op.between]: [dateBeginOfDay, dateEndOfDay] } },
      limit: 10,
      offset: (page - 1) * 10,
    });

    return res.status(200).send(availableMeetups);
  }
}

export default new AvailableController();
