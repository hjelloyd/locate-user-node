/* eslint-disable  no-undef, no-unused-expressions, no-underscore-dangle */
const rewire = require('rewire');
const chai = require('chai');
const sinon = require('sinon');

const { expect } = chai;
describe('locator', () => {
  describe('validateParams', () => {
    const { validateParams } = rewire('../../../src/controller/locator');
    it('will not return errors for valid parameters and strip extras', () => {
      const params = { city: 'London', distance: 10, unknown: true };
      const result = validateParams(params);
      expect(result).to.not.ownProperty('error');
      expect(result.value).to.eql({ city: 'London', distance: 10 });
    });
    it('will convert city to title case and distance to a number', () => {
      const params = { city: 'london', distance: '10' };
      const result = validateParams(params);
      expect(result).to.not.ownProperty('error');
      expect(result.value).to.eql({ city: 'London', distance: 10 });
    });
    it('will error when params is empty', () => {
      const params = {};
      const result = validateParams(params);
      expect(result).to.ownProperty('error');
      expect(result.error.message).to.eql('"city" is required. "distance" is required');
    });
    it('will error when distance is less than 0', () => {
      const params = { city: 'london', distance: -1 };
      const result = validateParams(params);
      expect(result).to.ownProperty('error');
      expect(result.error.message).to.eql('"distance" must be greater than or equal to 0');
    });
    it('will error the city is invalid', () => {
      const params = { city: 'new york', distance: 0 };
      const result = validateParams(params);
      expect(result).to.ownProperty('error');
      expect(result.error.message).to.eql('"city" with value "new york" fails to match the letters pattern');
    });
  });
  describe('locateUsers', () => {
    describe('fails validation', () => {
      const stubSend = sinon.stub().returns('sent');
      const stubStatus = sinon.stub().returns({ send: stubSend });
      const fakeParams = { city: 'new york', distance: 0 };
      const fakeReq = { params: fakeParams };
      const fakeRes = { status: stubStatus };
      const stubValidateParams = sinon.stub().returns({ error: { message: 'fails validation' } });
      const fakeLogger = { info: sinon.stub(), error: sinon.stub() };

      const locator = rewire('../../../src/controller/locator');
      locator.__set__('validateParams', stubValidateParams);
      locator.__set__('getCityUsers', sinon.stub());
      locator.__set__('logger', fakeLogger);

      it('will return sent', async () => {
        expect(await locator.locateUsers(fakeReq, fakeRes)).to.eql('sent');
      });
      it('Will call validateParams once', () => {
        expect(stubValidateParams).to.be.calledOnceWith(fakeParams);
      });
      it('Will call status once', () => {
        expect(stubStatus).to.be.calledOnceWith(400);
      });
      it('Will call send once', () => {
        expect(stubSend).to.be.calledOnceWith('fails validation');
      });
      it('Will log information', () => {
        expect(fakeLogger.info).to.be.calledTwice;
        expect(fakeLogger.info.args[0][0]).to.eql('Received request to get users');
        expect(fakeLogger.info.args[1][0]).to.eql('Invalid parameters: fails validation');
      });
      it('Will not log errors', () => {
        expect(fakeLogger.error).to.not.be.called;
      });
    });
    describe('response is successful and coordinates exist', () => {
      const stubSend = sinon.stub().returns('sent');
      const stubStatus = sinon.stub().returns({ send: stubSend });
      const fakeParams = { city: 'London', distance: 5 };
      const fakeReq = { params: fakeParams };
      const fakeRes = { status: stubStatus };
      const stubValidateParams = sinon.stub().returns({ value: fakeParams });
      const stubGetCityUsers = sinon.stub().returns([{ id: 1 }]);
      const stubGetVicinityUsers = sinon.stub().returns([{ id: 2 }]);
      const fakeLogger = { info: sinon.stub(), error: sinon.stub() };

      const locator = rewire('../../../src/controller/locator');
      locator.__set__('validateParams', stubValidateParams);
      locator.__set__('getCityUsers', stubGetCityUsers);
      locator.__set__('getVicinityUsers', stubGetVicinityUsers);
      locator.__set__('logger', fakeLogger);

      it('will return sent', async () => {
        expect(await locator.locateUsers(fakeReq, fakeRes)).to.eql('sent');
      });
      it('Will call validateParams once', () => {
        expect(stubValidateParams).to.be.calledOnceWith(fakeParams);
      });
      it('Will call validateParams once', () => {
        expect(stubValidateParams).to.be.calledOnceWith(fakeParams);
      });
      it('Will call getCityUsers', () => {
        expect(stubGetCityUsers).to.be.calledOnceWith('London');
      });
      it('Will call getVicinityUsers', () => {
        const coords = { latitude: 51.509865, longitude: -0.118092 };
        expect(stubGetVicinityUsers).to.be.calledOnceWith(coords, 5);
      });
      it('Will call status once', () => {
        expect(stubStatus).to.be.calledOnceWith(200);
      });
      it('Will call send once', () => {
        expect(stubSend).to.be.calledOnceWith([{ id: 1 }, { id: 2 }]);
      });
      it('Will log information', () => {
        expect(fakeLogger.info).to.be.calledOnce;
        expect(fakeLogger.info.args[0][0]).to.eql('Received request to get users');
      });
      it('Will not log errors', () => {
        expect(fakeLogger.error).to.not.be.called;
      });
    });
    describe('response is successful and coordinates do not exist', () => {
      const stubSend = sinon.stub().returns('sent');
      const stubStatus = sinon.stub().returns({ send: stubSend });
      const fakeParams = { city: 'York', distance: 0 };
      const fakeReq = { params: fakeParams };
      const fakeRes = { status: stubStatus };
      const stubValidateParams = sinon.stub().returns({ value: fakeParams });
      const stubGetCityUsers = sinon.stub().returns([{ id: 1 }]);
      const fakeLogger = { info: sinon.stub(), error: sinon.stub() };

      const locator = rewire('../../../src/controller/locator');
      locator.__set__('validateParams', stubValidateParams);
      locator.__set__('getCityUsers', stubGetCityUsers);
      locator.__set__('logger', fakeLogger);

      it('will return sent', async () => {
        expect(await locator.locateUsers(fakeReq, fakeRes)).to.eql('sent');
      });
      it('Will call validateParams once', () => {
        expect(stubValidateParams).to.be.calledOnceWith(fakeParams);
      });
      it('Will call validateParams once', () => {
        expect(stubValidateParams).to.be.calledOnceWith(fakeParams);
      });
      it('Will call getCityUsers', () => {
        expect(stubGetCityUsers).to.be.calledOnceWith('York');
      });
      it('Will call status once', () => {
        expect(stubStatus).to.be.calledOnceWith(206);
      });
      it('Will call send once', () => {
        expect(stubSend).to.be.calledOnceWith([{ id: 1 }]);
      });
      it('Will log information', () => {
        expect(fakeLogger.info).to.be.calledTwice;
        expect(fakeLogger.info.args[0][0]).to.eql('Received request to get users');
        expect(fakeLogger.info.args[1][0]).to.eql('Returning only users that have a home city');
      });
      it('Will not log errors', () => {
        expect(fakeLogger.error).to.not.be.called;
      });
    });
    describe('error occurs', () => {
      const fakeError = new Error('unable to validate');
      const stubSend = sinon.stub().returns('sent');
      const stubStatus = sinon.stub().returns({ send: stubSend });
      const fakeParams = { city: 'new york', distance: 0 };
      const fakeReq = { params: fakeParams };
      const fakeRes = { status: stubStatus };
      const stubValidateParams = sinon.stub().throws(fakeError);
      const fakeLogger = { info: sinon.stub(), error: sinon.stub() };

      const locator = rewire('../../../src/controller/locator');
      locator.__set__('validateParams', stubValidateParams);
      locator.__set__('getCityUsers', sinon.stub());
      locator.__set__('logger', fakeLogger);

      it('will return sent', async () => {
        expect(await locator.locateUsers(fakeReq, fakeRes)).to.eql('sent');
      });
      it('Will call validateParams once', () => {
        expect(stubValidateParams).to.be.calledOnceWith(fakeParams);
      });
      it('Will call status once', () => {
        expect(stubStatus).to.be.calledOnceWith(500);
      });
      it('Will call send once', () => {
        expect(stubSend).to.be.calledOnceWith('Internal Server Error');
      });
      it('Will log information', () => {
        expect(fakeLogger.info).to.be.calledOnce;
        expect(fakeLogger.info.args[0][0]).to.eql('Received request to get users');
      });
      it('Will log errors', () => {
        expect(fakeLogger.error).to.be.calledOnceWith('unable to validate');
      });
    });
  });
});
