require('dotenv').config();

const processEnv = process.env;
let config;

const initialize = (settings) => {
  const defaultSettings = {
    PORT: 3000,
    LOG_FILE_NAME: 'logOutput.log',
    LOGGING_LEVEL: 'debug',
    NODE_ENV: 'development',
    DATA_SOURCE_BASE_URL: 'https://bpdts-test-app.herokuapp.com',
    REQUEST_TIMEOUT: 30000,
    COORDINATES_FILEPATH: './../../resources/coordinates.json',
    NODE_TLS_REJECT_UNAUTHORIZED: 0,
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
