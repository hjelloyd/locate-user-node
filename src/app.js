require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const http = require('http');
/*eslint no-undef:0*/
const config = require('./config')(process.env);
const logger = require('./logger').initialize(config)

module.exports = () => {
  const port = config.PORT;
  const app = express();
  app.use(helmet());

  const server = http.createServer(app);
  server.on('listening', () => logger.info(`Listening on port ${port}`));
  server.on('error', (err) => logger.error(`Unexpected error occurred: ${err.message}`));
  server.listen(port);
}


