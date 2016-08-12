'use strict';

const Helper = require('codeceptjs/lib/helper');
const session = require('../mock-session');

const SESSION_ID = 'fakeId';
const SESSION_KEY = 'hmpo-wizard';

module.exports = class Session extends Helper {

  _getSession() {
    return new Promise((resolve, reject) => {
      session.get(SESSION_ID, (err, sessionData) => {
        if (err) {
          return reject(err);
        }
        return resolve(sessionData);
      });
    });
  }

  getSession(sessionKey) {
    return new Promise((resolve, reject) => {
      this._getSession()
        .then(sessionData => {
          resolve(sessionData[`${SESSION_KEY}-${sessionKey}`] || {});
        })
        .catch(reject);
    });
  }

  setSessionData(sessionKey, data) {
    return new Promise((resolve, reject) => {
      this.getSession(sessionKey)
        .then(sessionData => {
          this._saveSession(sessionKey, Object.assign(sessionData, data))
            .then(resolve)
            .catch(reject);
        });
    });
  }

  setSessionSteps(sessionKey, steps) {
    return new Promise((resolve, reject) => {
      this.setSessionData(sessionKey, {steps})
        .then(resolve)
        .catch(reject);
    });
  }

  _saveSession(sessionKey, data) {
    return new Promise((resolve, reject) => {
      this._getSession().then(sessionData => {
        session.set(SESSION_ID, Object.assign({}, sessionData, {
          [`${SESSION_KEY}-${sessionKey}`]: data
        }), err => {
          if (err) {
            return reject(err);
          }
          return resolve();
        });
      });
    });
  }
};
