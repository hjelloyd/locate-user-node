/* eslint-disable  no-undef, no-unused-expressions, no-underscore-dangle */
const chai = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

describe('find-users', () => {
  describe('inVicinity', () => {
    const fakeCityCoords = 'cityCoords';
    const fakeUser = { latitude: 'lat', longitude: 'lon' };
    const stubGetDistance = sinon.stub().returns(10000);
    const findUsers = rewire('../../../src/utils/find-users.js');
    findUsers.__set__('getDistance', stubGetDistance);
    it('should return true for a max distance of 10 miles', () => {
      expect(findUsers.inVicinity(fakeCityCoords, fakeUser, 10)).to.eql(true);
    });
    it('should return true for a max distance of 5 miles', () => {
      expect(findUsers.inVicinity(fakeCityCoords, fakeUser, 5)).to.eql(false);
    });
    it('should return true for a max distance of 6.21371 miles', () => {
      expect(findUsers.inVicinity(fakeCityCoords, fakeUser, 6.21371)).to.eql(true);
    });
    it('should call getDistance', () => {
      expect(stubGetDistance.getCall(0)).to.be.calledWith(fakeCityCoords, { latitude: 'lat', longitude: 'lon' }, 0.01);
    });
  });
  describe('mapUsers', () => {
    const { mapUsers } = rewire('../../../src/utils/find-users.js');
    it('should remove extra fields', () => {
      const dataIn = {
        id: 4,
        title: 'MRS',
      };
      expect(mapUsers(dataIn, 'TYPE')).to.eql({ id: 4, type: ['TYPE'] });
    });
    it('should convert values', () => {
      const dataIn = {
        id: '4',
        latitude: '105.1',
        longitude: '55.0',
      };
      const expData = {
        id: 4,
        latitude: 105.1,
        longitude: 55.0,
        type: ['TYPE'],
      };
      expect(mapUsers(dataIn, 'TYPE')).to.eql(expData);
    });
  });
  describe('getVicinityUsers', () => {
    const fakeCoords = 'cityCoords';
    const fakeData = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const stubInVicinity = sinon.stub().returns(true);
    const stubMapUsers = sinon.stub().returnsArg(0);
    stubInVicinity.onCall(0).returns(false);
    const stubGetAllUsers = sinon.stub().returns(fakeData);
    const findUsers = rewire('../../../src/utils/find-users.js');
    findUsers.__set__('inVicinity', stubInVicinity);
    findUsers.__set__('mapUsers', stubMapUsers);
    findUsers.__set__('getAllUsers', stubGetAllUsers);
    it('should return data', async () => {
      const expectedData = [{ id: 2 }, { id: 3 }];
      expect(await findUsers.getVicinityUsers(fakeCoords, 10)).to.eql(expectedData);
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
    it('It should call mapUsers twice times', () => {
      expect(stubMapUsers).to.be.calledTwice;
    });
  });
  describe('getCityUsers', () => {
    const fakeCity = 'City';
    const fakeData = [{ id: 2 }, { id: 3 }];
    const stubGetUsersByCity = sinon.stub().returns(fakeData);
    const stubMapUsers = sinon.stub().returnsArg(0);
    const findUsers = rewire('../../../src/utils/find-users.js');
    findUsers.__set__('getUsersByCity', stubGetUsersByCity);
    findUsers.__set__('mapUsers', stubMapUsers);
    it('should return data', async () => {
      const expectedData = [{ id: 2 }, { id: 3 }];
      expect(await findUsers.getCityUsers(fakeCity)).to.eql(expectedData);
    });
    it('should call getUsersByCity once', () => {
      expect(stubGetUsersByCity).to.be.calledOnce;
    });
    it('It should call mapUsers twice times', () => {
      expect(stubMapUsers).to.be.calledTwice;
    });
  });
});