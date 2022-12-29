import path from 'path';
import { combinedFile, combinedFolder, downloadFolder } from '../config.js';
import { __dirname } from '../lib/dirname.js';

export const getDownloadPath = (file) => {
  if (file) {
    return path.join(__dirname, downloadFolder, file);
  }
  return path.join(__dirname, downloadFolder);
};

export const getCombinedPath = () => {
  return path.join(__dirname, combinedFolder, combinedFile);
};
