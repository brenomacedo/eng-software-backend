import { Model } from 'objection';

class Address extends Model {
  static get tableName() {
    return 'addresses';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['state', 'city', 'neighborhood', 'user_id'],

      properties: {
        id: { type: 'integer' },
        state: { type: 'string' },
        city: { type: 'string' },
        neighborhood: { type: 'string' },
        user_id: { type: 'integer' }
      }
    };
  }
}

export default Address;
