import Event from '../models/Event.js';
import { RequestError } from '../utils/errors.js';
import * as Yup from 'yup';
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
    const user_id = req.userId;
    const distance = req.query.distance;
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;

    const schema = Yup.object().shape({
      distance: Yup.number('Formato do número inválido').required(
        'A distância é obrigatória'
      ),
      latitude: Yup.number('Formato da latitude inválida').required(
        'A latitude é obrigatória'
      ),
      longitude: Yup.number('Formato da longitude inválida').required(
        'A longitude é obrigatória'
      )
    });
    await schema.validate({ distance, latitude, longitude });

    let events;

    if (user_id) {
      events = await Event.query().whereNot({ user_id });
    } else {
      events = await Event.query();
    }

    const nearestEvents = events.filter(event => {
      const distanceThreshold = DistanceCalculator.getDistanceFromLatLonInKm(
        latitude,
        longitude,
        event.latitude,
        event.longitude
      );

      return distanceThreshold < distance;
    });

    return res.status(200).json(nearestEvents);
  }

  async indexUserEvents(req, res) {
    const userId = req.userId;
    const events = await Event.query()
      .where({ user_id: userId })
      .withGraphFetched({
        requests: {
          user: true
        }
      });

    for (const eventKey in events) {
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
}

export default new EventController();
