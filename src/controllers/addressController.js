import Address from '../models/Address.js';
import * as Yup from 'yup';

class addressController {
  async create(req, res) {
    const { state, city, neighborhood, user_id} = req.body;

    const schema = Yup.object().shape({
      state: Yup.string('O formato do Estado é inválido.').required(
        'O Estado é obrigatório.'
      ),

      city: Yup.string('O formato da cidade é inválido.').required(
        'A cidade é obrigatória.'
      ),

      neighborhood: Yup.string('O formato do bairro é inválido.').required(
        'O bairro é obrigatório.'
      )
    });

    await schema.validate({ state, city, neighborhood , user_id});

    const address = await Address.query().insert({
      state,
      city,
      neighborhood,
      user_id
    });
    return res.json(address);
  }

  async update(req, res) {
    const { id } = req.params;
    const { state, city, neighborhood, user_id} = req.body;

    const schema = Yup.object().shape({
      state: Yup.string('O formato do estado é inválido.'),
      city: Yup.string('O formato da cidade é inválido.'),
      neighborhood: Yup.string('O formato do bairro é inválido')
    });

    await schema.validate({ state, city, neighborhood });

    const address = await Address.query().findById(id);

    if (!address) {
      throw new Error('Address not found');
    }

    await address.$query().patch({ state, city, neighborhood, user_id});
    return res.json(address);
  }
}

export default new addressController();