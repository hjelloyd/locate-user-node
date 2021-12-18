const joi = require('joi');
const logger = require('../logger').getLogger();
const { getVicinityUsers, getCityUsers } = require('../utils/find-users');

const coordinates = {
  London: { latitude: 51.509865, longitude: -0.118092 },
  Blackpool: { latitude: 53.814178, longitude: -3.053540 },
  Madrid: { latitude: 40.416775, longitude: -3.703790 },
  Glasgow: { latitude: 55.864239, longitude: -4.251806 },
};

const validateParams = (params) => {
  const schema = joi.object({
    city: joi.string()
      .pattern(/^([a-z]|[A-Z])+$/, 'letters')
      .custom((str) => str.charAt(0).toUpperCase() + str.substr(1).toLowerCase(), 'title')
      .required(),
    distance: joi.number().min(0).required(),
  });
  return schema.validate(params, { stripUnknown: true, abortEarly: false });
};

const locateUsers = async (req, res) => {
  try {
    logger.info('Received request to get users');
    const validParams = validateParams(req.params);
    if (validParams.error) {
      logger.info(`Invalid parameters: ${validParams.error.message}`);
      return res.status(400).send(validParams.error.message);
    }
    const cityUsers = await getCityUsers(validParams.value.city);
    if (!coordinates[validParams.value.city]) {
      logger.info('Returning only users that have a home city');
      return res.status(206).send(cityUsers);
    }
    const coords = coordinates[validParams.value.city];
    const vicinityUsers = await getVicinityUsers(coords, validParams.value.distance);
    return res.status(200).send(cityUsers.concat(vicinityUsers));
  } catch (err) {
    logger.error(err.message);
    return res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  validateParams,
  locateUsers,
};
