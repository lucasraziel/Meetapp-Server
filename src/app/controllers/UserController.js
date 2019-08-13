import User from '../models/User';

class UserController {
  async store(req, res) {
    const { email } = req.body;

    const emailExists = await User.findOne({ where: { email } });

    if (emailExists) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = await User.create(req.body);

    const { id, name } = user;

    return res.status(200).json({ id, name, email });
  }

  async update(request, response) {
    const { email, oldPassword } = request.body;

    const user = await User.findByPk(request.userId);

    if (email) {
      if (email !== user.email) {
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
          return response.status(400).json({ error: 'User already exists' });
        }
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return response.status(401).json({ error: 'Password does not match' });
    }

    await user.update(request.body);

    const { id, name } = await User.findByPk(request.userId);
    return response.json({
      id,
      name,
      email,
    });
  }
}

export default new UserController();
