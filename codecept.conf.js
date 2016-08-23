'use strict';

const path = require('path');
const _ = require('lodash');

let localConfig = {};

try {
  localConfig = require(path.resolve(__dirname, '../../codecept.conf'));
} catch (err) {
  // eslint-disable-next-line no-console
  console.info('Local config not found, using defaults');
}

const baseConfig = {
  tests: '../../apps/**/features/**/*.js',
  timeout: 10000,
  output: './output',
  helpers: {
    WebDriverIO: {
      url: 'http://localhost:8080',
      browser: 'phantomjs'
    },
    Session: {
      require: './helpers/session'
    },
    Navigation: {
      require: './helpers/navigation'
    }
  },
  mocha: {},
  name: 'hof-acceptance',
  include: {
    I: './steps.js'
  }
};

module.exports.config = _.merge({}, baseConfig, localConfig);
