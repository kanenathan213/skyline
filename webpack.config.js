const path = require('path')

process.noDeprecation = true

module.exports = {
  entry: './js/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'js'),
        ],
        loader: 'babel-loader',
        options: {
          presets: ['babel-preset-es2015'],
        },
      },
    ],
  },
  devtool: 'inline-source-map',
  devServer: {
    publicPath: '/build/',
  },
  resolve : {
    modules: [
      'js',
      'node_modules',
    ],
  },
}
