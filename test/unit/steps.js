'use strict';

const steps = require('../../steps');

describe('Actor functionality extensions', () => {
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
        const journeyName = 'test-journey';
        const page = {url: 'test-page'};

        describe('with only page object passed', () => {
          it('calls actor.amOnPage with \'/\' then page url with \'/\' prepended', () => {
            actor.visitPage(page);
            actor.amOnPage.should.have.been.calledTwice;
            actor.amOnPage.firstCall.should.have.been.calledWithExactly('/');
            actor.amOnPage.secondCall.should.have.been.calledWithExactly(`/${page.url}`);
          });

          it('calls actor.seeInCurrentUrl with page url with \'/\' prepended', () => {
            actor.visitPage(page);
            actor.seeInCurrentUrl.should.have.been.calledOnce
              .and.calledWithExactly(`/${page.url}`);
          });
        });

        describe('with page object and journey name passed', () => {
          it('calls actor.amOnPage with the page.url and journey name prepended', () => {
            actor.visitPage(page, journeyName);
            actor.amOnPage.secondCall.should.have.been.calledWithExactly(`/${journeyName}/${page.url}`);
          });
        });

        describe('with prereqs passed', () => {
          const prereqs = [{
            url: 'url-1'
          }, {
            url: 'url-2'
          }, {
            url: 'url-3'
          }];

          it('call actor.setSessionSteps with the urls from passed page objects, with \'/\' prepended', () => {
            actor.visitPage(page, null, prereqs);
            actor.setSessionSteps.should.have.been.calledOnce
              .and.calledWithExactly(null, [
                `/${prereqs[0].url}`,
                `/${prereqs[1].url}`,
                `/${prereqs[2].url}`
              ]);
          });

          it('accepts a single value', () => {
            actor.visitPage(page, null, prereqs[0]);
            actor.setSessionSteps.should.have.been.calledOnce
              .and.calledWithExactly(null, [
                `/${prereqs[0].url}`
              ]);
          });
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
