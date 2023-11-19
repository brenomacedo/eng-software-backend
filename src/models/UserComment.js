import { Model } from 'objection';
import User from './User.js';

class UserComment extends Model {
  static get tableName() {
    return 'user_comments';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['content', 'user_id', 'author_id', 'edited'],

      properties: {
        id: { type: 'integer' },
        content: { type: 'string' },
        user_id: { type: 'integer' },
        author_id: { type: 'integer' },
        edited: { type: 'boolean' }
      }
    };
  }

  static relationMappings = () => ({
    author: {
      join: {
        from: 'user_comments.author_id',
        to: 'users.id'
      },
      modelClass: User,
      relation: Model.BelongsToOneRelation
    },
    user: {
      join: {
        from: 'user_comments.user_id',
        to: 'users.id'
      },
      modelClass: User,
      relation: Model.BelongsToOneRelation
    }
  });
}

export default UserComment;
