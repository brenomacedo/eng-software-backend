import { ValidationError } from 'yup';
import jwt from 'jsonwebtoken';

const { JsonWebTokenError, TokenExpiredError } = jwt;

export class RequestError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
  }
}

export const errorHandler = (err, _req, res, _next) => {
  if (err instanceof RequestError) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  } else if (err instanceof ValidationError) {
    return res.status(403).json({
      error: err.errors[0]
    });
  } else if (err instanceof JsonWebTokenError) {
    return res.status(401).json({
      error: 'Não autorizado'
    });
  } else if (err instanceof TokenExpiredError) {
    return res.status(401).json({
      error: 'Sessão expirada, realize o login novamente'
    });
  } else {
    return res.status(400).json({
      error: err
    });
  }
};
