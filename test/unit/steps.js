'use strict';

const proxyquire = require('proxyquire');

describe('Actor functionality extensions', () => {
  let steps;
  let helpersStub;

  beforeEach(() => {
    helpersStub = {
      getRouteSteps: sinon.stub().returns([])
    };
    steps = proxyquire('../../steps', {
      'hof/wizard/util/helpers': helpersStub
    });
  });

  it('should be a function', () => {
    steps.should.be.a('function');
  });

  it('should return an object', () => {
    steps().should.be.an('object');
  });

  describe('Actor Instance', () => {
    let actor;

    beforeEach(() => {
      actor = steps();
    });

    it('exposes a selectors hash', () => {
      actor.should.have.property('selectors');
    });

    it('exposes a submitForm function', () => {
      actor.should.have.property('submitForm');
    });

    it('exposes a visitPage function', () => {
      actor.should.have.property('visitPage');
    });

    it('exposes a seeHint method', () => {
      actor.should.have.property('seeHint');
    });

    it('exposes a dontSeeHint method', () => {
      actor.should.have.property('dontSeeHint');
    });

    it('exposes a seeErrors function', () => {
      actor.should.have.property('seeErrors');
    });

    it('exposes a seeElements function', () => {
      actor.should.have.property('seeElements');
    });

    describe('Functions', () => {
      beforeEach(() => {
        actor.click = sinon.stub();
        actor.amOnPage = sinon.stub();
        actor.seeInCurrentUrl = sinon.stub();
        actor.setSessionSteps = sinon.stub();
        actor.seeElement = sinon.stub();
        actor.dontSeeElement = sinon.stub();
      });

      describe('submitForm', () => {
        it('calls actor.click and passes the submit selector', () => {
          actor.submitForm();
          actor.click.should.have.been.calledOnce
            .and.calledWithExactly(actor.selectors.submit);
        });
      });

      describe('visitPage', () => {
        const config = {
          steps: {}
        };
        const page = {
          url: 'test-page'
        };

        it('calls getRouteSteps with stepName and steps config', () => {
          actor.visitPage(page, config);
          helpersStub.getRouteSteps.should.have.been.calledOnce
            .and.calledWithExactly(`/${page.url}`, config.steps);
        });

        it('visits start page \'/\'', () => {
          actor.visitPage(page, config);
          actor.amOnPage.should.have.been.calledWith('/');
        });

        it('visits the page.url with \'/\' prepended if no baseUrl provided', () => {
          actor.visitPage(page, config);
          actor.amOnPage.should.have.been.calledWith(`/${page.url}`);
        });

        it('visits the page.url with base URL prepended if provided', () => {
          config.baseUrl = '/baseUrl';
          actor.visitPage(page, config);
          actor.amOnPage.should.have.been.calledWith(`${config.baseUrl}/${page.url}`);
        });

        it('sets prereq steps', () => {
          const prereqs = ['/step-1', '/step-2'];
          helpersStub.getRouteSteps.returns(prereqs);
          config.name = 'journey-name';
          actor.visitPage(page, config);
          actor.setSessionSteps.should.have.been.calledOnce
            .and.calledWithExactly(config.name, prereqs);
        });
      });

      describe('seeHint', () => {
        it('calls seeElement with -hint appended to field', () => {
          actor.seeHint('field');
          actor.seeElement.should.have.been.calledOnce
            .and.calledWithExactly('field-hint');
        });
      });

      describe('dontSeeHint', () => {
        it('calls dontSeeElement with -hint appended to field', () => {
          actor.dontSeeHint('field');
          actor.dontSeeElement.should.have.been.calledOnce
            .and.calledWithExactly('field-hint');
        });
      });

      describe('seeErrors', () => {
        it('calls seeElement for each element passed', () => {
          actor.seeErrors(['something', 'something-else']);
          actor.seeElement.should.have.been.calledTwice;
        });

        it('accepts a single value', () => {
          actor.seeErrors('something');
          actor.seeElement.should.have.been.calledOnce;
        });

        it('calls seeElement with -group.validation-error appended', () => {
          actor.seeErrors('something');
          actor.seeElement.should.have.been.calledOnce
            .and.calledWithExactly('something-group.validation-error');
        });

        it('doesn\'t append -group if the element ends with -group', () => {
          actor.seeErrors('something-group');
          actor.seeElement.should.have.been.calledOnce
            .and.calledWithExactly('something-group.validation-error');
        });
      });

      describe('seeElements', () => {
        it('calls seeElement for each element passed', () => {
          actor.seeElements(['something', 'something-else']);
          actor.seeElement.should.have.been.calledTwice;
        });

        it('accepts a single value', () => {
          actor.seeElements('something');
          actor.seeElement.should.have.been.calledOnce;
        });

        it('calls seeElement with the element passed', () => {
          actor.seeElements('something');
          actor.seeElement.should.have.been.calledOnce
            .and.calledWithExactly('something');
        });
      });
    });
  });
});
