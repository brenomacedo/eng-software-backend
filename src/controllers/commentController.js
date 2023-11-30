import UserComment from '../models/UserComment.js';
import * as Yup from 'yup';

class CommentController {
  async create(req, res) {
    const content = req.body.content;
    const userId = Number(req.params.id);
    const authorId = req.userId;

    const schema = Yup.object().shape({
      content: Yup.string('Formato do comentário inválido!').required(),
      userId: Yup.number('Formato do usuário inválido!').required()
    });
    await schema.validate({ content, userId });

    const userComment = await UserComment.query().findOne({
      author_id: authorId,
      user_id: userId
    });

    let comment;
    if (userComment) {
      comment = await userComment
        .$query()
        .patchAndFetch({ content, edited: true })
        .withGraphFetched({ author: true });
    } else {
      comment = await UserComment.query()
        .insertAndFetch({
          content,
          user_id: userId,
          author_id: authorId,
          edited: false
        })
        .withGraphFetched({ author: true });
    }

    delete comment.author.password;

    return res.status(201).json(comment);
  }

  async delete(req, res) {
    const authorId = Number(req.params.id);
    const userId = req.userId;

    await UserComment.query()
      .delete()
      .where({ author_id: authorId, user_id: userId });

    return res.status(200).json({ deleted: true });
  }

  async index(req, res) {
    const userId = Number(req.params.id);
    const page = req.query.page;
    const authorId = req.query.authorId;

    const schema = Yup.object().shape({
      page: Yup.number('Formato da página inválido!').required()
    });
    await schema.validate({ page });

    const comments = await UserComment.query()
      .where({ user_id: userId })
      .whereNot({ author_id: authorId || 0 })
      .withGraphFetched({ author: true })
      .offset(page * 5)
      .limit(5);

    for (const comment of comments) {
      delete comment.author.password;
    }

    if (Number(page) === 0 && authorId) {
      const userComment = await UserComment.query()
        .findOne({ author_id: authorId, user_id: userId })
        .withGraphFetched({ author: true });

      if (userComment) {
        comments.push(userComment);
      }
    }

    return res.status(200).json(comments);
  }
}

export default new CommentController();
