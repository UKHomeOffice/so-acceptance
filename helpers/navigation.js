'use strict';

const Helper = require('codeceptjs/lib/helper');

module.exports = class Navigation extends Helper {
  refreshPage() {
    this.helpers.WebDriverIO.browser.refresh();
  }
};
