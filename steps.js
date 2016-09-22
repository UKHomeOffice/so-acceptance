'use strict';

const actor = require('codeceptjs/lib/actor');
const getRouteSteps = require('hmpo-form-wizard/lib/util/helpers').getRouteSteps;

module.exports = () => {
  return actor({

    selectors: {
      submit: 'input[type="submit"]'
    },

    submitForm() {
      this.click(this.selectors.submit);
    },

    visitPage(page, options) {
      const base = options.baseUrl || '';
      const url = `${base}/${page.url}`;
      const steps = getRouteSteps(`/${page.url}`, options.steps);

      this.amOnPage('/');

      if (steps.length) {
        this.setSessionSteps(options.name, steps);
      }

      this.amOnPage(url);
      this.seeInCurrentUrl(url);
    },

    seeHint(field) {
      this.seeElement(`${field}-hint`);
    },

    dontSeeHint(field) {
      this.dontSeeElement(`${field}-hint`);
    },

    seeErrors(fields) {
      if (!Array.isArray(fields)) {
        fields = [fields];
      }

      fields.forEach(field => {
        if (!field.match(/.*-group$/)) {
          field = `${field}-group`;
        }
        this.seeElement(`${field}.validation-error`);
      });
    },

    seeElements(selectors) {
      if (!Array.isArray(selectors)) {
        selectors = [selectors];
      }

      selectors.forEach(selector => {
        this.seeElement(selector);
      });
    },

    seeEach(texts) {
      if (!Array.isArray(texts)) {
        texts = [texts];
      }

      texts.forEach(text => {
        this.see(text);
      });
    }

  });
};
