var fs = require('fs');
var path = require('path');
var schemaPath = path.join(__dirname, '../../data/schema.json');

module.exports = function (req, res, next) {
  /^\/?schema\.json$/.test(req.url) ? fs.createReadStream(schemaPath).pipe(res) : next();
}
