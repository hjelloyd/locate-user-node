const axios = require('axios');
const retryAxios = require('retry-axios');

const config = require('../config').getConfig();
const logger = require('../logger').getLogger();

retryAxios.attach();

const retryAttempt = (error) => {
  const cfg = retryAxios.getConfig(error);
  logger.info(`Retry attempt #${cfg.currentRetryAttempt} Previous Attempt Failed: ${error.message}`);
};

const retryConfig = {
  retry: 2,
  noResponseRetries: 2,
  instance: axios,
  httpMethodsToRetry: ['GET'],
  onRetryAttempt: retryAttempt,
};

const getUsersByCity = async (city) => {
  const url = `${config.DATA_SOURCE_BASE_URL}/city/${city}/users`;
  try {
    logger.info(`Getting users for city: ${city}`);
    const response = await axios.get(url, {
      timeout: config.REQUEST_TIMEOUT,
      raxConfig: retryConfig,
    });
    return response.data.map((item) => ({ ...item, ...{ type: ['CITY'] } }));
  } catch (err) {
    logger.error(`Failed to retrieve users for city: ${city} - ${err.message}`);
    throw err;
  }
};

const getAllUsers = async () => {
  const url = `${config.DATA_SOURCE_BASE_URL}/users`;
  try {
    logger.info('Getting all users');
    const response = await axios.get(url, {
      timeout: config.REQUEST_TIMEOUT,
      raxConfig: retryConfig,
    });
    return response.data;
  } catch (err) {
    logger.error(`Failed to retrieve all users - ${err.message}`);
    throw err;
  }
};

module.exports = {
  retryAttempt,
  getUsersByCity,
  getAllUsers,
};
