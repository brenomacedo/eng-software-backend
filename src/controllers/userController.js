import User from '../models/User.js';
import UserRating from '../models/UserRating.js';
import PasswordToken from '../models/PasswordToken.js';
import { RequestError } from '../utils/errors.js';
import nodemailer from 'nodemailer';
import * as Yup from 'yup';
import 'express-async-errors';
// import nodemailer from 'nodemailer';

class UserController {
  // Receive a request and a response.

  // Update: edit the user
  async update(req, res) {
    const { id } = req.params;
    const { name, email, description, birth_date, profile_pic } = req.body;

    if (req.userId !== Number(id)) {
      throw new RequestError('Operação não autorizada.', 403);
    }

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

    await user
      .$query()
      .patch({ name, email, description, birth_date, profile_pic });

    delete user.password;
    return res.json(user);
  }

  // Index: list all users
  async index(req, res) {
    const users = await User.query();

    for (const user of users) {
      delete user.password;
    }

    return res.json(users);
  }

  // Show: show a single user by ID
  async show(req, res) {
    const { id } = req.params;
    const user = await User.query()
      .findById(id)
      .withGraphFetched({
        ratings: true,
        events: {
          ratings: true
        }
      });
    if (!user) {
      throw new RequestError('Usuário não encontrado', 404);
    }

    delete user.password;
    return res.json(user);
  }

  // Delete: delete a user by ID
  async delete(req, res) {
    const { id } = req.params;

    if (req.userId !== Number(id)) {
      throw new RequestError('Operação não autorizada.', 403);
    }

    const user = await User.query().findById(id);
    if (!user) {
      throw new RequestError('Usuário não encontrado', 404);
    }
    await user.$query().delete();
    return res.json({ message: 'User deleted' });
  }

  async rateUser(req, res) {
    const { rating, user_rated } = req.body;
    const user_id = req.userId;

    const schema = Yup.object().shape({
      rating: Yup.number('Formato da avaliação inválida!').required(
        'A avaliação é obrigatória!'
      ),
      user_rated: Yup.number('Formato do usuário avaliado inválido!').required(
        'O usuário avaliado é obrigatório!'
      )
    });

    await schema.validate({ rating, user_rated });

    const foundRating = await UserRating.query().findOne({
      user_id,
      user_rated
    });
    let newRating;

    if (foundRating) {
      newRating = await UserRating.query().patchAndFetchById(foundRating.id, {
        rating
      });
    } else {
      newRating = await UserRating.query().insertAndFetch({
        user_id,
        user_rated,
        rating
      });
    }

    return res.status(200).json(newRating);
  }

  async recoverPassword(req, res) {
    var email = req.body.email;

    const schema = Yup.object().shape({
      email: Yup.string().email('Formato de email inválido.')
    });

    await schema.validate({ email });

    //var email = '96.twistedmind.69@gmail.com';
    var result = await PasswordToken.create(email);

    if (result.status) {
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com.',
        port: 465,
        secure: false,
        auth: {
          user: 'pickapal.recover@gmail.com',
          pass: 'pickapal123456.'
        }
      });

      transporter
        .sendMail({
          from: 'Pick a Pal <*************>',
          to: email,
          subject: 'Recuperação de senha - Pick a Pal',
          text: 'Clique no link para recuperar sua senha:',
          //Front End criar página de recuperação de senha e botar o 'link' aqui.
          html: `<a href="pickapal/passwordrecovery/${result}">Link de Recuperação</a>`
        })
        .then(message => {
          console.log(message);
        })
        .catch(err => {
          console.log(err);
        });
      return res.status(200).json({ success: true });
    } else {
      return res.status(406).json(result.err);
    }
  }

  async changePassword(req, res) {
    var token = req.body.token;
    var password = req.body.password;

    var isTokenValid = await PasswordToken.validate(token);

    if (isTokenValid.status) {
      await User.changePassword(
        password,
        isTokenValid.token[0].user_id,
        isTokenValid.token[0].token
      );
      return res.status(200).json('Senha alterada');
    } else {
      return res.status(406).json('Token inválido!');
    }
  }
}

export default new UserController();
