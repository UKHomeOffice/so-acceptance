'use strict';

const proxyquire = require('proxyquire');
const FAKE_ID = 'fakeId';
const FAKE_KEY = 'fake-key';

describe('SessionHelper', () => {
  let mockSession;
  let SessionHelper;
  let sessionHelper;
  let mockData = {
    mockData: ''
  };

  beforeEach(() => {
    mockSession = {
      get: sinon.stub().callsArgWith(1, null, mockData),
      set: sinon.stub().callsArgWith(2, null, mockData)
    };

    SessionHelper = proxyquire('../../../helpers/session', {
      '../mock-session': mockSession
    });
    sessionHelper = new SessionHelper();
  });

  it('has a _getSession method', () => {
    sessionHelper.should.have.property('_getSession')
      .and.be.a('function');
  });

  it('has a getSession method', () => {
    sessionHelper.should.have.property('getSession')
      .and.be.a('function');
  });

  it('has a setSessionData method', () => {
    sessionHelper.should.have.property('setSessionData')
      .and.be.a('function');
  });

  it('has a setSessionSteps method', () => {
    sessionHelper.should.have.property('setSessionSteps')
      .and.be.a('function');
  });

  it('has a _saveSession method', () => {
    sessionHelper.should.have.property('_saveSession')
      .and.be.a('function');
  });

  describe('Private methods', () => {
    describe('_getSession', () => {
      it('calls session.get with the sessionId \'fakeId\'', done => {
        sessionHelper._getSession()
          .then(() => {
            mockSession.get.should.have.been.calledOnce
              .and.calledWith(FAKE_ID);
            done();
          });
      });

      it('resolves with sessionData', done => {
        sessionHelper._getSession()
          .then(data => {
            data.should.be.eql(mockData);
            done();
          });
      });
    });

    describe('_saveSession', () => {
      it('calls session.save with the sessionId \'fakeId\'', done => {
        sessionHelper._saveSession(FAKE_KEY, mockData)
          .then(() => {
            mockSession.set.should.have.been.calledOnce.
              and.calledWith(FAKE_ID);
            done();
          });
      });

      it('calls session.save with merged session object', done => {
        sessionHelper._saveSession(FAKE_KEY, {key: 'fakeKey'})
          .then(() => {
            mockSession.set.args[0][1].should.be.eql({
              mockData: '',
              'hmpo-wizard-fake-key': {
                key: 'fakeKey'
              }
            });
            done();
          });
      });
    });
  });

  describe('Public methods', () => {

    describe('getSession', () => {
      beforeEach(() => {
        sinon.stub(SessionHelper.prototype, '_getSession')
          .returns(new Promise(resolve => {
            resolve({
              'hmpo-wizard-fake-key': mockData
            });
          }));
      });

      afterEach(() => {
        SessionHelper.prototype._getSession.restore();
      });

      it('calls sessionHelper._getSession and resolves with the key provided', done => {
        sessionHelper.getSession(FAKE_KEY)
          .then(data => {
            data.should.be.eql(mockData);
            done();
          });
      });

      it('calls sessionHelper._getSession and resolves with an empty object if key not found', done => {
        sessionHelper.getSession('nonsense-key')
          .then(data => {
            data.should.be.eql({});
            done();
          });
      });
    });

    describe('setSessionData', () => {
      beforeEach(() => {
        sinon.stub(SessionHelper.prototype, 'getSession')
          .returns(new Promise(resolve => resolve(mockData)));
        sinon.stub(SessionHelper.prototype, '_saveSession')
          .returns(new Promise(resolve => resolve()));
      });

      afterEach(() => {
        SessionHelper.prototype.getSession.restore();
        SessionHelper.prototype._saveSession.restore();
      });

      it('calls getSession with the passed key', done => {
        sessionHelper.setSessionData(FAKE_KEY, {some: 'data'})
          .then(() => {
            SessionHelper.prototype.getSession.should.have.been.calledWith(FAKE_KEY);
            done();
          });
      });

      it('calls _saveSession with the passed key and merged data', done => {
        sessionHelper.setSessionData(FAKE_KEY, {some: 'data'})
          .then(() => {
            SessionHelper.prototype._saveSession.should.have.been.calledWith(FAKE_KEY);
            SessionHelper.prototype._saveSession.args[0][1].should.be.eql({
              mockData: '',
              some: 'data'
            });
            done();
          });
      });
    });

    describe('setSessionSteps', () => {
      beforeEach(() => {
        sinon.stub(SessionHelper.prototype, 'setSessionData')
          .returns(new Promise(resolve => resolve()));
      });

      afterEach(() => {
        SessionHelper.prototype.setSessionData.restore();
      });

      it('calls sessionHelper.setSessionData with key', done => {
        sessionHelper.setSessionSteps(FAKE_KEY, {})
          .then(() => {
            SessionHelper.prototype.setSessionData.should.have.been.calledWith(FAKE_KEY);
            done();
          });
      });

      it('calls sessionHelper.setSessionData with data', done => {
        sessionHelper.setSessionSteps(FAKE_KEY, ['/1', '/2', '/3'])
          .then(() => {
            SessionHelper.prototype.setSessionData.args[0][1].should.be.eql({
              steps: ['/1', '/2', '/3']
            });
            done();
          });
      });
    });
  });
});
