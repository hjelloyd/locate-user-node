const joi = require('joi');
const logger = require('../logger').getLogger();

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

const locateUsers = (req, res) => {
  try {
    logger.info('Received request to get users');
    const validParams = validateParams(req.params);
    if (validParams.error) {
      logger.info(`Invalid parameters: ${validParams.error.message}`);
      return res.status(400).send(validParams.error.message);
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
