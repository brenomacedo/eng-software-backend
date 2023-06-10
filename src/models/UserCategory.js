import { Model } from 'objection';

class Category extends Model {
  static get tableName() {
    return 'users_categories';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['user_id', 'category_id'],

      properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        category_id: { type: 'integer' }
      }
    };
  }
}

export default Category;
