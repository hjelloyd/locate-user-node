/* eslint-disable  no-undef, no-unused-expressions, no-underscore-dangle */
const chai = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

describe('routes', () => {
  describe('setRoutes', () => {
    const fakeGet = sinon.stub();
    const fakeApp = { get: fakeGet };
    const stubRouter = sinon.stub().returns(fakeApp);
    const fakeExpress = { Router: stubRouter };
    const fakeLocateUsers = 'locateUsers';
    const fakeHealthcheck = 'healthcheck';

    const routes = rewire('../../src/routes');
    routes.__set__('express', fakeExpress);
    routes.__set__('healthcheck', fakeHealthcheck);
    routes.__set__('locateUsers', fakeLocateUsers);

    it('should return the app', async () => {
      expect(await routes.setRoutes()).to.eql(fakeApp);
    });
    it('should call express router once', () => {
      expect(stubRouter).to.be.calledOnce;
    });
    it('should set up new get routes', async () => {
      expect(fakeGet).to.have.callCount(2);
      expect(fakeGet.getCall(0)).to.be.calledWith('/healthcheck', 'healthcheck');
      expect(fakeGet.getCall(1)).to.be.calledWith('/api/v1/city/:city/distance/:distance', 'locateUsers');
    });
  });
});
