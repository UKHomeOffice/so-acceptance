'use strict';

const path = require('path');
const fs = require('fs');

module.exports = () => {

  const config = path.resolve(process.cwd(), './codecept.conf.js');
  const template = path.resolve(__dirname, '../codecept.conf.example.js');

  return new Promise((resolve, reject) => {

    fs.readFile(config, err => {
      if (err && err.code === 'ENOENT') {
        // no conf file is present - make one
        console.log(`Could not find local configuration file at ${config} - creating...`);
        const stream = fs.createReadStream(template)
          .pipe(fs.createWriteStream(config));

        stream.on('error', e => reject(e));
        stream.on('clsoe', () => resolve(config));
      } else {
        // config file exists - carry on
        resolve(config);
      }
    });

  });

};
