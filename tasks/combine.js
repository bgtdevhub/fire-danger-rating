import { XMLParser } from 'fast-xml-parser';
import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { combinedFolder, downloadFolder, indexFile } from '../config.js';
import logger from '../lib/logger.js';
import { getPath } from './helper.js';

const getFireRating = (data) => {
  return data['forecast-period']
    .sort((a, b) => parseInt(a['@_index'], 10) - parseInt(b['@_index']), 10)
    .map((d) => {
      return {
        aac: data['@_aac'],
        forecastPeriod: parseInt(d['@_index'], 10),
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

const combine = (prod) => {
  logger.info('combine --> start');
  const parser = new XMLParser({ ignoreAttributes: false });

  const combinedFile = getPath(prod, combinedFolder, indexFile);
  const downloadPath = getPath(prod, downloadFolder);
  const fileList = readdirSync(downloadPath);
  logger.debug(`combine --> found ${fileList.length - 1} files`);

  logger.debug('combine --> combining...');
  const allFile = fileList
    .filter((x) => x.includes('xml'))
    .map((file) => {
      logger.debug(`combine --> processing ${file}`);
      const XMLsource = getPath(prod, downloadFolder, file);
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

  logger.debug('combine --> writing...');
  writeFileSync(combinedFile, combinedData);
  logger.info('combine --> completed');
};

export default combine;
