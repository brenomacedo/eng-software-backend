import { Model } from 'objection';

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
}

export default User;
