'use strict';

const Helper = require('codeceptjs/lib/helper');
const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);
const cookieParser = require('cookie-parser');

const SESSION_KEY_PREFIX = 'hof-wizard';
const SESSION_KEY_COOKIE_NAME = 'hod.sid';
const SECRET = 'changethis';

const encryption = require('./encryption')(SECRET);

module.exports = class Session extends Helper {

  _beforeSuite() {
    this.session = new RedisStore({
      serializer: {
        parse: data => JSON.parse(encryption.decrypt(data)),
        stringify: data => encryption.encrypt(JSON.stringify(data))
      }
    });
  }

  _afterSuite() {
    this.session.client.quit();
  }

  _getSessionId() {
    return this.helpers.WebDriverIO.browser.cookie()
      .then(cookie => {
        let sessionId = cookie.value.find(obj => obj.name === SESSION_KEY_COOKIE_NAME).value;
        sessionId = cookieParser.signedCookie(decodeURIComponent(sessionId), SECRET);
        return sessionId;
      });
  }

  _getSession() {
    return this._getSessionId().then(sessionId => {
      return new Promise((resolve, reject) => {
        this.session.get(sessionId, (err, sessionData) => {
          if (err) {
            reject(err);
          }
          resolve(sessionData);
        });
      });
    });
  }

  getSession(sessionKey) {
    return this._getSession()
      .then(sessionData => {
        return sessionData[`${SESSION_KEY_PREFIX}-${sessionKey}`] || {};
      });
  }

  setSessionData(sessionKey, data) {
    return this.getSession(sessionKey)
      .then(sessionData => {
        return this._saveSession(sessionKey, Object.assign(sessionData, data));
      });
  }

  setSessionSteps(sessionKey, steps) {
    return this.setSessionData(sessionKey, {steps});
  }

  _saveSession(sessionKey, data) {
    return this._getSessionId()
      .then(sessionId => {
        return this._getSession()
          .then(sessionData => {
            return new Promise((resolve, reject) => {
              this.session.set(sessionId, Object.assign(sessionData, {
                [`${SESSION_KEY_PREFIX}-${sessionKey}`]: data
              }), err => {
                if (err) {
                  return reject(err);
                }
                return resolve();
              });
            });
          });
      });
  }
};
