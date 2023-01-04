import path from 'path';
import {
  indexFile,
  combinedFolder,
  downloadFolder,
  updatedFolder
} from '../config.js';
import { __dirname } from '../lib/dirname.js';

export const getDownloadPath = (file) => {
  if (file) {
    return path.join(__dirname, downloadFolder, file);
  }
  return path.join(__dirname, downloadFolder);
};

export const getCombinedPath = () => {
  return path.join(__dirname, combinedFolder, indexFile);
};

export const getUpdatedPath = () => {
  return path.join(__dirname, updatedFolder, indexFile);
};
