import User from '../models/User.js';
import * as Yup from 'yup';

class UserController {
  // Receive a request and a response.

  // Create: create a new user
  async create(req, res) {
    const { name, email, description, birth_date } = req.body;

    // Validate the User properties with YUP.
    const schema = Yup.object().shape({
      name: Yup.string('O formato do nome é inválido.').required(
        'O nome é obrigatório.'
      ),
      email: Yup.string('O formato do email é inválido.')
        .required('O email é obrigatório.')
        .email('O formato do email é inválido.'),
      description: Yup.string('O formato do descrição é inválido.'),
      birth_date: Yup.date().required('A data de nascimento é obrigatória.')
    });

    await schema.validate({ name, email, description, birth_date });

    const user = await User.query().insert({
      name,
      email,
      description,
      birth_date,
      is_premium: false,
      profile_pic: ''
    });
    return res.json(user);
  }

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
      throw new Error('User not found');
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
      throw new Error('user not found');
    }
    return res.json(user);
  }

  // Delete: delete a user by ID
  async delete(req, res) {
    const { id } = req.params;
    const user = await User.query().findById(id);
    if (!user) {
      throw new Error('user not found');
    }
    await user.$query().delete();
    return res.json({ message: 'User deleted' });
  }
}

export default new UserController();