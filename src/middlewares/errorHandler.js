import { isHttpError } from 'http-errors';
import { MongooseError } from 'mongoose';

export const errorHandlerMiddlewares = (error, req, res, next) => {
  if (isHttpError(error)) {
    return res.status(error.status).json({
      status: 'error',
      message: error.message,
      data: null,
    });
  }

  if (error instanceof MongooseError) {
    return res.status(500).json({
      status: 500,
      message: 'Database error',
      data: null,
    });
  }

  res.status(500).json({
    status: 500,
    message: 'Internal server error',
    data: null,
  });
};
