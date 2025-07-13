import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import contactsRouter from './routers/contacts.routers.js';
import cookieParser from 'cookie-parser';
import { getEnvVar } from './utils/getEnvVar.js';
import { ENV_VARS } from './constants/envVars.js';
import authRouter from './routers/auth.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandlerMiddlewares } from './middlewares/errorHandler.js';
import { requestIdMiddleware } from './middlewares/requestIdMiddleware.js';
import { PERMANENT_UPLOAD_DIR, TEMP_UPLOAD_DIR } from './constants/paths.js';
import fs from 'fs';
import { setupSwagger } from './middlewares/swagger.js';

if (!fs.existsSync(TEMP_UPLOAD_DIR)) {
  fs.mkdirSync(TEMP_UPLOAD_DIR, { recursive: true });
  console.log('TEMP_UPLOAD_DIR created:', TEMP_UPLOAD_DIR);
} else {
  console.log('TEMP_UPLOAD_DIR already exists:', TEMP_UPLOAD_DIR);
}

export const setupServer = () => {
  const app = express();

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );
  app.use('/api-docs', setupSwagger());
  app.use('/uploads', express.static(PERMANENT_UPLOAD_DIR));

  app.use(cors(), pino(), cookieParser(), requestIdMiddleware);

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);

  app.use(notFoundHandler);

  app.use(errorHandlerMiddlewares);

  const PORT = getEnvVar(ENV_VARS.PORT, 3000);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
