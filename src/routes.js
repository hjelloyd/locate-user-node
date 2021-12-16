const express = require('express');
const { locateUsers } = require('./controller/locator');
const { healthcheck } = require('./controller/healthcheck');

const setRoutes = () => {
  const app = express.Router();
  app.get('/healthcheck', healthcheck);
  app.get('/api/v1/city/:city/distance/:distance', locateUsers);
  return app;
};

module.exports = {
  setRoutes,
};
