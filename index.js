'use strict';

const merge = require('lodash').merge;

module.exports = {
  extend: config => ({
    config: merge(require('./codecept.conf.js'), config)
  })
};
