import { getService } from '@esri/arcgis-rest-feature-service';
import logger from '../lib/logger.js';

// test url
// https://services1.arcgis.com/vHnIGBHHqDR6y0CR/arcgis/rest/services/Fire_Danger_Ratings_for_Victoria/FeatureServer/0'
// output = { id: 0, timeExtent: [ 1623801600000, 1624147200000 ] }

const updateTimeExtent = async (manager, featureServerUrl) => {
  logger.info('updateTimeExtent --> start');
  return getService({
    url: featureServerUrl,
    authentication: manager,
    params: {
      f: 'json',
      returnUpdates: true
    }
  })
    .then((response) => {
      if (response && response.timeExtent) {
        logger.info(
          `updateTimeExtend --> timeExtend from ${response.timeExtent[0]} to ${response.timeExtent[1]}`
        );
      }
      logger.info('updateTimeExtent --> complete');
    })
    .catch((err) => {
      if (err) {
        logger.error(
          `updateTimeExtent --> encountered error ${JSON.stringify(err)}`
        );
      }
    });
};

export default updateTimeExtent;
// updateTimeExtent();
