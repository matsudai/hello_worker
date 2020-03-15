const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const main = {
  target: 'electron-main',
  entry: path.resolve(__dirname, 'src', 'main', 'main'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: [
          { loader: 'babel-loader' }
        ]
      }
    ]
  }
};

const renderer = {
  target: 'electron-renderer',
  entry: path.resolve(__dirname, 'src', 'renderer', 'index'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: [
          {
            loader: 'babel-loader',
            query:{
              presets: ['@babel/preset-react'],
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin(
      {
        template: path.resolve(__dirname, 'src', 'renderer', 'index.html'),
        filename: 'index.html'
      }
    )
  ]
};

module.exports = [main, renderer];
