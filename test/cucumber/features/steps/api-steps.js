const axios = require('axios');
const assert = require('assert');
const config = require('../../../../src/config').getConfig();
const { createJsonFromTable, mapDataToMatchTableHeaders } = require('./utils/data-transform-utils');

const { log } = console;

const callLocatorApi = async (city, distance) => {
  try {
    const response = await axios.get(`http://localhost:${config.PORT}/api/v1/city/${city}/distance/${distance}`);
    return response;
  } catch (err) {
    if (err.response) {
      log('Received error response');
      return err.response;
    }
    log(`unable to call locator api : ${err.message}`);
    return assert.fail('Unable to call locator api');
  }
};

const compareMessage = (response, expected) => {
  assert.deepStrictEqual(response.data, expected);
};

const compareStatus = (response, expected) => {
  assert.deepStrictEqual(response.status, expected);
};

const compareUsers = async (response, expectedTable) => {
  const expectedJson = await createJsonFromTable(expectedTable);
  const mappedResponse = await mapDataToMatchTableHeaders(expectedTable[0], response.data);
  assert.deepStrictEqual(JSON.stringify(mappedResponse), JSON.stringify(expectedJson));
};

module.exports = {
  callLocatorApi,
  compareMessage,
  compareStatus,
  compareUsers,
};
