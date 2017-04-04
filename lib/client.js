var fs = require('fs');
import React from 'react'
import ReactDOM from 'react-dom'
import css from 'insert-css'
import Docs from './components/docs'

css(fs.readFileSync(__dirname + '/../assets/styles.css', 'utf8'))

fetch('assets/schema.json').then(function (response) {
  response.json().then(function (schema) {
    ReactDOM.render(<Docs schema={schema}/>, document.getElementById('doc-root'));
  });
});

