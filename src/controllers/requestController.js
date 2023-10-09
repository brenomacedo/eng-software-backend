import Request from '../models/Request.js';
import { RequestError } from '../utils/errors.js';
import * as Yup from 'yup';
import 'express-async-errors';
//import Event from '../models/Event.js';

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

    console.log('a res', answer);

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

    await requestDetails.$query().patch({ status: answer });

    return res.status(200).json({ message: 'Request successfuly updated' });
  }

  async searchRequests(req, res) {
    const userId = Number(req.userId);
    const userRequests = await Request.query()
      .where({ user_id: userId })
      .withGraphFetched({
        event: {
          user: true,
          requests: {
            user: true
          }
        }
      });

    for (const i in userRequests) {
      delete userRequests[i].event.user.password;
    }
    //console.log(userRequests)
    return res.status(200).json(userRequests);
  }

  async userEventRequests(req, res) {
    const eventId = Number(req.params.id);
    //const userId = Number(req.userId);
    const requests = await Request.query()
      .where({ event_id: eventId })
      .withGraphFetched({
        user: true
      });

    for (const i in requests) {
      delete requests[i].user.password;
    }

    return res.status(200).json(requests);
  }
}

export default new RequestController();
