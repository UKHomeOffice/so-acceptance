'use strict';

const Helper = require('codeceptjs/lib/helper');
const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);
const cookieParser = require('cookie-parser');

const SESSION_KEY_PREFIX = 'hmpo-wizard';
const SESSION_KEY_COOKIE_NAME = 'hod.sid';
const SECRET = 'changethis';

const encryption = require('hof-bootstrap/lib/encryption')(SECRET);

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
    return new Promise((resolve, reject) => {
      this.helpers.WebDriverIO.browser.cookie()
        .then(cookie => {
          let sessionId = cookie.value.find(obj => obj.name === SESSION_KEY_COOKIE_NAME).value;
          sessionId = cookieParser.signedCookie(decodeURIComponent(sessionId), SECRET);
          resolve(sessionId);
        })
        .catch(reject);
    });
  }

  _getSession() {
    return new Promise((resolve, reject) => {
      this._getSessionId().then(sessionId => {
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
    return new Promise((resolve, reject) => {
      this._getSession()
        .then(sessionData => {
          resolve(sessionData[`${SESSION_KEY_PREFIX}-${sessionKey}`] || {});
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
      this._getSessionId().then(sessionId => {
        this._getSession().then(sessionData => {
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
