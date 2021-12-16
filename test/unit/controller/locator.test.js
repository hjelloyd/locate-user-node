/* eslint-disable no-undef */
const rewire = require('rewire');
const chai = require('chai');
const sinon = require('sinon');

const { expect } = chai;

describe('locator', () => {
  describe('response is successful', () => {
    const stubSend = sinon.stub().returns(true);
    const stubStatus = sinon.stub().returns({ send: stubSend });
    const fakeReq = { body: [] };
    const fakeRes = { status: stubStatus };

    const locator = rewire('../../../src/controller/locator');

    it('will return not return anything', async () => {
      await expect(locator.locateUsers(fakeReq, fakeRes)).to.be.undefined;
    });
    it('Will Call status once', () => {
      expect(stubStatus).to.be.calledOnceWith(200);
    });
    it('Will Call send once', () => {
      expect(stubSend).to.be.calledOnceWith('ok');
    });
  });
});
