import { config } from 'dotenv';

import authenticate from './tasks/authenticate.js';
import download from './tasks/download.js';
import combine from './tasks/combine.js';
import cleanup from './tasks/cleanup.js';
import updateLocal from './tasks/updateLocal.js';
import updateOnline from './tasks/updateOnline.js';
import updateTimeExtent from './tasks/updateTimeExtent.js';

config();

const { featureServerUrl, clientId, clientSecret } = process.env;

export const sync = async (prod = true) => {
  const manager = await authenticate(clientId, clientSecret);
  await cleanup(prod);
  await download(prod);
  await combine(prod);
  await updateLocal(prod, manager, featureServerUrl);
  await updateOnline(prod, manager, featureServerUrl);
  await updateTimeExtent(manager, featureServerUrl);
  return 'OK';
};

// sync();
