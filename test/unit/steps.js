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
    });
  });
});
