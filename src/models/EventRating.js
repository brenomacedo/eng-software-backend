import { Model } from 'objection';
import User from './User.js';
import Event from './Event.js';

class EventRating extends Model {
  static get tableName() {
    return 'event_ratings';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['rating'],

      properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        event_rated: { type: 'integer' },
        rating: { type: 'integer' }
      }
    };
  }

  static relationMappings = () => ({
    user: {
      join: {
        from: 'event_ratings.user_id',
        to: 'users.id'
      },
      modelClass: User,
      relation: Model.BelongsToOneRelation
    },
    event: {
      join: {
        from: 'event_ratings.event_rated',
        to: 'events.id'
      },
      modelClass: Event,
      relation: Model.BelongsToOneRelation
    }
  });
}

export default EventRating;
