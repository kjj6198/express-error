### Webpack setting

#### 如何開啟 devServer

- run `npm run webpack-dev-server`
詳細設定可以到 `webpack.config.js` 查看
- 到 `localhost:8080` 進行開發，publicPath 為 `/bundle`

#### Webpack build

- 到 `webpack.parts.js` 查看相關設定

#### 使用的 module

- babel
  - es2015
  - react
  - react-hmr
  - 相關設定在 babelrc
- postcss
  - autoprefixer
  - cssnano
  - 相關設定在 postcssrc
- eslint
- stylelint
- react
  - react-dom
  - react-redux
  - redux
  - redux-logger
- ramda


## License

MIT
