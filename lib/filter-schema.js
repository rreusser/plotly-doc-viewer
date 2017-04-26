var constants = require('./constants');

module.exports = function filterSchema (schema, q) {
  var i;
  var hasQuery = q && q.trim().length > 0;
  var re = new RegExp('(' + (q.trim().split(/\s+/).join('|')) + ')', 'i');

  var invalidAttrs = schema.defs.metaKeys.concat(['_visible', '_expanded', 'type'])

  function rejectInvalid (name) {
    return constants.invalidAttrs.indexOf(name) === -1;
  }

  function recurse (attrs, allVisible) {
    var attrSrc = attrs;
    var hit = false;
    var match

    if (attrs.role === 'object' && attrs.items) {
      var containerName = Object.keys(attrs.items).filter(rejectInvalid)[0];
      attrSrc = attrs.items[containerName];
      attrs.items._visible = true;
      attrs.items._expanded = true;
      attrs._visible = true;
      attrs._expanded = true;
    }

    var keys = Object.keys(attrSrc);

    for (var j = 0; j < keys.length; j++) {
      var attrName = keys[j];
      if (invalidAttrs.indexOf(attrName) !== -1) continue;

      var attr = attrSrc[attrName];

      if (typeof attr === 'object' && attr.role === 'object') {
        match = re.test(attrName);
        attr._expanded = !!(!!recurse(attr, match) && hasQuery);
        hit = !!(hit || attr._expanded)
      } else {
        match = re.test(attrName) || re.test(attr.description)
        attr._visible = !!(match || allVisible);
        hit = !!(hit || attr._visible);
      }
    }

    if (attrs.role === 'object' && attrs.items) {
      attrs.items._visible = hit;
      attrs._visible = hit;
    }

    //attrs._expanded = hit;
    attrSrc._visible = hit;

    return hit;
  }

  var keys = Object.keys(schema.traces);
  for (i = 0; i < keys.length; i++) {
    var hit = recurse(schema.traces[keys[i]].attributes);
    schema.traces[keys[i]].attributes._visible = hit;
  }

  recurse(schema.layout.layoutAttributes);
  schema.layout.layoutAttributes._visible = true;

  return schema;
}
