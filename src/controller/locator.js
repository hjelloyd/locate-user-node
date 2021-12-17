const joi = require('joi');
const logger = require('../logger').getLogger();
const { getUsersByCity } = require('../utils/get-source-data');

const coordinates = {
  London: { lat: 51.509865, lon: -0.118092 },
  Blackpool: { lat: 53.814178, lon: -3.053540 },
  Madrid: { lat: 40.416775, lon: -3.703790 },
  Glasgow: { lat: 55.861753, lon: -4.252603 },
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
    const cityUsers = await getUsersByCity(validParams.value.city);
    const users = cityUsers.map((item) => ({ ...item, ...{ type: ['CITY'] } }));

    if (!coordinates[validParams.value.city]) {
      logger.info('Returning only users that have a home city');
      return res.status(206).send(users);
    }
    return res.status(200).send('ok');
  } catch (err) {
    logger.error(err.message);
    return res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  validateParams,
  locateUsers,
};
