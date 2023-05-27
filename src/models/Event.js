import { Model } from 'objection';
import User from './User.js';

class Event extends Model {
  static get tableName() {
    return 'events';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['title', 'location', 'latitude', 'longitude', 'user_id'],

      properties: {
        id: { type: 'integer' },
        title: { type: 'string' },
        description: { type: 'string' },
        location: { type: 'string' },
        latitude: { type: 'number' },
        longitude: { type: 'number' },
        user_id: { type: 'integer' }
      }
    };
  }

  static relationMappings = () => ({
    users: {
      join: {
        from: 'events.user_id',
        to: 'users.id'
      },
      modelClass: User,
      relation: Model.BelongsToOneRelation
    }
  });
}

export default Event;
