import { Model } from 'objection';
import User from './User.js';

class PasswordToken extends Model {
  static get tableName() {
    return 'passwordtokens';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['token', 'user_id'],

      properties: {
        id: { type: 'integer' },
        token: { type: 'string', maxLength: 200 },
        user_id: { type: 'integer' },
        used: { type: 'integer', default: 0 }
      }
    };
  }

  static relationMappings = () => ({
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'passwordtokens.user_id',
        to: 'users.id'
      }
    }
  });

  static async create(email) {
    var user = await User.findByEmail(email);
    if (user != undefined) {
      try {
        var token = Date.now(); //MUDAR DEPOIS O TIPO DO TOKEN

        console.log(user);
        // Inserindo token no banco de dados
        await PasswordToken.query().insert({
          user_id: user.id,
          used: 0,
          token: String(token)
        });

        return { status: true, token: token };
      } catch (err) {
        console.log(err);
        return { status: false, err: err };
      }
    } else {
      return {
        status: false,
        err: 'O e-mail passado não existe no banco de dados'
      };
    }
  }

  static async validate(token) {
    try {
      var result = await PasswordToken.query().select().where({ token: token });

      if (result !== undefined) {
        var tk = result;
        if (tk.used) {
          return { status: false };
        } else {
          return { status: true, token: tk };
        }
      } else {
        return { status: false };
      }
    } catch (err) {
      return { status: false };
    }
  }

  static async setUsed(token) {
    const passwordToken = await PasswordToken.query().findOne({ token: token });
    await passwordToken.$query().patch({ used: 1 });
  }
}

export default PasswordToken;
