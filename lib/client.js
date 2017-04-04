var fs = require('fs');
import React from 'react'
import ReactDOM from 'react-dom'
const root = document.getElementById('doc-root')
const Markdown = require('react-markdown');
import css from 'insert-css'

css(fs.readFileSync(__dirname + '/../assets/styles.css', 'utf8'))

class SearchBar extends React.Component {
  render () {
    return <div className="searchBar row">
      <div className="eight columns">
        <input type="search" value={this.props.query} onChange={this.props.onSearch}/>
      </div>
    </div>
  }
}

class SectionTitle extends React.Component {
  render () {
    return <h4>
      <Toggle onToggle={this.props.onToggle} expanded={this.props.expanded}/>
      <a id={this.props.title} href={`#${this.props.title}`}>
        {this.props.title}
      </a>
    </h4>
  }
}

class Trace extends React.Component {
  toggle = () => {
    this.props.schema._expanded = !this.props.schema._expanded
    this.setState({})
  }

  render () {
    if (!this.props.schema.attributes._visible) {
      return <div/>
    }

    return <div className={"row " + (this.props.schema._expanded ? 'expanded' : 'collapsed')}>
      <div className="eight columns">
        <SectionTitle title={this.props.type} onToggle={this.toggle} expanded={this.props.schema._expanded}/>
        {this.props.schema._expanded && (
          <div>
            <Markdown source={this.props.schema.meta.description || ''}/>
            <AttrList attrs={this.props.schema.attributes} path={[this.props.type]}/>
          </div>
        )}
      </div>
    </div>
  }
}

class Attr extends React.Component {
  render () {
    let path = this.props.path.join('-')

    // Attr name:
    var els = [
      <a className="attributeName" id={path} href={'#' + path} key="attr">
        {this.props.name}
      </a>
    ];

    // Attr type:
    if (this.props.attr.valType) {
      els.push(<span key="type">&nbsp;(
        <code>{this.props.attr.valType}</code>
      )</span>)
    }

    // Attr default:
    if (this.props.attr.dflt !== undefined && this.props.attr.dflt !== null) {
      els.push(<br key="br1"/>)
      els.push(<span key="dflt">default: <code>{this.props.attr.dflt.toString()}</code></span>)
    }

    // Attr description:
    if (this.props.attr.description) {
      els.push(<br key="br2"/>);
      els.push(<Markdown
        key="desc"
        source={this.props.attr.description}
        renderers={{Paragraph: 'span'}}
      />)
    }

    return <li>{els}</li>
  }
}

class Toggle extends React.Component {
  render () {
    return <button
      className="attrToggle"
      onClick={this.props.onToggle}
    >
      {this.props.expanded ? '[-]' : '[+]'}
    </button>
  }
}

const invalidAttrs = [
  'type',
  '_deprecated',
  'role',
  'description',
  '_expanded',
  '_visible'
]

class AttrList extends React.Component {
  toggle = (attrName) => {
    this.props.attrs[attrName]._expanded = !this.props.attrs[attrName]._expanded
    this.setState({})
  }

  render () {
    if (!this.props.attrs) return <div></div>

    var attrs = Object.keys(this.props.attrs)
      .sort()
      .filter(attr => invalidAttrs.indexOf(attr) === -1);

    if (attrs.role === 'object') {
      return <div>Nested</div>
    }

    return <ul>
      {attrs.map((attrName) => {
        var attr = this.props.attrs[attrName]
        var path = this.props.path.concat([attrName])
        var pathName = path.join('-')

        if (attr.role === "object") {
          return attr._visible && (<li key={pathName}>
            <Toggle onToggle={() => this.toggle(attrName)} expanded={attr._expanded}/>
            <a className="attribute-name" href={'#' + pathName} id={pathName}>{attrName}</a>
            {attr._expanded && (
              <AttrList
                attrs={attr}
                path={this.props.path.concat([attrName])}
              />
            )}
          </li>)
        } else {
          return attr._visible && <Attr
            key={pathName}
            attr={attr}
            name={attrName}
            path={path}
          />
        } })}
    </ul>
  }
}

function filterSchema (schema, q) {
  var hasQuery = q && q.trim().length > 0;
  var re = new RegExp('(' + (q.trim().split(/\s+/).join('|')) + ')', 'i');

  function recurse (attrs, allVisible) {
    var keys = Object.keys(attrs);
    var hit = false;
    var match

    for (var j = 0; j < keys.length; j++) {
      var attrName = keys[j];
      if (invalidAttrs.indexOf(attrName) !== -1) continue;

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

class Docs extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      schema: filterSchema(this.props.schema, ''),
      query: '',
    }
  }

  setQuery = (ev) => {
    var q = ev.nativeEvent.target.value
    this.setState({
      query: q,
      schema: filterSchema(this.props.schema, q)
    })
  }

  render () {
    return <div>
      <SearchBar
        query={this.state.query}
        onSearch={this.setQuery}
      />
      <div className="docContent">
        {Object.keys(this.state.schema.traces).map(type =>
          <Trace key={type} type={type} schema={this.state.schema.traces[type]}/>
        )}
      </div>
    </div>
  }
}

fetch('assets/schema.json').then(function (response) {
  response.json().then(function (schema) {
    ReactDOM.render(<Docs schema={schema}/>, root);
  });
});

