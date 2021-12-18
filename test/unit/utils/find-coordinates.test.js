/* eslint-disable  no-undef, no-unused-expressions, no-underscore-dangle */
const chai = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

describe('find-coordinates', () => {
  describe('getCoordinates', () => {
    describe('city exists and coordinates are returned', () => {
      const fakeInput = { CITY: 'coordinates' };
      const fakeJson = JSON.stringify(fakeInput);
      const fakeFilePath = 'aFilePath';
      const fakeFs = {
        readFileSync: sinon.stub().returns(fakeJson),
      };
      const fakeLogger = { error: sinon.stub() };
      const findCoords = rewire('../../../src/utils/find-coordinates');
      findCoords.__set__('fs', fakeFs);
      findCoords.__set__('logger', fakeLogger);
      findCoords.__set__('url', fakeFilePath);
      it('should return coordinates', async () => {
        const result = await findCoords.getCoordinates('city');
        expect(result).to.eql('coordinates');
      });
      it('should call readFileSync once', async () => {
        expect(fakeFs.readFileSync).to.be.calledOnceWithExactly(fakeFilePath);
      });
      it('should not log errors', async () => {
        expect(await fakeLogger.error).to.not.be.called;
      });
    });
    describe('city does not exists and undefined returned', () => {
      const fakeInput = [{ CITY: 'coordinates' }];
      const fakeJson = JSON.stringify(fakeInput);
      const fakeFilePath = 'aFilePath';
      const fakeFs = {
        readFileSync: sinon.stub().returns(fakeJson),
      };
      const fakeLogger = { error: sinon.stub() };
      const findCoords = rewire('../../../src/utils/find-coordinates');
      findCoords.__set__('fs', fakeFs);
      findCoords.__set__('logger', fakeLogger);
      findCoords.__set__('url', fakeFilePath);
      it('should return coordinates', async () => {
        const result = await findCoords.getCoordinates('nocity');
        expect(result).to.eql(undefined);
      });
      it('should not log errors', async () => {
        expect(await fakeLogger.error).to.not.be.called;
      });
    });
    describe('undefined returned due to error', () => {
      const fakeError = new Error('can not write to disk');
      const fakeFilePath = 'aFilePath';
      const fakeFs = {
        readFileSync: sinon.stub().throws(fakeError),
      };
      const fakeLogger = { error: sinon.stub() };
      const findCoords = rewire('../../../src/utils/find-coordinates');
      findCoords.__set__('fs', fakeFs);
      findCoords.__set__('logger', fakeLogger);
      findCoords.__set__('url', fakeFilePath);
      it('should return undefined', async () => {
        const result = await findCoords.getCoordinates('city');
        expect(result).to.eql(undefined);
      });
      it('should call readFileSync once', async () => {
        expect(fakeFs.readFileSync).to.be.calledOnceWithExactly(fakeFilePath);
      });
      it('should log errors', async () => {
        expect(await fakeLogger.error).to.be.calledOnceWithExactly(
          `Unable to load coordinates from file: ${fakeError.message}`,
        );
      });
    });
  });
});
