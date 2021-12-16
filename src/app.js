require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const config = require('./config').getConfig();
const logger = require('./logger').getLogger();
const routes = require('./routes').setRoutes();

module.exports = () => {
  const port = config.PORT;
  const app = express();
  app.use(helmet());
  app.use('/', routes);

  const server = http.createServer(app);
  server.on('listening', () => logger.info(`Listening on port ${port}`));
  server.on(
    'error',
    (err) => logger.error(`Unexpected error occurred: ${err.message}`),
  );
  server.listen(port);
};
