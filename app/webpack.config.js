const path = require('path');
const webpack = require('webpack');


module.exports = function makeWebpackConfig() {
  var config = {};

  config.entry = {
    index: "./index.tsx",
  };
  config.output = {
    filename: '[name].bundle.js',
    path: __dirname + "/dist"
  };

  // Enable sourcemaps for debugging webpack's output.
  config.devtool = 'inline-source-map';

  config.resolve = {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  };

  config.module = {
    rules: [
      {test: /\.tsx?$/, loader: "awesome-typescript-loader"},
      {test: /\.css$/, loader: "style-loader!css-loader"},
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        loader: 'file-loader'
      }
    ]
  };

  config.plugins = [];

  config.devServer = {
    compress: true,
    port: 3000,
    hot: true
  };

  return config;
}();
