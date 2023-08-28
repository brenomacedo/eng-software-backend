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
        used: { type: 'boolean', default: false }
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

        PasswordToken.query().insert({
          user_id: user.id,
          used: 0,
          token: token
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
}

export default PasswordToken;
