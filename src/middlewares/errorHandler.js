import { isHttpError } from 'http-errors';
import { MongooseError } from 'mongoose';
import Joi from 'joi';

export const errorHandlerMiddlewares = (error, req, res, next) => {
  console.error(error);
  if (isHttpError(error)) {
    return res.status(error.status).json({
      status: 'error',
      message: error.message,
      data: null,
    });
  }

  if (error instanceof Joi.ValidationError) {
    return res.status(400).json({
      status: 400,
      message: 'Bad request',
      data: {
        errors: error.details.map((detail) => ({
          message: detail.message,
          path: detail.path,
          type: detail.type,
          context: detail.context,
        })),
      },
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
