import mongoose from 'mongoose';
import { getEnvVar } from '../utils/getEnvVar.js';
import { ENV_VARS } from '../constants/envVars.js';

export const initMongoConnection = async () => {
  const user = getEnvVar(ENV_VARS.MONGODB_USER);
  const password = encodeURIComponent(getEnvVar(ENV_VARS.MONGODB_PASSWORD));
  const url = getEnvVar(ENV_VARS.MONGODB_URL);
  const dbName = getEnvVar(ENV_VARS.MONGODB_DB);

  const fullUrl = `mongodb+srv://${user}:${password}@${url}/${dbName}?retryWrites=true&w=majority`;
  console.log('MongoDB connect string:', fullUrl);

  await mongoose.connect(fullUrl);
  console.log('Mongo connection successfully established!');
};
