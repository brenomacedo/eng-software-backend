import { Model } from 'objection';
import Category from './Category.js';
import Event from './Event.js';
import Request from './Request.js';
import Address from './Address.js';
import UserRating from './UserRating.js';
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
        profile_pic: { type: 'integer' },
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
    ratings: {
      join: {
        from: 'users.id',
        to: 'user_ratings.user_rated'
      },
      relation: Model.HasManyRelation,
      modelClass: UserRating
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
        .select('id', 'email', 'name') // Seleção específica de colunas
        .findOne({ email });

      if (result !== undefined) {
        console.log(result.id);
        return result.id;
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
