#!/usr/bin/env node

var getSchema = require('../lib/schema');

getSchema(function (err, data) {
  if (err) {
    console.error(err);
    return;
  }

  process.stdout.write(JSON.stringify(data));
});
