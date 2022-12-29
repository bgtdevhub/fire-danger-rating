import { unlinkSync, readdirSync, existsSync } from 'fs';
import logger from '../lib/logger.js';
import { getCombinedPath, getDownloadPath } from './helper.js';

const cleanup = () => {
  logger.info('cleanup --> start');
  // download folder
  logger.info('cleanup --> download folder');
  const downloadPath = getDownloadPath();
  const fileList = readdirSync(downloadPath);

  const allFile = fileList.filter((x) => x.includes('xml'));

  for (const file of allFile) {
    logger.debug(`cleanup --> processing ${file}`);
    const destination = getDownloadPath(file);
    unlinkSync(destination);
  }

  // combined folder
  logger.info('cleanup --> combined folder');
  const combinedPath = getCombinedPath();
  if (existsSync(combinedPath)) {
    unlinkSync(combinedPath);
  }
  logger.info('cleanup --> completed');
};

export default cleanup;
