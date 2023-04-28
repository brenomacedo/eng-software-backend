import { ValidationError } from 'yup';

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
  } else {
    return res.status(400).json({
      error:
        'Ocorreu um erro desconhecido, por favor, contate os desenvolvedores'
    });
  }
};
