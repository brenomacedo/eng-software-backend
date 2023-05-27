import Request from '../models/Request.js';
import { RequestError } from '../utils/errors.js';
import * as Yup from 'yup';
import 'express-async-errors';

class RequestController {
  async create(req, res) {
    const { eventId, message } = req.body;
    const userId = req.userId;

    const schema = Yup.object().shape({
      eventId: Yup.number('Formato do id do evento inválido').required(
        'O id do evento é obrigatório'
      ),
      message: Yup.string('Formato da mensagem inválida')
    });
    await schema.validate({ eventId, message });

    const requestExists = await Request.query().findOne({
      user_id: userId,
      event_id: eventId
    });

    if (requestExists) {
      throw new RequestError('Você já enviou uma requisição', 409);
    }

    const newRequest = await Request.query().insertAndFetch({
      event_id: eventId,
      user_id: userId,
      status: 'PENDING',
      message: message
    });

    return res.status(200).json(newRequest);
  }

  async respond(req, res) {
    const requestId = Number(req.params.id);
    const userId = req.userId;
    const { answer } = req.body;

    const schema = Yup.object().shape({
      answer: Yup.string('A resposta é obrigatória').oneOf(
        ['ACCEPTED', 'DENIED'],
        'Valor de resposta incorreto'
      )
    });

    await schema.validate({ answer });

    const requestDetails = await Request.query()
      .findById(requestId)
      .withGraphFetched({
        event: {
          user: true
        }
      });

    if (!requestDetails) {
      throw new RequestError('Requisição com este id não encontrada');
    }

    if (requestDetails.event.user.id !== userId) {
      throw new RequestError('Não autorizado', 401);
    }

    await requestDetails.$query().patch({ status: 'ACCEPTED' });

    return res.status(200).json({ message: 'Request successfuly updated' });
  }
}

export default new RequestController();
