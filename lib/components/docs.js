import React from 'react'
import filterSchema from '../filter-schema'
import constants from '../constants'
const Markdown = require('react-markdown');

class SearchBar extends React.Component {
  render () {
    return <div className="searchBar row">
      <div className="eight columns">
        <h1 className="searchBar-title">
          <a href="https://plot.ly/javascript/reference/" target="_blank">plotly.js</a>
        </h1>
        <div className="searchBar-box">
          <i>🔎</i>
          <input
            type="search"
            value={this.props.query}
            onChange={this.props.onSearch}
            placeholder="Search"
          />
        </div>
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
      els.push(<span key="type"> (
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
        disallowedTypes={['HtmlInline']}
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

class AttrList extends React.Component {
  toggle = (attrName) => {
    this.props.attrs[attrName]._expanded = !this.props.attrs[attrName]._expanded
    this.setState({})
  }

  render () {
    if (!this.props.attrs) return <div></div>

    var attrs = Object.keys(this.props.attrs)
      .sort()
      .filter(attr => constants.invalidAttrs.indexOf(attr) === -1);

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

export default Docs;
