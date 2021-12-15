const { createLogger, format, transports } = require('winston');
let logger;

 const initialize = (config) => {
  logger = createLogger({
    level: config.LOGGING_LEVEL,
    format: format.json(),
    defaultMeta: { service: 'locate-user-node' },
    transports: [
      new transports.File({ filename: config.LOG_FILE_NAME }),
    ],
  });
  if (config.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
      format: format.simple(),
    }));
  }
  return logger;
};

module.exports = {
  initialize,
  logger,
}


