import { ApiKeyManager } from '@esri/arcgis-rest-request';
import { applyEdits, queryFeatures } from '@esri/arcgis-rest-feature-service';
import { readFileSync } from 'fs';
import { parse, parseISO } from 'date-fns';
import { apiKey, featureServerUrl } from '../config.js';
import { getCombinedPath } from './helper.js';

// // 2023-01-02T00:00:00+08:00
// const parseLocal = (date) => {
//   return parse(date, 'yyyy-MM-ddHH:mm:ssXXX', new Date());
// };
// console.log(parseLocal('2023-01-02T00:00:00+08:00'));

const update = () => {
  const combinedFile = getCombinedPath();
  const rawData = readFileSync(combinedFile, { encoding: 'utf8' });
  const jsonData = JSON.parse(rawData);
  const authentication = ApiKeyManager.fromKey(apiKey);

  queryFeatures({ url: featureServerUrl, authentication }).then((response) => {
    const resData = response.features.map((f) => {
      const sourceObj = f.attributes;
      const xmlObj = jsonData.filter((j) => j.aac === sourceObj.AAC);
      const periodXmlObj = xmlObj[sourceObj['Forecast_Period'] - 1];

      const newObj = {
        ...sourceObj,
        ['FireBehavIndex']: periodXmlObj.fireBehaviourIndex,
        ['FireDanger']: periodXmlObj.fireDanger,
        ['Start_Time_Local']: periodXmlObj.startTimeLocal,
        ['End_Time_Local']: periodXmlObj.endTimeLocal,
        ['Start_Time_UTC']: parseISO(periodXmlObj.startTimeUTC),
        ['End_Time_UTC']: parseISO(periodXmlObj.endTimeUTC)
      };

      //   return newObj;
      return {
        sourceObj,
        periodXmlObj,
        newObj
      };
    });
    console.log(resData[resData.length - 1]);
  });
};

update();
