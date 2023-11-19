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
        .patchAndFetch({ content, edited: true });
    } else {
      comment = await UserComment.query().insertAndFetch({
        content,
        user_id: userId,
        author_id: authorId,
        edited: false
      });
    }

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
}

export default new CommentController();
