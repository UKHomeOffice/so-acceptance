'use strict';

// eslint-disable-next-line no-console
console.info('HOF-Acceptance stopping App');

const app = require('../../app');

app.then(bootstrap => bootstrap.stop());
