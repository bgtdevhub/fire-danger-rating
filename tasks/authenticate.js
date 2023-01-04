import { ApplicationCredentialsManager } from '@esri/arcgis-rest-request';
import { clientId, clientSecret } from '../config.js';
import logger from '../lib/logger.js';

const authenticate = async () => {
  logger.info('authenticate --> start');

  const manager = await ApplicationCredentialsManager.fromCredentials({
    clientId,
    clientSecret
  });

  logger.info('authenticate --> complete');
  return manager;
};

export default authenticate;
