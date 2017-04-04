var jsdom = require('jsdom');
var fs = require('fs');

module.exports = function (cb) {
  jsdom.env({
    html: '',
    src: [fs.readFileSync(require.resolve('plotly.js/dist/plotly-with-meta.js'), 'utf-8')],
    done: (err, window) => {
      if (err) {
        cb(err);
      } else {
        cb(null, window.Plotly.PlotSchema.get())
      }
    }
  });
}
