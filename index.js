import download from './tasks/download.js';
import combine from './tasks/combine.js';
import cleanup from './tasks/cleanup.js';
import updateLocal from './tasks/updateLocal.js';
import updateOnline from './tasks/updateOnline.js';

const sync = async () => {
  await cleanup();
  await download();
  await combine();
  await updateLocal();
  await updateOnline();
};

sync();
