'use strict';

const proxyquire = require('proxyquire');
const FAKE_ID = 'fakeId';
const FAKE_KEY = 'fake-key';

describe('SessionHelper', () => {
  class MockRedis {
    constructor() {
      this.client = {
        quit: sinon.stub()
      };
    }
  }
  let SessionHelper;
  let sessionHelper;
  let mockData;

  beforeEach(() => {
    mockData = {
      mockData: ''
    };
    MockRedis.prototype.get = sinon.stub().callsArgWith(1, null, mockData);
    MockRedis.prototype.set = sinon.stub().callsArgWith(2, null, mockData);

    SessionHelper = proxyquire('../../../helpers/session', {
      'connect-redis': function() {
        return MockRedis;
      },
      'express-session': {},
      'hof-bootstrap/lib/encryption'() {
        return {
          encrypt: val => val,
          decrypt: val => val
        };
      }
    });
    sessionHelper = new SessionHelper();
    sessionHelper.helpers.WebDriverIO = {
      browser: {
        cookie: sinon.stub().returns(new Promise(resolve => resolve(FAKE_ID)))
      }
    };
    sessionHelper._beforeSuite();
  });

  it('has a _beforeSuite method', () => {
    sessionHelper.should.have.property('_beforeSuite')
      .and.be.a('function');
  });

  it('has an _afterSuite method', () => {
    sessionHelper.should.have.property('_afterSuite')
      .and.be.a('function');
  });

  it('has a _getSessionId method', () => {
    sessionHelper.should.have.property('_getSessionId')
      .and.be.a('function');
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
    describe('_beforeSuite', () => {
      it('sets a session property on the sessionHelper instance', () => {
        sessionHelper.should.have.property('session');
      });
    });

    describe('_afterSuite', () => {
      it('closes the redis connection', () => {
        sessionHelper._afterSuite();
        sessionHelper.session.client.quit.should.have.been.calledOnce;
      });
    });

    describe('_getSessionId', () => {
      it('returns a promise', () => {
        sessionHelper._getSessionId().should.be.a('promise');
      });
    });

    describe('_getSession', () => {
      beforeEach(() => {
        sinon.stub(SessionHelper.prototype, '_getSessionId')
          .returns(new Promise(resolve => resolve(FAKE_ID)));
      });

      afterEach(() => {
        SessionHelper.prototype._getSessionId.restore();
      });

      it('calls session.get with the sessionId \'fakeId\'', done => {
        sessionHelper._getSession()
          .then(() => {
            MockRedis.prototype.get.should.have.been.calledOnce
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
      beforeEach(() => {
        sinon.stub(SessionHelper.prototype, '_getSessionId')
          .returns(new Promise(resolve => resolve(FAKE_ID)));
      });

      afterEach(() => {
        SessionHelper.prototype._getSessionId.restore();
      });

      it('calls session.save with the sessionId \'fakeId\'', done => {
        sessionHelper._saveSession(FAKE_KEY, mockData)
          .then(() => {
            MockRedis.prototype.set.should.have.been.calledOnce.
              and.calledWith(FAKE_ID);
            done();
          });
      });

      it('calls session.save with merged session object', done => {
        sessionHelper._saveSession(FAKE_KEY, {key: 'fakeKey'})
          .then(() => {
            MockRedis.prototype.set.args[0][1].should.be.eql({
              mockData: '',
              'hof-wizard-fake-key': {
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
              'hof-wizard-fake-key': mockData
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

      it('rejects if getSession rejects', done => {
        const err = new Error('test error');
        sessionHelper.getSession.returns(new Promise((resolve, reject) => reject(err)));
        sessionHelper.setSessionData(FAKE_KEY, {some: 'data'})
          .catch(e => {
            e.should.equal(err);
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
