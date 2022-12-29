import download from './tasks/download.js';
import combine from './tasks/combine.js';
import cleanup from './tasks/cleanup.js';

const sync = async () => {
  await cleanup();
  await download();
  await combine();
};

sync();
