import 'dotenv/config.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

const startApp = async () => {
  await initMongoConnection();
  setupServer();
};

startApp();
