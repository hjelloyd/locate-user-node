/* eslint-disable  no-undef, no-unused-expressions, no-underscore-dangle */
const chai = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

describe('find-vicinity-users', () => {
  describe('inVicinity', () => {
    const fakeCityCoords = 'cityCoords';
    const fakeUser = { latitude: 'lat', longitude: 'lon' };
    const stubGetDistance = sinon.stub().returns(10000);
    const findVicinityUsers = rewire('../../../src/utils/find-vicinity-users.js');
    findVicinityUsers.__set__('getDistance', stubGetDistance);
    it('should return true for a max distance of 10 miles', () => {
      expect(findVicinityUsers.inVicinity(fakeCityCoords, fakeUser, 10)).to.eql(true);
    });
    it('should return true for a max distance of 5 miles', () => {
      expect(findVicinityUsers.inVicinity(fakeCityCoords, fakeUser, 5)).to.eql(false);
    });
    it('should return true for a max distance of 6.21371 miles', () => {
      expect(findVicinityUsers.inVicinity(fakeCityCoords, fakeUser, 6.21371)).to.eql(true);
    });
    it('should call getDistance', () => {
      expect(stubGetDistance.getCall(0)).to.be.calledWith(fakeCityCoords, { latitude: 'lat', longitude: 'lon' }, 0.01);
    });
  });
  describe('getVicinityUsers', () => {
    const fakeCoords = 'cityCoords';
    const fakeData = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const stubInVicinity = sinon.stub().returns(true);
    stubInVicinity.onCall(0).returns(false);
    const stubGetAllUsers = sinon.stub().returns(fakeData);
    const findVicinityUsers = rewire('../../../src/utils/find-vicinity-users.js');
    findVicinityUsers.__set__('inVicinity', stubInVicinity);
    findVicinityUsers.__set__('getAllUsers', stubGetAllUsers);
    it('should return data', async () => {
      const expectedData = [{ id: 2, type: ['VICINITY'] }, { id: 3, type: ['VICINITY'] }];
      expect(await findVicinityUsers.getVicinityUsers(fakeCoords, 10)).to.eql(expectedData);
    });
    it('should call getAllUsers once', () => {
      expect(stubGetAllUsers).to.be.calledOnce;
    });
    it('It should call inVicinity three times', () => {
      expect(stubInVicinity).to.be.calledThrice;
      expect(stubInVicinity.getCall(0)).to.be.calledWith(fakeCoords, { id: 1 }, 10);
      expect(stubInVicinity.getCall(1)).to.be.calledWith(fakeCoords, { id: 2 }, 10);
      expect(stubInVicinity.getCall(2)).to.be.calledWith(fakeCoords, { id: 3 }, 10);
    });
  });
});
