'use strict';

const Webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const buildDirectory = path.join(__dirname, 'build');

module.exports = {
  mode: 'development',
  entry: {
    app: './src/app.js'
  },
  output: {
    filename: 'app.js',
    path: buildDirectory,
  },
  devtool: false,
  devServer: {
    contentBase: buildDirectory,
    port: process.env.PORT || 8080
  },

  stats: {
    colors: true,
    reasons: true
  },

  plugins: [
    new HtmlWebpackPlugin({template: 'src/assets/index.html'}),
    new Webpack.EnvironmentPlugin({
      'NEO4J_URI': 'bolt://localhost:7687',
      'NEO4J_DATABASE': 'Alvearie',
      'NEO4J_USER': 'neo4j',
      'NEO4J_PASSWORD': 'neo4j421',
      'NEO4J_VERSION': ''
    }),
  ],

  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js', '.jsx']
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg|ico|eot|ttf|woff|woff2)$/i,
        loader: "url-loader",
        options: {
          limit: 8192,
          fallback: "file-loader",
          mimetype: 'image/png',
          // fallback options
          name: '[name].[ext]',
          outputPath: 'images/'
        },
      },
    ]
  },
};

