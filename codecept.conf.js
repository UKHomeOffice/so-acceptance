'use strict';

const path = require('path');

module.exports = {
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
    },
    Focus: {
      require: path.resolve(__dirname, './helpers/focus')
    }
  },
  mocha: {},
  name: 'hof-acceptance',
  include: {
    I: path.resolve(__dirname, './steps.js')
  }
};
