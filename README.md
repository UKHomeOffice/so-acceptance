# SO Acceptance

SO Acceptance is a NodeJS acceptance testing framework build on top of [CodeceptJS](https://github.com/Codeception/CodeceptJS) and is designed to be used in SO applications

## Installation

```bash
$ npm install so-acceptance --save-dev
```

## Application configuration

### Simple usage

#### Setup

For quickstart usage you can simply npm install the library and add the following script to your package.json.

package.json
```json
"scripts": {
  "test:acceptance": "so-acceptance --steps"
}
```

Running this for the first time will create a local configuration file in your project directory.

The root of your acceptance tests will need to be located in a folder called `acceptance_tests` in the root of your app, features are located in a subdirectory named `features`.

```
<service name>
  |__acceptance_tests/
       |__features/
          |__your tests go here.
```

#### Running

```bash
$ npm run test:acceptance
```

### Session Mocking

#### Setup

SO Acceptance comes with session mocking so you are able to test steps independently of one another. This assumes you are using  [hof-bootstrap](https://github.com/UKHomeOffice/hof-bootstrap/) and redis for session storage.

#### API

The `I` actor in CodeceptJS has been extended with the following session manipulation methods:

* `getSession(route_name)`: returns the session data for the given route_name (defined in bootstrap config).
* `setSessionData(route_name, {data})`: sets the key: value pairs in data to session for given route_name.
* `setSessionSteps(route_name, [steps])`: sets the visited steps to session for given route name.

As these API methods all return promises, they should be used within generator functions to ensure code execution is paused while the session is manipulated:

```js
Scenario('I set session steps', function *(I) {
  yield I.setSessionSteps('journey-name', ['/', '/step-1']);
  I.amOnPage('/step-2');
});
```

### Extensions to the actor (`I`)

The following methods have been added to `I`:

* `completeToStep(step[, values])`: Completes a form as far as a given step, using values specified or default values inferred from the field names.
* `submitForm()`: clicks the submit button `input[type="submit"]`
* `visitPage(page, [journey], [prereqs])`: visits `'/'`, then page, prepending journey if present, and setting prereq steps. Page and Prereqs are expected to be [PageObjects](https://github.com/Codeception/CodeceptJS/blob/master/docs/pageobjects.md) with a `url` property.
* `seeErrors(errors)`: accepts either an array of keys or a single key, and checks for validation errors related to the element.
* `seeElements(elements)`: accepts either an array of selectors or a single selector and checks all elements are present on the page.
* `refreshPage()`: refreshes the page - async, should be called within a generator.
* `seeEach(texts)`: accepts an array of text and checks all texts are present on the page`.
* `dontSeeEach(texts)`: accepts an array of text and checks all texts are not present on the page`.

### Customisation

You can add any customisation options in your local configuration file. The default options are extended with overrides defined here.

codecept.conf.js
```js
var path = require('path');

module.exports = require('so-acceptance').extend({
  name: 'name of your app',
  tests: './apps/**/acceptance/features/**/*.js',
  include: {
    customPage: path.resolve(__dirname, './pages/custom.js')
  }
})
```
