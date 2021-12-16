require('dotenv').config();

const processEnv = process.env;
let config;

const initialize = (settings) => {
  const defaultSettings = {
    PORT: 3000,
    LOG_FILE_NAME: 'logOutput.log',
    LOGGING_LEVEL: 'debug',
    NODE_ENV: 'development',
  };

  return { ...defaultSettings, ...settings };
};

const getConfig = () => {
  if (!config) {
    /* eslint no-undef:0 */
    config = initialize(processEnv);
  }
  return config;
};

module.exports = {
  initialize,
  getConfig,
};
