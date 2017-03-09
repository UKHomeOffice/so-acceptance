'use strict';

const Helper = require('codeceptjs/lib/helper');
const Autofill = require('hof-util-autofill');

module.exports = class Navigation extends Helper {
  refreshPage() {
    return this.helpers.WebDriverIO.browser.refresh();
  }
  completeToStep() {
    return Autofill(this.helpers.WebDriverIO.browser).apply(null, arguments);
  }
};
