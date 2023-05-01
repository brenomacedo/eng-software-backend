import User from '../models/User.js';
import { RequestError } from '../utils/errors.js';
import * as Yup from 'yup';
import 'express-async-errors';

class UserController {
  // Receive a request and a response.

  // Update: edit the user
  async update(req, res) {
    const { id } = req.params;
    const { name, email, description, birth_date } = req.body;

    // Validate the User properties with YUP.
    const schema = Yup.object().shape({
      name: Yup.string('O formato do nome é inválido.'),
      email: Yup.string('O formato do email é inválido.').email(
        'O formato do email é inválido.'
      ),
      description: Yup.string('O formato do descrição é inválido.'),
      birth_date: Yup.date()
    });

    await schema.validate({ name, email, description, birth_date });

    const user = await User.query().findById(id);
    if (!user) {
      throw new RequestError('Usuário não encontrado', 404);
    }

    await user.$query().patch({ name, email, description, birth_date });
    return res.json(user);
  }

  // Index: list all users
  async index(req, res) {
    const users = await User.query();
    return res.json(users);
  }

  // Show: show a single user by ID
  async show(req, res) {
    const { id } = req.params;
    const user = await User.query().findById(id);
    if (!user) {
      throw new RequestError('Usuário não encontrado', 404);
    }
    return res.json(user);
  }

  // Delete: delete a user by ID
  async delete(req, res) {
    const { id } = req.params;
    const user = await User.query().findById(id);
    if (!user) {
      throw new RequestError('Usuário não encontrado', 404);
    }
    await user.$query().delete();
    return res.json({ message: 'User deleted' });
  }
}

export default new UserController();
