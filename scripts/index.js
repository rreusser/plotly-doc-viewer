#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var html = require('../lib/index');
var hyperstream = require('hyperstream');
var out = fs.createWriteStream(path.join(__dirname, '../index.html'));
var ghcorner = require('github-cornerify');

html('assets/bundle.js')
  .pipe(ghcorner())
  .pipe(out);
