import { Model } from 'objection';
import User from './User.js';

class Category extends Model {
  static get tableName() {
    return 'categories';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string' }
      }
    };
  }

  static relationMappings = () => ({
    users: {
      relation: Model.ManyToManyRelation,
      modelClass: User,
      join: {
        from: 'categories.id',
        to: 'users.id',
        through: {
          from: 'users_categories.category_id',
          to: 'users_categories.user_id'
        }
      }
    }
  });
}

export default Category;
