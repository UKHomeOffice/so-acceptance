'use strict';

const Helper = require('codeceptjs/lib/helper');

module.exports = class Focus extends Helper {
  hasFocus(selector) {
    return this.helpers.WebDriverIO.browser.hasFocus(selector);
  }
};
