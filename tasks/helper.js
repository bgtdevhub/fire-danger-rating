import { dirname, join } from 'path';
import { localFolder } from '../config.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getPath = (prod, folder, file) => {
  if (file) {
    return prod
      ? `/tmp/${folder}/${file}`
      : join(__dirname, localFolder, folder, file);
  }
  return prod ? `/tmp/${folder}` : join(__dirname, localFolder, folder);
};
