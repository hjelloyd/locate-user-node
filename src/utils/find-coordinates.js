const fs = require('fs');
const path = require('path');
const config = require('../config').getConfig();
const logger = require('../logger').getLogger();

const url = path.join(__dirname, config.COORDINATES_FILEPATH);

const getCoordinates = async (city) => {
  try {
    const coords = JSON.parse(await fs.readFileSync(url));
    return coords[city.toUpperCase()];
  } catch (err) {
    logger.error(`Unable to load coordinates from file: ${err.message}`);
    return undefined;
  }
};
module.exports = {
  getCoordinates,
};
