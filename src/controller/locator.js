const joi = require('joi');
const logger = require('../logger').getLogger();
const { getVicinityUsers, getCityUsers, getUniqueUsers } = require('../utils/find-users');
const { getCoordinates } = require('../utils/find-coordinates');

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
    const coords = await getCoordinates(validParams.value.city);

    const cityUsers = await getCityUsers(validParams.value.city);
    logger.info(`Found ${cityUsers.length} city users`);
    if (!coords) {
      logger.info('Returning only users that have a home city');
      return res.status(206).send(cityUsers);
    }

    const vicinityUsers = await getVicinityUsers(coords, validParams.value.distance);
    logger.info(`Found ${vicinityUsers.length} vicinity users`);

    const uniqueUsers = await getUniqueUsers(cityUsers, vicinityUsers);
    logger.info(`Found ${uniqueUsers.length} unique users`);

    return res.status(200).send(uniqueUsers);
  } catch (err) {
    logger.error(err.message);
    return res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  validateParams,
  locateUsers,
};
