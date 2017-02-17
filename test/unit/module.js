'use strict';

describe('module', () => {

  it('has webdriverio as a dependency', () => {
    // codecept needs to have webdriverio installed as a dependency to run
    // ensure it is declared here so it is not accidentally removed
    const pkg = require('../../package.json');
    pkg.dependencies.should.have.a.property('webdriverio');
  });

});
