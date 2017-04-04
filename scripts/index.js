#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var html = require('../lib/index');
var hyperstream = require('hyperstream');
var metadataify = require('metadataify');
var ghcorner = require('github-cornerify');

html({
  script: 'assets/bundle.js',
  content: fs.readFileSync(path.join(__dirname, '../assets/_static.html'), 'utf8')
})
  .pipe(metadataify())
  .pipe(ghcorner())
  .pipe(process.stdout);
