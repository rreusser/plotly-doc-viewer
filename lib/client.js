import React from 'react'
import ReactDOM from 'react-dom'
import Docs from './components/docs'

fetch('assets/schema.json').then(function (response) {
  response.json().then(function (schema) {
    window.schema = schema
    ReactDOM.render(<Docs schema={schema}/>, document.getElementById('doc-root'));
  });
});

