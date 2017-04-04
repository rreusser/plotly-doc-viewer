#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
import React from 'react'
import ReactDOM from 'react-dom/server'
import Docs from '../lib/components/docs'
import filterSchema from '../lib/filter-schema'

var schema = JSON.parse(fs.readFileSync(path.join(__dirname, '../assets/schema.json'), 'utf8'));

// Expand interior
schema = filterSchema(schema, '.')

// Expand trace sections:
var traceTypes = Object.keys(schema.traces);
for (var i = 0; i < traceTypes.length; i++) {
  schema.traces[traceTypes[i]]._expanded = true;
}

global.process.stdout.write(ReactDOM.renderToString(<Docs schema={schema}/>), 'utf8');
