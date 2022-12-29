import ftp from 'basic-ftp';
// import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import wrapper from '../lib/wrapper.js';
import { fileList, ftpHost, ftpPath } from '../config.js';
import { getDownloadPath } from './helper.js';
import logger from '../lib/logger.js';

// dotenv.config();
/**
 * @desc stop log and close ftp client connection
 * @param {Object} client - ftp client
 */
const closeAndExit = (client) => {
  client.trackProgress();
  client.close();
  logger.info('download --> completed');
  // process.exit(0);
};

/**
 * @desc display ftp process and progress log to console
 * @param {Object} ftp - ftp process
 * @param {String} ftp.type - type of ftp process
 * @param {String} ftp.name - name of the file
 * @param {Number} ftp.bytes - current bytes of the file
 * @param {Number} ftp.bytesOverall - current total bytes of the files downloaded
 */
const printLog = ({ type, name, bytesOverall }) => {
  logger.debug('======================================================');
  logger.debug(`${type}ing ${name}: total ${type}ed: ${bytesOverall} KB`);
};

const download = async () => {
  logger.info('download --> start');
  const client = new ftp.Client();
  //   client.ftp.verbose = true;

  const access = await wrapper(client.access({ host: ftpHost }));
  if (access.error) {
    logger.error(
      `download -> ftp access error: ${JSON.stringify(
        access.error.error || access.error.message
      )}`
    );
    process.exit(1);
  }

  await client.cd(ftpPath);

  const list = await wrapper(client.list());
  if (list.error) {
    logger.error(`download -> ftp list error: ${JSON.stringify(list.error)}`);
    closeAndExit(client);
  }

  const listName = list.data
    .map((n) => n.name)
    .filter((i) => fileList.includes(i));

  for (const file of listName) {
    client.trackProgress(printLog);
    const destination = getDownloadPath(file);

    const download = await wrapper(client.downloadTo(destination, file));
    // close and exit if encounter error
    if (download.error) {
      logger.error(
        `downloadFile -> ftp download error: ${JSON.stringify(download.error)}`
      );
      closeAndExit(client);
    }
  }
  closeAndExit(client);
};

export default download;
