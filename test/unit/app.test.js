/* eslint-disable  no-undef, no-unused-expressions, no-underscore-dangle */
const chai = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const asserttype = require('chai-asserttype');

const { expect } = chai;
chai.use(sinonChai);
chai.use(asserttype);

describe('app', () => {
  const stubAppUse = sinon.stub();
  const stubExpress = sinon.stub().returns({ use: stubAppUse });
  const stubServerOn = sinon.stub();
  const stubServerListen = sinon.stub();
  const fakeServer = {
    on: stubServerOn,
    listen: stubServerListen,
  };
  const stubHttpCreateServer = sinon.stub().returns(fakeServer);
  const fakeHttp = { createServer: stubHttpCreateServer };
  const stubHelmet = sinon.stub().returns('helmet');
  const fakeLogger = { info: sinon.stub(), error: sinon.stub() };
  const fakeConfig = { PORT: 3000 };
  const fakeRoutes = 'routes';
  const app = rewire('../../src/app');
  app.__set__('express', stubExpress);
  app.__set__('helmet', stubHelmet);
  app.__set__('http', fakeHttp);
  app.__set__('config', fakeConfig);
  app.__set__('logger', fakeLogger);
  app.__set__('routes', fakeRoutes);

  it('it should not error', async () => {
    expect(await app()).to.be.undefined;
  });
  it('will call express', () => {
    expect(stubExpress).to.have.callCount(1);
  });
  it('will call app.use', () => {
    expect(stubAppUse).to.have.callCount(2);
    expect(stubAppUse.getCall(0)).to.be.calledWith('helmet');
    expect(stubAppUse.getCall(1)).to.be.calledWith('/', fakeRoutes);
  });
  it('will call helmet', () => {
    expect(stubHelmet).have.callCount(1);
  });
  it('will call http.createServer', () => {
    expect(stubHttpCreateServer).to.have.callCount(1);
  });

  it('will call server.on', () => {
    expect(stubServerOn).to.have.callCount(2);
    expect(stubServerOn.args[0][0]).to.eql('listening');
    expect(stubServerOn.args[0][1]).to.be.function();
    expect(stubServerOn.args[1][0]).to.eql('error');
    expect(stubServerOn.args[1][1]).to.be.function();
  });
  it('can be forced to log listening on port', () => {
    stubServerOn.args[0][1]();
    expect(fakeLogger.info).to.be.calledOnceWith('Listening on port 3000');
  });
  it('can be forced to log error', () => {
    const fakeError = new Error('Something Bad Happened');
    stubServerOn.args[1][1](fakeError);
    expect(fakeLogger.error).to.be.calledOnceWith('Unexpected error occurred: Something Bad Happened');
  });
  it('will call server.listen', () => {
    expect(stubServerListen).to.have.callCount(1);
  });
  it('will call server.listen with ', () => {
    expect(stubServerListen.firstCall).to.have.been.calledWithExactly(3000);
  });
});
