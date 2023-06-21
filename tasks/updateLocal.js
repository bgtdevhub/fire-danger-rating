import { queryFeatures } from '@esri/arcgis-rest-feature-service';
import { readFileSync, writeFileSync } from 'fs';

import { getPath } from './helper.js';
import logger from '../lib/logger.js';
import { combinedFolder, indexFile, updatedFolder } from '../config.js';

const updateLocal = async (prod, manager, featureServerUrl) => {
  logger.info('updateLocal --> started');

  const updatedFile = getPath(prod, updatedFolder, indexFile);
  const combinedFile = getPath(prod, combinedFolder, indexFile);
  const rawData = readFileSync(combinedFile, { encoding: 'utf8' });
  const jsonData = JSON.parse(rawData);

  logger.debug('updateLocal --> fetching data...');
  return queryFeatures({
    url: featureServerUrl,
    authentication: manager
  })
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
        if (xmlObj.length === 0) {
          return { attributes: null };
        }
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

      const finalRes = resData.filter((x) => x.attributes !== null);

      logger.debug('updateLocal --> writing...');
      writeFileSync(updatedFile, JSON.stringify(finalRes));
      logger.info('updateLocal --> completed');
    })
    .catch((err) => {
      logger.error(`updateLocal --> encountered error: ${err}`);
    });
};

export default updateLocal;
