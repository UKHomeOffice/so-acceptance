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

const tests = path.relative(__dirname, path.resolve(process.cwd(), './apps/**/features/**/*.js'));

const baseConfig = {
  tests: tests,
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
