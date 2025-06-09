import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import { randomUUID } from 'node:crypto';
import { getEnvVar } from './utils/getEnvVar.js';
import { ENV_VARS } from './constants/envVars.js';
import contactsRouter from './routes/contacts.routes.js';

dotenv.config();
const PORT = getEnvVar(ENV_VARS.PORT, 3000);

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use((req, res, next) => {
    req.id = randomUUID();
    next();
  });

  app.use('/contacts', contactsRouter);

  app.get('/', (req, res) => {
    res.send('The API works! Use /contacts');
  });

  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
      status: 404,
    });
  });

  app.use((error, req, res, next) => {
    console.error(`Error in request ${req.id}:`, error.message);

    res.status(500).json({
      errorMessage: error.message,
      id: req.id,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
