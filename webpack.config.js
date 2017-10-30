const webpack                     = require('webpack');
const path                        = require('path');
const merge                       = require('webpack-merge');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const WebpackChunkHash            = require('webpack-chunk-hash');
const ChunkManifestPlugin         = require('chunk-manifest-webpack-plugin');
const parts                       = require('./webpack.parts');


/* you can seperate entry to another file. */
const entry = {
  app: './client/index.js'
};

const commonConfig = (env) => ({
  context: __dirname,
  devtool: env.target === 'development' ? 'cheap-module-eval-source-map' : 'cheap-source-map',
  resolve: {
    modules: ['node_modules', './client'],
    extensions: ['.js']
  },
  entry,
  output: {
    path: path.join(__dirname, 'bundle'),
    filename: env.target === 'development' ? '[name].bundle.js' : '[name].[chunkhash].js',
    publicPath: '/bundle/'
  }
});


/* eslint consistent-return: 0 */
function config(target = 'development') {
  if (typeof target === 'undefined') {
    target = 'development'; /* eslint no-param-reassign: 0 */
  }

  switch (target) {
    case 'development':
      return merge([
        commonConfig(target),
        parts.loadStylesheet(target),
        parts.devServer(target),
        parts.loadJavascript(target),
        parts.setVariable('process.env.NODE_ENV', 'development'),
        {
          plugins: [
            new webpack.NamedModulesPlugin(),
            new webpack.LoaderOptionsPlugin({ debug: true })
          ]
        }
      ]);
    case 'production':
      return merge([
        commonConfig(target),
        { 
          plugins: [
            new webpack.optimize.UglifyJsPlugin(),
            new webpack.optimize.CommonsChunkPlugin({
              name: 'vender'
            }),
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.HashedModuleIdsPlugin(),

            new WebpackChunkHash(),
            new ChunkManifestPlugin({
              filename: 'chunk-manifest.json',
              manifestVariable: 'webpackManifest',
              inlineManifest: true
            })
          ]
        },
        parts.loadJavascript(target),
        parts.setVariable('process.env.NODE_ENV', 'production'),
        parts.extractStylesheet(target)
      ]);
    default:
      return {};
  }
}

module.exports = config('development');
