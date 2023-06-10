import jwt from 'jsonwebtoken';
import { RequestError } from '../utils/errors.js';

const auth = (req, res, next) => {
  const authorizationToken = req.headers.authorization;

  if (!req.headers.authorization) {
    throw new RequestError('Não autorizado', 401);
  }

  const splittedToken = authorizationToken.split(' ');

  if (
    !authorizationToken ||
    splittedToken.length !== 2 ||
    splittedToken[0] !== 'Bearer'
  ) {
    throw new RequestError('Não autorizado', 401);
  }

  const decodedPayload = jwt.verify(splittedToken[1], process.env.JWT_KEY);

  req.userId = decodedPayload.id;
  next();
};

export default auth;
