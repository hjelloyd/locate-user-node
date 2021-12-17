/* eslint-disable  no-undef, no-unused-expressions, no-underscore-dangle */
const chai = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

describe('get-source-data', () => {
  describe('retryAttempt', () => {
    const fakeError = { message: 'connection error' };
    const fakeRetryAxios = {
      getConfig: sinon.stub().returns({ currentRetryAttempt: 1 }),
    };
    const fakeLogger = { info: sinon.stub() };

    const getSourceData = rewire('../../../src/utils/get-source-data.js');
    getSourceData.__set__('retryAxios', fakeRetryAxios);
    getSourceData.__set__('logger', fakeLogger);
    it('should not return anything', async () => {
      expect(await getSourceData.retryAttempt(fakeError)).to.be.undefined;
    });
    it('should call get config with error ', () => {
      expect(fakeRetryAxios.getConfig).to.be.calledOnceWithExactly(fakeError);
    });
    it('should log the retry attempt info', () => {
      expect(fakeLogger.info).to.be.calledOnceWithExactly('Retry attempt #1 Previous Attempt Failed: connection error');
    });
  });
  describe('retryConfig', () => {
    const getSourceData = rewire('../../../src/utils/get-source-data.js');
    const retryConfig = getSourceData.__get__('retryConfig');
    const axios = getSourceData.__get__('axios');
    const retryAttempt = getSourceData.__get__('retryAttempt');
    it('should have properties as expected', () => {
      expect(retryConfig.retry).to.eql(2);
      expect(retryConfig.noResponseRetries).to.eql(2);
      expect(retryConfig.instance).to.eql(axios);
      expect(retryConfig.httpMethodsToRetry).to.eql(['GET']);
      expect(retryConfig.onRetryAttempt).to.eql(retryAttempt);
    });
  });
  describe('getUsersByCity', () => {
    describe('successful', () => {
      const fakeData = ['record1', 'record2'];
      const fakeAxios = { get: sinon.stub().returns({ data: fakeData }) };
      const fakeRetryConfig = 'Retry Config';
      const fakeConfig = {
        DATA_SOURCE_BASE_URL: 'www.test.com',
        REQUEST_TIMEOUT: 30,
      };
      const fakeLogger = { info: sinon.stub(), error: sinon.stub() };
      const getSourceData = rewire('../../../src/utils/get-source-data.js');
      getSourceData.__set__('retryConfig', fakeRetryConfig);
      getSourceData.__set__('axios', fakeAxios);
      getSourceData.__set__('config', fakeConfig);
      getSourceData.__set__('logger', fakeLogger);
      it('should return the data', async () => {
        expect(await getSourceData.getUsersByCity('blackpool')).to.eql(fakeData);
      });
      it('should call axios.get once', () => {
        expect(fakeAxios.get).to.be.calledOnce;
        const options = {
          timeout: 30,
          raxConfig: fakeRetryConfig,
        };
        expect(fakeAxios.get.args[0][0]).to.eql('www.test.com/city/blackpool/users');
        expect(fakeAxios.get.args[0][1]).to.eql(options);
      });
      it('should log information', () => {
        expect(fakeLogger.info).to.be.calledOnceWith('Getting users for city: blackpool');
      });
      it('should not log errors', () => {
        expect(fakeLogger.error).to.not.be.called;
      });
    });
    describe('errors', () => {
      const fakeError = new Error('unable to connect');
      const fakeAxios = { get: sinon.stub().throws(fakeError) };
      const fakeRetryConfig = 'Retry Config';
      const fakeConfig = {
        DATA_SOURCE_BASE_URL: 'www.test.com',
        REQUEST_TIMEOUT: 30,
      };
      const fakeLogger = { info: sinon.stub(), error: sinon.stub() };
      const getSourceData = rewire('../../../src/utils/get-source-data.js');
      getSourceData.__set__('retryConfig', fakeRetryConfig);
      getSourceData.__set__('axios', fakeAxios);
      getSourceData.__set__('config', fakeConfig);
      getSourceData.__set__('logger', fakeLogger);
      it('should throw an error', async () => {
        try {
          await getSourceData.getUsersByCity('blackpool');
        } catch (err) {
          expect(err).to.eql(fakeError);
        }
      });
      it('should call axios.get once', () => {
        expect(fakeAxios.get).to.be.calledOnce;
        expect(fakeAxios.get.args[0][0]).to.eql('www.test.com/city/blackpool/users');
      });
      it('should log information', () => {
        expect(fakeLogger.info).to.be.calledOnceWith('Getting users for city: blackpool');
      });
      it('should log errors', () => {
        expect(fakeLogger.error).to.be.calledOnceWith('Failed to retrieve users for city: blackpool - unable to connect');
      });
    });
  });
  describe('getAllUsers', () => {
    describe('successful', () => {
      const fakeData = ['record1', 'record2'];
      const fakeAxios = { get: sinon.stub().returns({ data: fakeData }) };
      const fakeRetryConfig = 'Retry Config';
      const fakeConfig = {
        DATA_SOURCE_BASE_URL: 'www.test.com',
        REQUEST_TIMEOUT: 30,
      };
      const fakeLogger = { info: sinon.stub(), error: sinon.stub() };
      const getSourceData = rewire('../../../src/utils/get-source-data.js');
      getSourceData.__set__('retryConfig', fakeRetryConfig);
      getSourceData.__set__('axios', fakeAxios);
      getSourceData.__set__('config', fakeConfig);
      getSourceData.__set__('logger', fakeLogger);
      it('should return the data', async () => {
        expect(await getSourceData.getAllUsers()).to.eql(fakeData);
      });
      it('should call axios.get once', () => {
        expect(fakeAxios.get).to.be.calledOnce;
        const options = {
          timeout: 30,
          raxConfig: fakeRetryConfig,
        };
        expect(fakeAxios.get.args[0][0]).to.eql('www.test.com/users');
        expect(fakeAxios.get.args[0][1]).to.eql(options);
      });
      it('should log information', () => {
        expect(fakeLogger.info).to.be.calledOnceWith('Getting all users');
      });
      it('should not log errors', () => {
        expect(fakeLogger.error).to.not.be.called;
      });
    });
    describe('errors', () => {
      const fakeError = new Error('unable to connect');
      const fakeAxios = { get: sinon.stub().throws(fakeError) };
      const fakeRetryConfig = 'Retry Config';
      const fakeConfig = {
        DATA_SOURCE_BASE_URL: 'www.test.com',
        REQUEST_TIMEOUT: 30,
      };
      const fakeLogger = { info: sinon.stub(), error: sinon.stub() };
      const getSourceData = rewire('../../../src/utils/get-source-data.js');
      getSourceData.__set__('retryConfig', fakeRetryConfig);
      getSourceData.__set__('axios', fakeAxios);
      getSourceData.__set__('config', fakeConfig);
      getSourceData.__set__('logger', fakeLogger);
      it('should throw an error', async () => {
        try {
          await getSourceData.getAllUsers();
        } catch (err) {
          expect(err).to.eql(fakeError);
        }
      });
      it('should call axios.get once', () => {
        expect(fakeAxios.get).to.be.calledOnce;
        expect(fakeAxios.get.args[0][0]).to.eql('www.test.com/users');
      });
      it('should log information', () => {
        expect(fakeLogger.info).to.be.calledOnceWith('Getting all users');
      });
      it('should log errors', () => {
        expect(fakeLogger.error).to.be.calledOnceWith('Failed to retrieve all users - unable to connect');
      });
    });
  });
});
