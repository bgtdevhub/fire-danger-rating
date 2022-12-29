/**
 * Main logger component
 * Configurable to output either to a file or console.
 */
import { createLogger, transports, format } from 'winston';
import { logLevel } from '../config.js';
/** destructure timestamp, combine and simple method from format */
const { timestamp, combine, printf } = format;

/** define custom format */
const myFormat = printf(
  (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
);

/** Create winston logger */
const logger = createLogger({
  format: combine(timestamp(), myFormat),
  transports: [new transports.Console()]
});
logger.level = logLevel;

export default logger;
