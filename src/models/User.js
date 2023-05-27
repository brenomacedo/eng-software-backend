import { Model } from 'objection';
import Category from './Category.js';
import Event from './Event.js';

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
    }
  });
}

export default User;
