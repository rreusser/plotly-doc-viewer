import React from 'react'
import filterSchema from '../filter-schema'
import constants from '../constants'
const Markdown = require('react-markdown');

function rejectInvalid (name) {
  return constants.invalidAttrs.indexOf(name) === -1;
}
var valTypes = {
  flaglist: 'flaglist string'
}

function valTypeString (type) {
  return valTypes[type] || type;
}


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

class Section extends React.Component {
  toggle = () => {
    this.props.schema._expanded = !this.props.schema._expanded
    this.setState({})
  }

  render () {
    return <div className={"row " + (this.props.schema._expanded ? 'expanded' : 'collapsed')}>
      <div className="eight columns">
        <SectionTitle title={this.props.title} onToggle={this.toggle} expanded={this.props.schema._expanded}/>
        {this.props.schema._expanded && (
          <div>
            {this.props.children}
          </div>
        )}
      </div>
    </div>
  }
}

class Attr extends React.Component {
  render () {
    let path = this.props.path.join('-')
    let attr = this.props.attr;

    // Attr name:
    var els = [
      <a className="attributeName" id={path} href={'#' + path} key="attr">
        {this.props.name}
      </a>
    ];

    // Attr type:
    if (attr.valType) {
      els.push(<span key="type"> (
        <code>{valTypeString(attr.valType)}</code>
      )</span>)
    }


    // Attr default:
    if (attr.dflt !== undefined && attr.dflt !== null) {
      els.push(<br key="br1"/>)

      if (attr.valType === 'flaglist') {
        els.push(<span key="combo">
          Any combination of {attr.flags.map((d, i) => (
            <span key={i}>
              <code>"{d}"</code>{i === attr.flags.length - 1 ? '' : ', '}
            </span>
          ))} joined with a <code>"+"</code> {attr.extras ? (
            <span>OR {attr.extras.map((d, i) => (
              <span key={i}>
                <code>"{d}"</code>{i === attr.extras.length - 1 ? '' : ' or '}
              </span>
            ))}</span>
          ) : ''}
        </span>)
        els.push(<br key="br2"/>)
      }

      var dflt = typeof attr.dflt === 'string' ? (
        !attr.dflt.length ? '""' : attr.dflt
      ) : attr.dflt.toString()

      els.push(<span key="dflt">default: <code>{dflt}</code></span>)
    }

    // Attr description:
    if (attr.description) {
      els.push(<br key="br3"/>);
      els.push(<Markdown
        key="desc"
        disallowedTypes={['HtmlInline']}
        source={attr.description}
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
  constructor (props) {
    super(props);
    this.attrSrc = props.attrs;

    if (this.attrSrc.role === 'object' && this.attrSrc.items) {
      var name = Object.keys(this.attrSrc.items).filter(rejectInvalid)[0];
      this.attrSrc = props.attrs.items[name]
    }


  }
  toggle = (attrName) => {
    this.attrSrc[attrName]._expanded = !this.attrSrc[attrName]._expanded
    this.setState({})
  }

  render () {
    if (!this.props.attrs) return <div></div>

    var attrs = Object.keys(this.attrSrc).sort().filter(rejectInvalid);

    return <ul>
      {attrs.map((attrName) => {
        var attr = this.attrSrc[attrName]
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
    var cnt = 0;
    return <div>
      <SearchBar
        query={this.state.query}
        onSearch={this.setQuery}
      />
      <div className="docContent">
        <div className="row">
          <div className="eight columns">
            <em>Note: This is an unofficial mirror of the plotly.js figure reference. It's an experiment at making the docs hierarchical and searchable. It's currently missing a few details like enum values and range information. For the real thing, please see the <a href="https://plot.ly/javascript/reference/" target="_blank">plotly.js figure reference</a>.</em>
          </div>
        </div>

        {Object.keys(this.state.schema.traces).map(type => {
          var schema = this.state.schema.traces[type]

          if (schema.attributes._visible) cnt++;
          if (!schema.attributes._visible) return;

          return <Section key={type} title={type} schema={schema}>
            <Markdown source={schema.meta.description || ''}/>
            <AttrList attrs={schema.attributes} path={[type]}/>
          </Section>
        })}

        {(() => {
          var schema = this.state.schema.layout;

          if (!schema.layoutAttributes._visible) {
            return;
          } else {
            cnt++;
          }

          return <Section title={'layout'} title="layout" schema={schema}>
            <AttrList attrs={schema.layoutAttributes} path={['layout']}/>
          </Section>
        })()}

        {cnt === 0 ? (
          <div className="row">
            <div className="eight columns noResultsYo">
              {Math.random() > 0.5 ? '🤷‍♂️' : '🤷‍♀️'}
            </div>
          </div>
        ) : ''}
      </div>
    </div>
  }
}

export default Docs;
