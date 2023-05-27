import { Model } from 'objection';
import Event from './Event.js';
import User from './User.js';

class Request extends Model {
  static get tableName() {
    return 'requests';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['message', 'status', 'user_id', 'event_id'],

      properties: {
        id: { type: 'integer' },
        message: { type: 'string' },
        status: { type: 'string' },
        user_id: { type: 'integer' },
        event_id: { type: 'integer' }
      }
    };
  }

  static relationMappings = () => ({
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'requests.user_id',
        to: 'users.id'
      }
    },
    event: {
      relation: Model.BelongsToOneRelation,
      modelClass: Event,
      join: {
        from: 'requests.event_id',
        to: 'events.id'
      }
    }
  });
}

export default Request;
