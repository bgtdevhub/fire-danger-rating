import { ApiKeyManager } from '@esri/arcgis-rest-request';
import { queryFeatures } from '@esri/arcgis-rest-feature-service';
import { readFileSync, writeFileSync } from 'fs';
import { parseISO, getUnixTime } from 'date-fns';
import { apiKey, featureServerUrl } from '../config.js';
import { getCombinedPath, getUpdatedPath } from './helper.js';
import logger from '../lib/logger.js';

// 2023-01-02T00:00:00+08:00
const parseUnix = (date) => {
  const dateLocal = parseISO(date);
  return getUnixTime(dateLocal);
};

const updateLocal = async () => {
  logger.info('updateLocal --> started');

  const updatedFile = getUpdatedPath();
  const combinedFile = getCombinedPath();
  const rawData = readFileSync(combinedFile, { encoding: 'utf8' });
  const jsonData = JSON.parse(rawData);
  const authentication = ApiKeyManager.fromKey(apiKey);

  logger.debug('updateLocal --> fetching data...');
  return queryFeatures({ url: featureServerUrl, authentication })
    .then((response) => {
      logger.debug('updateLocal --> updating data...');
      const resData = response.features.map((f) => {
        const sourceObj = f.attributes;

        logger.debug(
          `updateLocal --> processing ${sourceObj.AAC} for forecast period ${
            sourceObj['Forecast_Period'] - 1
          }`
        );

        const xmlObj = jsonData.filter((j) => j.aac === sourceObj.AAC);
        const periodXmlObj = xmlObj[sourceObj['Forecast_Period'] - 1];

        const newObj = {
          attributes: {
            ...sourceObj,
            ['FireBehavIndex']: periodXmlObj.fireBehaviourIndex,
            ['FireDanger']: periodXmlObj.fireDanger,
            ['Start_Time']: periodXmlObj.startTimeUTC,
            ['End_Time']: periodXmlObj.endTimeUTC,
            ['Start_Time_UTC_str']: periodXmlObj.startTimeUTC,
            ['End_Time_UTC_str']: periodXmlObj.endTimeUTC
          }
        };

        return newObj;
      });

      logger.debug('updateLocal --> writing...');
      writeFileSync(updatedFile, JSON.stringify(resData));
      logger.info('updateLocal --> completed');
    })
    .catch((err) => {
      logger.error(`updateLocal --> encountered error: ${JSON.stringify(err)}`);
    });
};

export default updateLocal;
// updateLocal();
