#!/usr/bin/env node

var budo = require('budo');
var babelify = require('babelify');
var html = require('../lib/index');

budo('lib/client.js', {
  live: true,
  open: true,
  host: 'localhost',
  forceDefaultIndex: true,
  defaultIndex: () => html({
    script: 'client.js',
    css: 'assets/styles.css'
  }),
  browserify: {
    transform: [
      babelify.configure({
        presets: ['es2015', 'react'],
        plugins: ['transform-class-properties']
      })
    ]
  }
});
