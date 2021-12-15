/* eslint-disable  no-undef */
const chai = require('chai');
const rewire = require('rewire');

const { expect } = chai;

describe('config', () => {
  describe('no provided settings', () => {
    const config = rewire('../../src/config');
    const fakeSettings = {};
    const defaultSettings = {
      PORT: 3000,
      LOG_FILE_NAME: 'logOutput.log',
      LOGGING_LEVEL: 'debug',
      NODE_ENV: 'development',
    };
    it('should return the default settings', () => {
      expect(config(fakeSettings)).to.eql(defaultSettings);
    });
  });
  describe('provided settings', () => {
    const config = rewire('../../src/config');
    const fakeSettings = { PORT: 5000, EXTRA: true };
    const expectedSettings = {
      PORT: 5000,
      LOG_FILE_NAME: 'logOutput.log',
      LOGGING_LEVEL: 'debug',
      NODE_ENV: 'development',
      EXTRA: true
    };
    it('should return the default settings', () => {
      expect(config(fakeSettings)).to.eql(expectedSettings);
    });
  });
});
