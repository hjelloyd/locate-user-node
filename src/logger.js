const { createLogger, format, transports } = require('winston');
const config = require('./config').getConfig();

let logger;

const initialize = () => {
  const log = createLogger({
    level: config.LOGGING_LEVEL,
    format: format.json(),
    defaultMeta: { service: 'locate-user-node' },
    transports: [
      new transports.File({ filename: config.LOG_FILE_NAME }),
    ],
  });
  if (config.NODE_ENV !== 'production') {
    log.add(new transports.Console({
      format: format.simple(),
    }));
  }
  return log;
};

const getLogger = () => {
  if (!logger) {
    logger = initialize();
  }
  return logger;
};

module.exports = {
  initialize,
  getLogger,
};
