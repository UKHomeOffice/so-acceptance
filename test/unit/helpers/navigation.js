'use strict';

const proxyquire = require('proxyquire');

const mockWebDriverHelper = {
  browser: {
    refresh: sinon.stub()
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

  it('should call WebDriverIO.browser.refresh', () => {
    navigationHelper.refreshPage();
    mockWebDriverHelper.browser.refresh.should.have.been.calledOnce;
  });
});
