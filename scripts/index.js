#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var html = require('../lib/index');
var hyperstream = require('hyperstream');
var ghcorner = require('github-cornerify');

html('assets/bundle.js')
  .pipe(ghcorner())
  .pipe(process.stdout);
