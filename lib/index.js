var html = require('simple-html-index');
var hyperstream = require('hyperstream');

module.exports = function (opts) {
  opts = opts || {};
  return html({title: 'plotly.js doc viewer'}).pipe(hyperstream({
    head: {
      _appendHtml: [
        '<link rel="stylesheet" href="https://images.plot.ly/assets/css/normalize.css">',
        '<link rel="stylesheet" href="https://plot.ly/gh-pages/documentation/static//css/main.css?version=2a3d1a525a">',
        opts.css ?  '<link rel="stylesheet" href="' + opts.css + '">' : '',
      ].join('\n')
    },
    body: {
      _appendHtml: [
        '<div id="doc-root" class="doc-root">' + (opts.content ? opts.content : '') + '</div>',
        '<script src="' + opts.script + '"></script>'
      ].join('\n')
    }
  }))
}
