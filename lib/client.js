var fs = require('fs');
import React from 'react'
import ReactDOM from 'react-dom'
const root = document.getElementById('doc-root')
import css from 'insert-css'
import Docs from './components/docs'

css(fs.readFileSync(__dirname + '/../assets/styles.css', 'utf8'))

fetch('assets/schema.json').then(function (response) {
  response.json().then(function (schema) {
    console.log('schema:', schema);
    ReactDOM.render(<Docs schema={schema}/>, root);
  });
});

