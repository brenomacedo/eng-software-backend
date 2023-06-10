import { Model } from 'objection';
import User from './User.js';
import Request from './Request.js';

class Event extends Model {
  static get tableName() {
    return 'events';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'title',
        'location',
        'latitude',
        'longitude',
        'user_id',
        'start_time',
        'end_time'
      ],

      properties: {
        id: { type: 'integer' },
        title: { type: 'string' },
        description: { type: 'string' },
        location: { type: 'string' },
        latitude: { type: 'number' },
        longitude: { type: 'number' },
        start_time: { type: 'string' },
        end_time: { type: 'string' },
        user_id: { type: 'integer' }
      }
    };
  }

  static relationMappings = () => ({
    user: {
      join: {
        from: 'events.user_id',
        to: 'users.id'
      },
      modelClass: User,
      relation: Model.BelongsToOneRelation
    },
    requests: {
      join: {
        from: 'events.id',
        to: 'requests.event_id'
      },
      modelClass: Request,
      relation: Model.HasManyRelation
    }
  });
}

export default Event;
