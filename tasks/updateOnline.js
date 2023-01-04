import { ApiKeyManager } from '@esri/arcgis-rest-request';
import { applyEdits } from '@esri/arcgis-rest-feature-service';
import { readFileSync } from 'fs';
import { apiKey, featureServerUrl } from '../config.js';
import { getUpdatedPath } from './helper.js';
import logger from '../lib/logger.js';

const updateOnline = async () => {
  logger.info('updateOnline --> started');

  const updatedFile = getUpdatedPath();
  const rawData = readFileSync(updatedFile, { encoding: 'utf8' });
  const jsonData = JSON.parse(rawData);

  const authentication = ApiKeyManager.fromKey(apiKey);

  logger.debug('updateOnline --> updating...');
  return applyEdits({
    url: featureServerUrl,
    updates: jsonData,
    f: 'json',
    authentication
  })
    .then((response) => {
      const { updateResults } = response;
      const success = updateResults.filter((s) => s.success === true).length;
      const failedData = updateResults.filter(
        (f) => f.error === true || f.success === false
      );
      const failed = failedData.length;
      const failedId = failedData.map((fd) => fd.objectId);

      logger.info(`updateOnline --> success  : ${success}`);
      logger.info(`updateOnline --> failed   : ${failed}`);
      logger.info(`updateOnline --> failedID : ${failedId.join()}`);
      logger.info('updateOnline --> completed');
    })
    .catch((err) => {
      logger.error(`updateOnline --> encountered error: ${err}`);
    });
};

export default updateOnline;
// updateOnline();
