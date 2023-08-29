import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { RequestError } from '../utils/errors.js';
import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import 'express-async-errors';

class AuthController {
  // Create: create a new user

  // if the user token is valid, just return the
  // authenticated user
  async auth(req, res) {
    const user = await User.query().findById(req.userId).withGraphFetched({
      preferences: true,
      events: true,
      requests: true,
      address: true
    });
    delete user.password;
    return res.status(200).json(user);
  }

  async signup(req, res) {
    const { name, email, description, birth_date, password } = req.body;

    // Validate the User properties with YUP.
    const schema = Yup.object().shape({
      name: Yup.string('O formato do nome é inválido.').required(
        'O nome é obrigatório.'
      ),
      email: Yup.string('O formato do email é inválido.')
        .required('O email é obrigatório.')
        .email('O formato do email é inválido.'),
      description: Yup.string('O formato do descrição é inválido.'),
      birth_date: Yup.date().required('A data de nascimento é obrigatória.'),
      password: Yup.string('O formato da senha é inválido').required(
        'A senha é obrigatória'
      )
    });

    //validating the data that came from user
    await schema.validate({
      name,
      email,
      description,
      birth_date,
      password
    });

    const userWithInputedEmail = await User.query().findOne({ email });
    if (userWithInputedEmail) {
      throw new RequestError(
        'Já existe um usuário cadastrado com esse email!',
        409
      );
    }

    //creating a salt to hash the password
    const salt = await bcrypt.genSalt(10);
    //generating a hash from the password we received
    const passwordHash = await bcrypt.hash(password, salt);

    //inserting user in the database
    const user = await User.query().insertAndFetch({
      name,
      email,
      description,
      birth_date,
      is_premium: false,
      profile_pic: '',
      password: passwordHash
    });
    delete user.password;

    //here i create a jwt to return
    //The payload containg the name, email and id of the user
    //the key is in the env file
    //the expiration date is 10 days
    const accessToken = jwt.sign(
      {
        id: user.id
      },
      'abdc',
      { expiresIn: '10d' }
    );

    return res.status(200).json({ accessToken, user });
  }

  async login(req, res) {
    //taking email and password from the req
    const { email, password } = req.body;

    //trying to find some user with the same email
    const user = await User.query()
      .findOne({
        email: email
      })
      .withGraphFetched({
        preferences: true,
        events: true,
        requests: true,
        address: true
      });

    //if found someone, it will check if the password is matching
    if (user) {
      //comparing the password received to the hash stored in the db
      const isPasswordMatching = await bcrypt.compare(password, user.password);
      //if the password is correct, return the acess token
      if (isPasswordMatching) {
        const accessToken = jwt.sign(
          {
            id: user.id
          },
          process.env.JWT_KEY,
          { expiresIn: '10d' }
        );

        delete user.password;
        return res.status(200).json({ accessToken, user });
      } else {
        //if the password is not correct throw an error
        throw new RequestError('A senha digitada é incorreta', 401);
      }
    } else {
      //if the query did not find the user throw an error
      throw new RequestError('Usuário não encontrado', 401);
    }
  }
}

export default new AuthController();
