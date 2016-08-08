var webpack = require('webpack');

module.exports = {
  entry: [
    __dirname + '/client/src/index.js'
  ],
  output: {
    path: __dirname + '/client/public',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      'React': 'react'
    })
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      include: __dirname + '/client/src',
      query: {
        presets: ['react', 'es2015']
      }
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};