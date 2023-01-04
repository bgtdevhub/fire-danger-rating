import authenticate from './tasks/authenticate.js';
import download from './tasks/download.js';
import combine from './tasks/combine.js';
import cleanup from './tasks/cleanup.js';
import updateLocal from './tasks/updateLocal.js';
import updateOnline from './tasks/updateOnline.js';

const sync = async () => {
  const manager = await authenticate();
  await cleanup();
  await download();
  await combine();
  await updateLocal(manager);
  await updateOnline(manager);
};

sync();
