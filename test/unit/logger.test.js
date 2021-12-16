/* eslint-disable  no-undef, no-unused-expressions, no-underscore-dangle */
const chai = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

describe('logger', () => {
  describe('initialize', () => {
    describe('not production', () => {
      const stubAdd = sinon.stub();
      const fakeLogger = { add: stubAdd };
      const stubCreateLogger = sinon.stub().returns(fakeLogger);
      const fakeFormat = {
        json: sinon.stub().returns('json'),
        simple: sinon.stub().returns('simple'),
      };
      const stubConsole = sinon.stub().returns('console');
      const stubFile = sinon.stub().returns('file');
      const fakeTransports = { File: stubFile, Console: stubConsole };
      const fakeConfig = {
        LOGGING_LEVEL: 'debug',
        LOG_FILE_NAME: 'aFile.log',
        NODE_ENV: 'dev',
      };

      const logger = rewire('../../src/logger');
      logger.__set__('createLogger', stubCreateLogger);
      logger.__set__('format', fakeFormat);
      logger.__set__('transports', fakeTransports);
      logger.__set__('config', fakeConfig);

      it('should return the logger', async () => {
        expect(await logger.initialize()).to.eql(fakeLogger);
      });
      it('should call createLogger once', () => {
        expect(stubCreateLogger).to.be.calledOnce;
        const options = stubCreateLogger.args[0][0];
        expect(options.level).to.eql('debug');
        expect(options.format).to.eql('json');
        expect(options.defaultMeta).to.eql({ service: 'locate-user-node' });
        expect(options.transports.length).to.eql(1);
      });
      it('should call logger.add once', async () => {
        expect(stubAdd).to.be.calledOnce;
      });
      it('should call format.json once', async () => {
        expect(fakeFormat.json).to.be.calledOnce;
      });
      it('should call format.simple once', async () => {
        expect(fakeFormat.simple).to.be.calledOnce;
      });
    });
    describe('production', () => {
      const stubAdd = sinon.stub();
      const fakeLogger = { add: stubAdd };
      const stubCreateLogger = sinon.stub().returns(fakeLogger);
      const fakeFormat = {
        json: sinon.stub().returns('json'),
        simple: sinon.stub().returns('simple'),
      };
      const stubFile = sinon.stub().returns('file');
      const fakeTransports = { File: stubFile };
      const fakeConfig = {
        LOGGING_LEVEL: 'debug',
        LOG_FILE_NAME: 'aFile.log',
        NODE_ENV: 'production',
      };

      const logger = rewire('../../src/logger');
      logger.__set__('createLogger', stubCreateLogger);
      logger.__set__('format', fakeFormat);
      logger.__set__('transports', fakeTransports);
      logger.__set__('config', fakeConfig);

      it('should return the logger', async () => {
        expect(await logger.initialize()).to.eql(fakeLogger);
      });
      it('should not call logger.add once', async () => {
        expect(stubAdd).to.not.be.called;
      });
      it('should not call format.simple once', async () => {
        expect(fakeFormat.simple).to.not.be.called;
      });
    });
  });
  describe('getLogger', () => {
    describe('exists', () => {
      const fakeLogger = 'fakeLogger';
      const stubInitialize = sinon.stub().returns(fakeLogger);
      const logger = rewire('../../src/logger');
      logger.__set__('logger', fakeLogger);
      logger.__set__('initialize', stubInitialize);
      it('should return the logger', async () => {
        expect(await logger.getLogger()).to.eql(fakeLogger);
      });
      it('should not call initialize', () => {
        expect(stubInitialize).to.not.be.called;
      });
    });
    describe('does not exist', () => {
      const fakeLogger = 'fakeLogger';
      const stubInitialize = sinon.stub().returns(fakeLogger);
      const logger = rewire('../../src/logger');
      logger.__set__('logger', undefined);
      logger.__set__('initialize', stubInitialize);
      it('should return the logger', async () => {
        expect(await logger.getLogger()).to.eql(fakeLogger);
      });
      it('should call initialize', () => {
        expect(stubInitialize).to.be.calledOnce;
      });
    });
  });
});
