# plotly-doc-viewer

> Standalone viewer + search for plotly.js docs [&xrarr; live viewer](http://rickyreusser.com/plotly-doc-viewer/)

## Introduction

An attempt to make the plotly docs more browsable. Compiles to static html and rehydrates via json fetch on page load. Not yet a perfect reproduction of the [official docs](https://plot.ly/javascript/reference/), but not too far off.

## Development

Just clone it, then:

```bash
$ npm install
$ npm run build:schema
$ npm start
```

To deploy:

```bash
$ npm run build
```

## To Do

- Add layout attrs
- Better searching
- Count up hits or something to more obviously bubble up how relevant stuff is
- UI fanciness
- Maybe use it for reals? Or just for my own use. TBD.

## License

Do anything you want with it
