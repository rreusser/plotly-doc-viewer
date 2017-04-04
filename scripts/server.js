#!/usr/bin/env node

var budo = require('budo');
var babelify = require('babelify');
var html = require('../lib/index');

budo('lib/client.js', {
  live: true,
  open: false,
  host: 'localhost',
  forceDefaultIndex: true,
  defaultIndex: () => html('client.js'),
  browserify: {
    transform: [
      babelify.configure({
        presets: ['es2015', 'react'],
        plugins: ['transform-class-properties']
      }),
      require('brfs')
    ]
  }
});