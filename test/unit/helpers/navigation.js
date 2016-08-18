'use strict';

const proxyquire = require('proxyquire');

const mockWebDriverHelper = {
  browser: {
    refresh: sinon.stub().returns(new Promise(resolve => resolve()))
  }
};

class MockHelper {
  constructor() {
    this.helpers = {
      WebDriverIO: mockWebDriverHelper
    };
  }

  helpers() {
    return this.helpers;
  }
}

const NavigationHelper = proxyquire('../../../helpers/navigation', {
  'codeceptjs/lib/helper': MockHelper
});

describe('Navigation Helper', () => {
  let navigationHelper;

  beforeEach(() => {
    navigationHelper = new NavigationHelper();
  });

  it('should have a refreshPage method', () => {
    navigationHelper.should.have.property('refreshPage').and.be.a('function');
  });

  it('should return a promise', () => {
    navigationHelper.refreshPage().should.be.a('promise');
  });

  it('should call WebDriverIO.browser.refresh', done => {
    navigationHelper.refreshPage().then(() => {
      mockWebDriverHelper.browser.refresh.should.have.been.calledTwice;
      done();
    });
  });
});
