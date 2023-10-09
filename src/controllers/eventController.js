import Event from '../models/Event.js';
import { RequestError } from '../utils/errors.js';
import * as Yup from 'yup';
import EventRating from '../models/EventRating.js';
import 'express-async-errors';

class DistanceCalculator {
  static getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = DistanceCalculator.deg2rad(lat2 - lat1); // deg2rad below
    var dLon = DistanceCalculator.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(DistanceCalculator.deg2rad(lat1)) *
        Math.cos(DistanceCalculator.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  static deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
}

class EventController {
  async create(req, res) {
    const {
      title,
      description,
      location,
      latitude,
      longitude,
      start_time,
      end_time,
      type
    } = req.body;
    const data = {
      title,
      description,
      location,
      latitude,
      longitude,
      start_time,
      end_time,
      type
    };
    const userId = req.userId;

    const schema = Yup.object().shape({
      title: Yup.string('Formato do título inválido').required(
        'O título é obrigatório'
      ),
      description: Yup.string('Formato da descrição inválida').required(
        'A descrição é obrigatória'
      ),
      location: Yup.string('Formato da localização inválida').required(
        'A localização é obrigatória'
      ),
      latitude: Yup.number('Formato da latitude inválida').required(
        'A latitude é obrigatória'
      ),
      longitude: Yup.number('Formato da longitude inválida').required(
        'A longitude é obrigatória'
      )
    });

    await schema.validate(data);

    const newEvent = await Event.query().insertAndFetch({
      ...data,
      user_id: userId
    });

    return res.status(200).json(newEvent);
  }

  async indexNearestEvents(req, res) {
    const distance = req.query.distance;
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    const title = req.query.title;

    const schema = Yup.object().shape({
      distance: Yup.number('Formato do número inválido').required(
        'A distância é obrigatória'
      ),
      latitude: Yup.number('Formato da latitude inválida').required(
        'A latitude é obrigatória'
      ),
      longitude: Yup.number('Formato da longitude inválida').required(
        'A longitude é obrigatória'
      ),
      title: Yup.string('Formato do título do evento inválido')
    });
    await schema.validate({ distance, latitude, longitude, title });

    let eventsQuery = Event.query();
    if (title) {
      eventsQuery = eventsQuery.where('title', 'ilike', `%${title}%`);
    }

    const events = await eventsQuery.withGraphFetched({
      requests: {
        user: true
      },
      user: {
        ratings: true
      },
      ratings: true
    });

    const nearestEvents = events.filter(event => {
      const distanceThreshold = DistanceCalculator.getDistanceFromLatLonInKm(
        latitude,
        longitude,
        event.latitude,
        event.longitude
      );

      return distanceThreshold < distance;
    });

    for (let i = 0; i < nearestEvents.length; ++i) {
      delete nearestEvents[i].user.password;
      for (let j = 0; j < nearestEvents[i].requests.length; ++j) {
        delete nearestEvents[i].requests[j].user.password;
      }
    }

    return res.status(200).json(nearestEvents);
  }

  async indexUserEvents(req, res) {
    const userId = req.userId;
    const events = await Event.query()
      .where({ user_id: userId })
      .withGraphFetched({
        requests: {
          user: true
        },
        user: {
          ratings: true
        },
        ratings: true
      });

    for (const eventKey in events) {
      delete events[eventKey].user.password;
      for (const requestKey in events[eventKey].requests) {
        delete events[eventKey].requests[requestKey].user.password;
      }
    }
    return res.status(200).json(events);
  }

  async update(req, res) {
    const {
      title,
      description,
      location,
      latitude,
      longitude,
      start_time,
      end_time
    } = req.body;
    const id = Number(req.params.id);
    const userId = req.userId;

    const schema = Yup.object().shape({
      title: Yup.string('Formato do título inválido'),
      description: Yup.string('Formato da descrição inválida'),
      location: Yup.string('Formato da localização inválida'),
      latitude: Yup.number('Formato da latitude inválida'),
      longitude: Yup.number('Formato da longitude inválida')
    });
    await schema.validate({
      title,
      description,
      location,
      latitude,
      longitude
    });

    const eventToUpdate = await Event.query().findById(id);

    if (!eventToUpdate) {
      throw new RequestError('Evento com esse id não encontrado', 404);
    }

    if (eventToUpdate.user_id !== userId) {
      throw new RequestError('Não autorizado', 401);
    }

    await eventToUpdate.$query().patch({
      title,
      description,
      location,
      latitude,
      longitude,
      start_time,
      end_time
    });

    return res.status(200).json({ message: 'Evento atualizado' });
  }

  async delete(req, res) {
    const id = Number(req.params.id);
    const userId = req.userId;

    const eventToDelete = await Event.query().findById(id);

    if (!eventToDelete) {
      throw new RequestError('Evento com esse id não encontrado!', 404);
    }

    if (eventToDelete.user_id !== userId) {
      throw new RequestError('Não autorizado', 401);
    }

    await eventToDelete.$query().delete();
    return res.status(200).json({ message: 'Evento deletado' });
  }

  async search(req, res) {
    const title = req.query.title;
    const userId = Number(req.params.userId);
    const eventsFound = await Event.query()
      .select('*')
      .where('title', 'ilike', `%${title}%`)
      .where('user_id', '!=', userId);

    return res.status(200).json(eventsFound);
  }

  async searchAll(req, res) {
    const title = req.query.title;
    const eventsFound = await Event.query()
      .select('*')
      .where('title', 'ilike', `%${title}%`);

    return res.status(200).json(eventsFound);
  }

  async rateEvent(req, res) {
    const { rating, event_rated } = req.body;
    const user_id = req.userId;

    const schema = Yup.object().shape({
      rating: Yup.number('Formato da avaliação inválida!').required(
        'A avaliação é obrigatória!'
      ),
      event_rated: Yup.number('Formato do evento avaliado inválido!').required(
        'O usuário avaliado é obrigatório!'
      )
    });

    await schema.validate({ rating, event_rated });

    const foundRating = await EventRating.query().findOne({
      user_id,
      event_rated
    });
    let newRating;

    if (foundRating) {
      newRating = await EventRating.query().patchAndFetchById(foundRating.id, {
        rating
      });
    } else {
      newRating = await EventRating.query().insertAndFetch({
        user_id,
        event_rated,
        rating
      });
    }

    return res.status(200).json(newRating);
  }
}

export default new EventController();
