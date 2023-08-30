import User from '../models/User.js';
import PasswordToken from '../models/PasswordToken.js';
import { RequestError } from '../utils/errors.js';
import * as Yup from 'yup';
import 'express-async-errors';
import nodemailer from 'nodemailer';

class UserController {
  // Receive a request and a response.

  // Update: edit the user
  async update(req, res) {
    const { id } = req.params;
    const { name, email, description, birth_date } = req.body;

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

    await user.$query().patch({ name, email, description, birth_date });

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
    const user = await User.query().findById(id);
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

  async recoverPassword(req, res) {
    var email = req.body.email;
    //var email = '96.twistedmind.69@gmail.com';
    var result = await PasswordToken.create(email);

    if (result.status) {
      //MANDAR EMAIL
      /*
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com.',
        port: 465,
        secure: true,
        auth: {
          user: 'pickapal.recover@gmail.com',
          pass: 'pickapal123456'
        },
        tls: {
          ciphers: 'SSLv3'
        }
      });

      transporter
        .sendMail({
          from: 'Pick a Pal <service-pickapal@gmail.com>',
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
      */
      res.status(200);
      res.send('' + result.token);
    } else {
      res.status(406);
      res.send(result.err);
    }
  }

  async changePassword(req, res) {
    var token = req.body.token;
    var password = req.body.password;

    var isTokenValid = await PasswordToken.validate(token);

    if (isTokenValid.status) {
      await User.changePassword(
        password,
        isTokenValid.token.user_id,
        isTokenValid.token.token
      );
      res.status(200);
      res.send('Senha alterada');
      // alterar senha
    } else {
      res.status(406);
      res.send('Token inválido!');
    }
  }
}

export default new UserController();
