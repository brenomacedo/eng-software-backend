const { Model } = require('objection');

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
        name: { type: 'string', minLenght: 3, maxLenght: 255 },
        birth_date: { type: 'date' },
        description: { type: 'string' },
        email: { type: 'string', format: 'email' },
        profile_picture: { type: 'string' },
        is_premium: { type: 'boolean' }
      }
    };
  }
}

module.exports = User;
