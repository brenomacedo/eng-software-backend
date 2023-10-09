import { Model } from 'objection';
import User from './User.js';

class EventRating extends Model {
  static get tableName() {
    return 'user_ratings';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['rating'],

      properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        user_rated: { type: 'integer' },
        rating: { type: 'integer' }
      }
    };
  }

  static relationMappings = () => ({
    user: {
      join: {
        from: 'user_ratings.user_id',
        to: 'users.id'
      },
      modelClass: User,
      relation: Model.BelongsToOneRelation
    },
    rated_user: {
      join: {
        from: 'user_ratings.user_rated',
        to: 'users.id'
      },
      modelClass: User,
      relation: Model.BelongsToOneRelation
    }
  });
}

export default EventRating;
