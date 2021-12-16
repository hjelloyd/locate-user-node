require('dotenv').config();
const {
  Given, When, Then,
} = require('@cucumber/cucumber');
const logger = require('../../../../src/logger').getLogger();
const { callLocatorApi, compareStatus, compareMessage } = require('../steps/api-steps');

let response;
/* eslint no-unused-vars:0 */
Given('the cities have the coordinates below', async (dataTable) => {
  logger.info('Not Implemented Yet');
});
When('the api is called with city: {string} and distance: {string}', async (city, distance) => {
  await callLocatorApi(city, distance);
});
Then('the response status returned is {int}', async (status) => {
  await compareStatus(response, status);
});
Then('the message returned is {string}', async (message) => {
  await compareMessage(response, message);
});
