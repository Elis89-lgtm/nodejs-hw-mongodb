import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import router from './routers/contacts.routers.js';

import { getEnvVar } from './utils/getEnvVar.js';
import { ENV_VARS } from './constants/envVars.js';

import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandlerMiddlewares } from './middlewares/errorHandler.js';
import { requestIdMiddleware } from './middlewares/requestIdMiddleware.js';

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors(), pino(), requestIdMiddleware);

  app.use(router);

  app.use(notFoundHandler);

  app.use(errorHandlerMiddlewares);

  const PORT = getEnvVar(ENV_VARS.PORT, 3000);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
