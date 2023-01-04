import { unlinkSync, readdirSync, existsSync } from 'fs';
import logger from '../lib/logger.js';
import { getCombinedPath, getDownloadPath, getUpdatedPath } from './helper.js';

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
  const combinedFile = getCombinedPath();
  if (existsSync(combinedFile)) {
    unlinkSync(combinedFile);
  }

  // updated folder
  logger.info('cleanup --> updated folder');
  const updatedFile = getUpdatedPath();
  if (existsSync(updatedFile)) {
    unlinkSync(updatedFile);
  }
  logger.info('cleanup --> completed');
};

export default cleanup;
