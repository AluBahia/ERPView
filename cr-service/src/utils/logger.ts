import winston from 'winston';

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf(({ level, message, timestamp }: any) => {
        return `${timestamp} [${level}]: ${message}`;
      })
    ),
  }),
];

if (process.env.LOG_FILE) {
  transports.push(
    new winston.transports.File({
      filename: process.env.LOG_FILE,
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    })
  );
}

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports,
});
