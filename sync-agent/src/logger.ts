import winston from 'winston';
import { config } from './config.js';

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf(({ level, message, timestamp }) => {
        return `${timestamp} [${level}]: ${message}`;
      })
    ),
  }),
];

if (config.log.file) {
  transports.push(
    new winston.transports.File({
      filename: config.log.file,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    })
  );
}

export const logger = winston.createLogger({
  level: config.log.level,
  transports,
});
