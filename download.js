import ftp from 'basic-ftp';
import path from 'path';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import wrapper from './lib/wrapper.js';
import { fileList } from './config.js';

dotenv.config();
/**
 * @desc stop log and close ftp client connection
 * @param {Object} client - ftp client
 * @param {Number} delay - amount of time for delay in ms
 */
const closeAndExit = (client, delay) => {
  client.trackProgress();
  client.close();
  setTimeout(() => {
    process.exit(0);
  }, delay);
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
  console.log('======================================================');
  console.log(`${type}ing ${name}: total ${type}ed: ${bytesOverall} KB`);
};

const download = async () => {
  const client = new ftp.Client();
  //   client.ftp.verbose = true;

  const access = await wrapper(client.access({ host: process.env.HOST }));
  if (access.error) {
    console.error(
      `download -> ftp access error: ${JSON.stringify(
        access.error.error || access.error.message
      )}`
    );
    process.exit(1);
  }

  await client.cd(process.env.DIR_PATH);

  const list = await wrapper(client.list());
  if (list.error) {
    console.error(`download -> ftp list error: ${JSON.stringify(list.error)}`);
    closeAndExit(client, 10);
  }

  const listName = list.data
    .map((n) => n.name)
    .filter((i) => fileList.includes(i));
  //   console.log(listName);

  for (const f of listName) {
    const destination = path.join('./downloaded', f);
    console.log(destination);

    const download = await wrapper(client.downloadTo(destination, f));
    // close and exit if encounter error
    if (download.error) {
      console.error(
        `downloadFile -> ftp download error: ${JSON.stringify(download.error)}`
      );
      closeAndExit(client, 100);
    }
  }
  closeAndExit(client, 10);
};

download();
