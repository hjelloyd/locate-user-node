const fs = require('fs');
const path = require('path');
const assert = require('assert');
const config = require('../../../../src/config').getConfig();
const { createJsonFromTable } = require('./utils/data-transform-utils');

const { log } = console;

const saveCoordinatesToFile = async (table) => {
  try {
    const url = path.join(__dirname, `../../../../test/cucumber/${config.COORDINATES_FILEPATH}`);
    const coordinates = await createJsonFromTable(table);
    const obj = {};
    coordinates.forEach((item) => {
      obj[item.city.toUpperCase()] = { latitude: item.latitude, longitude: item.longitude };
    });
    await fs.writeFileSync(url, JSON.stringify(obj));
  } catch (err) {
    log(err.message);
    assert.fail('Unable to save coordinates to file');
  }
};

module.exports = {
  saveCoordinatesToFile,
};
