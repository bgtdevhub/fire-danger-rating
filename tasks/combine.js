import { XMLParser } from 'fast-xml-parser';
import { readFileSync, readdirSync, writeFileSync } from 'fs';
import logger from '../lib/logger.js';
import { getCombinedPath, getDownloadPath } from './helper.js';

const getFireRating = (data) => {
  return data['forecast-period'].map((d) => {
    return {
      aac: data['@_aac'],
      forecastPeriod: d['@_index'],
      description: data['@_description'],
      fireBehaviourIndex: d.element['#text'],
      fireDanger: d.text['#text'],
      startTimeLocal: d['@_start-time-local'],
      endTimeLocal: d['@_end-time-local'],
      startTimeUTC: d['@_start-time-utc'],
      endTimeUTC: d['@_end-time-utc']
    };
  });
};

const combine = () => {
  logger.info('combine --> start');
  const parser = new XMLParser({ ignoreAttributes: false });

  const combinedPath = getCombinedPath();
  const downloadPath = getDownloadPath();
  const fileList = readdirSync(downloadPath);
  logger.debug(`combine --> found ${fileList.length - 1} files`);

  const allFile = fileList
    .filter((x) => x.includes('xml'))
    .map((file) => {
      logger.debug(`combine --> processing ${file}`);
      const XMLsource = getDownloadPath(file);
      const XMLfile = readFileSync(XMLsource);
      const jsonObj = parser.parse(XMLfile);

      const oneFile = jsonObj.product.forecast.area
        .filter((f) => f['@_type'] !== 'region')
        .map((x) => {
          return getFireRating(x);
        });

      return oneFile.flat();
    });

  const combinedData = JSON.stringify(allFile.flat());

  logger.debug('combine --> combining...');
  writeFileSync(combinedPath, combinedData);
  logger.info('combine --> completed');
};

export default combine;
