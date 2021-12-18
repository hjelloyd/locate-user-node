/* eslint-disable  no-undef, no-unused-expressions, no-underscore-dangle */
const chai = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

describe('config', () => {
  describe('initialize', () => {
    describe('no provided settings', () => {
      const config = rewire('../../src/config');
      const fakeSettings = {};
      const defaultSettings = {
        PORT: 3000,
        LOG_FILE_NAME: 'logOutput.log',
        LOGGING_LEVEL: 'debug',
        NODE_ENV: 'development',
        DATA_SOURCE_BASE_URL: 'https://bpdts-test-app.herokuapp.com',
        REQUEST_TIMEOUT: 30000,
        COORDINATES_FILEPATH: '../resources/coordinates.json',
        NODE_TLS_REJECT_UNAUTHORIZED: 0,
      };
      it('should return the default settings', () => {
        expect(config.initialize(fakeSettings)).to.eql(defaultSettings);
      });
    });
    describe('provided settings', () => {
      const config = rewire('../../src/config');
      const fakeSettings = { PORT: 5000, EXTRA: true };
      it('should return the default settings', () => {
        const settings = config.initialize(fakeSettings);
        expect(settings.PORT).to.eql(5000);
        expect(settings.EXTRA).to.eql(true);
        expect(settings.LOG_FILE_NAME).to.eql('logOutput.log');
      });
    });
  });
  describe('getConfig', () => {
    describe('exists', () => {
      const fakeConfig = 'fakeConfig';
      const stubInitialize = sinon.stub().returns(fakeConfig);
      const config = rewire('../../src/config');
      config.__set__('config', fakeConfig);
      config.__set__('initialize', stubInitialize);
      it('should return the config', async () => {
        expect(await config.getConfig()).to.eql(fakeConfig);
      });
      it('should not call initialize', () => {
        expect(stubInitialize).to.not.be.called;
      });
    });
    describe('does not exist', () => {
      const fakeConfig = 'fakeConfig';
      const stubInitialize = sinon.stub().returns(fakeConfig);
      const config = rewire('../../src/config');
      config.__set__('config', undefined);
      config.__set__('initialize', stubInitialize);
      it('should return the config', async () => {
        expect(await config.getConfig()).to.eql(fakeConfig);
      });
      it('should call initialize', () => {
        expect(stubInitialize).to.be.calledOnce;
      });
    });
  });
});
