import { Model } from 'objection';
import Category from './Category.js';
import Event from './Event.js';
import Request from './Request.js';
import Address from './Address.js';
import PasswordToken from './PasswordToken.js';

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'birth_date', 'email'],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 3, maxLength: 255 },
        birth_date: { type: 'string' },
        description: { type: 'string' },
        email: { type: 'string' },
        profile_pic: { type: 'string' },
        is_premium: { type: 'boolean' }
      }
    };
  }

  static relationMappings = () => ({
    preferences: {
      relation: Model.ManyToManyRelation,
      modelClass: Category,
      join: {
        from: 'users.id',
        to: 'categories.id',
        through: {
          from: 'users_categories.user_id',
          to: 'users_categories.category_id'
        }
      }
    },
    events: {
      relation: Model.HasManyRelation,
      modelClass: Event,
      join: {
        from: 'users.id',
        to: 'events.user_id'
      }
    },
    requests: {
      relation: Model.HasManyRelation,
      modelClass: Request,
      join: {
        from: 'users.id',
        to: 'requests.user_id'
      }
    },
    address: {
      relation: Model.HasOneRelation,
      modelClass: Address,
      join: {
        from: 'users.id',
        to: 'addresses.user_id'
      }
    },
    passwordToken: {
      relation: Model.HasOneRelation,
      modelClass: PasswordToken,
      join: {
        from: 'users.id',
        to: 'passwordtokens.user_id'
      }
    }
  });

  static async findByEmail(email) {
    try {
      const result = await this.query()
        .select('id', 'email', 'role', 'name') // Seleção específica de colunas
        .findOne({ email });

      if (result.length > 0) {
        return result[0];
      } else {
        return undefined;
      }
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }
}

export default User;
