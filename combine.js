import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { readFileSync, readdirSync, writeFileSync } from 'fs';

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
  const parser = new XMLParser({ ignoreAttributes: false });
  const fileList = readdirSync('./downloaded');
  //   console.log(fileList);

  const allFile = fileList.map((file) => {
    const XMLfile = readFileSync(`./downloaded/${file}`);
    const jsonObj = parser.parse(XMLfile);

    const oneFile = jsonObj.product.forecast.area
      .filter((f) => f['@_type'] !== 'region')
      .map((x) => {
        return getFireRating(x);
      });

    return oneFile.flat();
  });

  const combinedData = JSON.stringify(allFile.flat());

  writeFileSync('./combined/index.js', combinedData);
  //   console.dir(allFile.flat(), { depth: null });
};

combine();
