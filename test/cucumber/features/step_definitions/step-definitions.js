require('dotenv').config();
const {
  Given, When, Then,
} = require('@cucumber/cucumber');
const {
  callLocatorApi,
  compareStatus,
  compareMessage,
  compareUsers,
} = require('../steps/api-steps');
const { saveCoordinatesToFile } = require('../steps/fs-steps');

let response;

Given('the cities have the coordinates below', async (dataTable) => {
  await saveCoordinatesToFile(dataTable.rawTable);
});
When('the api is called with city: {string} and distance: {string}', async (city, distance) => {
  response = await callLocatorApi(city, distance);
});
Then('the response status returned is {int}', async (status) => {
  await compareStatus(response, status);
});
Then('the message returned is {string}', async (message) => {
  await compareMessage(response, message);
});
Then('the users are returned as below', async (dataTable) => {
  await compareUsers(response, dataTable.rawTable);
});
