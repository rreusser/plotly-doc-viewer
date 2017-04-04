var constants = require('./constants');

module.exports = function filterSchema (schema, q) {
  var hasQuery = q && q.trim().length > 0;
  var re = new RegExp('(' + (q.trim().split(/\s+/).join('|')) + ')', 'i');

  function recurse (attrs, allVisible) {
    var keys = Object.keys(attrs);
    var hit = false;
    var match

    for (var j = 0; j < keys.length; j++) {
      var attrName = keys[j];
      if (constants.invalidAttrs.indexOf(attrName) !== -1) continue;

      var attr = attrs[attrName];

      if (typeof attr === 'object' && attr.role === 'object') {
        match = re.test(attrName);
        attr._expanded = recurse(attr, match) && hasQuery;
        hit = hit || attr._expanded
      } else {
        match = re.test(attrName) || re.test(attr.description)
        attr._visible = match || allVisible;
        hit = hit || attr._visible;
      }
    }

    //attrs._expanded = hit;
    attrs._visible = hit;

    return hit;
  }

  var keys = Object.keys(schema.traces);
  for (var i = 0; i < keys.length; i++) {
    var hit = recurse(schema.traces[keys[i]].attributes);
    schema.traces[keys[i]].attributes._visible = hit;
  }

  return schema;
}
