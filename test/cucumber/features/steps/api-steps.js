const axios = require('axios');
const assert = require('assert');
const config = require('../../../../src/config').getConfig();
const logger = require('../../../../src/logger').getLogger();

const callLocatorApi = async (city, distance) => {
  try {
    return axios.get(`http://localhost:${config.PORT}/api/v1/city/${city}/distance/${distance}`);
  } catch (err) {
    if (err.response) {
      logger.info('Received error response');
      return err.response;
    }
    logger.warn(`unable to call locator api : ${err.message}`);
    return assert.fail('Unable to call locator api');
  }
};

const compareMessage = (response, expected) => {
  assert.deepStrictEqual(response.text, expected);
};

const compareStatus = (response, expected) => {
  assert.deepStrictEqual(response.status, expected);
};

module.exports = {
  callLocatorApi,
  compareMessage,
  compareStatus,
};
