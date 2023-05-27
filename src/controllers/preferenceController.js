import UserCategory from '../models/UserCategory.js';
import { RequestError } from '../utils/errors.js';
import * as Yup from 'yup';
import 'express-async-errors';

class PreferenceController {
  async addPreference(req, res) {
    const { categoryId } = req.body;
    const userId = req.userId;

    const schema = Yup.object().shape({
      categoryId: Yup.number('Formato do id da categoria é inválida')
    });

    await schema.validate({ userId, categoryId });

    const userCategoryRow = await UserCategory.query().findOne({
      user_id: userId,
      category_id: categoryId
    });

    if (userCategoryRow) {
      throw new RequestError('O usuário já possui essa preferência.', 409);
    }

    await UserCategory.query().insert({
      user_id: userId,
      category_id: categoryId
    });

    return res.status(200).json({ userId, categoryId });
  }

  async removePreference(req, res) {
    const categoryId = Number(req.params.categoryId);
    const userId = req.userId;

    const schema = Yup.object().shape({
      categoryId: Yup.number('Formato do id da categoria é inválida')
    });
    await schema.validate({ categoryId });

    await UserCategory.query().delete().where({
      user_id: userId,
      category_id: categoryId
    });
    return res.status(200).json({ message: 'Preferência removida' });
  }
}

export default new PreferenceController();
