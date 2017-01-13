'use strict';

const path = require('path');
const _ = require('lodash');

let localConfig = {};

try {
  localConfig = require(path.resolve(process.cwd(), './codecept.conf'));
} catch (err) {
  // eslint-disable-next-line no-console
  console.info('Local config not found, using defaults');
}

const baseConfig = {
  tests: './apps/**/features/**/*.js',
  timeout: 10000,
  output: './output',
  helpers: {
    WebDriverIO: {
      url: 'http://localhost:8080',
      browser: 'phantomjs'
    },
    Session: {
      require: path.resolve(__dirname, './helpers/session')
    },
    Navigation: {
      require: path.resolve(__dirname, './helpers/navigation')
    }
  },
  mocha: {},
  name: 'hof-acceptance',
  include: {
    I: path.resolve(__dirname, './steps.js')
  }
};

module.exports.config = _.merge({}, baseConfig, localConfig);
