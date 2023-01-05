import { unlinkSync, readdirSync, existsSync, mkdirSync } from 'fs';
import {
  combinedFolder,
  downloadFolder,
  indexFile,
  updatedFolder
} from '../config.js';
import logger from '../lib/logger.js';
import { getPath } from './helper.js';

const cleanup = (prod) => {
  logger.info('cleanup --> start');

  // check folder exist
  logger.info('cleanup --> check folder exist');
  const folderList = [downloadFolder, combinedFolder, updatedFolder];
  for (const folder of folderList) {
    const folderPath = getPath(prod, folder);
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath);
    }
  }

  // download folder
  logger.info('cleanup --> download folder');
  const downloadPath = getPath(prod, downloadFolder);
  const fileList = readdirSync(downloadPath);

  const allFile = fileList.filter((x) => x.includes('xml'));

  if (allFile.length !== 0) {
    for (const file of allFile) {
      logger.debug(`cleanup --> processing ${file}`);
      const destination = getPath(prod, downloadFolder, file);
      unlinkSync(destination);
    }
  }

  // combined folder
  logger.info('cleanup --> combined folder');
  const combinedFile = getPath(prod, combinedFolder, indexFile);
  if (existsSync(combinedFile)) {
    unlinkSync(combinedFile);
  }

  // updated folder
  logger.info('cleanup --> updated folder');
  const updatedFile = getPath(prod, updatedFolder, indexFile);
  if (existsSync(updatedFile)) {
    unlinkSync(updatedFile);
  }
  logger.info('cleanup --> completed');
};

export default cleanup;
