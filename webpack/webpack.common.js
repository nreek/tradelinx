const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const env = process.env.NODE_ENV;

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: 'app.min.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          "plugins": [
            "@babel/plugin-proposal-class-properties",
            ["@babel/plugin-proposal-object-rest-spread", { "useBuiltIns": true }],
            ["@babel/plugin-transform-runtime", { "regenerator": true }]
          ],
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          "plugins": [
            "@babel/plugin-proposal-class-properties",
            ["@babel/plugin-proposal-object-rest-spread", { "useBuiltIns": true }],
            ["@babel/plugin-transform-runtime", { "regenerator": true }]
          ],
          presets: ['@babel/preset-env', '@babel/preset-react'],
          // TODO: remove 'react' when all React components have extension *.jsx
        },
      },
      {
        test: /\.scss$/,
        use: [
           //env === 'production' ? MiniCssExtractPlugin.loader : 'style-loader', // creates style nodes from JS strings
          MiniCssExtractPlugin.loader, // TODO: Re-enable above line once scss multiple-import bug issue is fixed
          'css-loader', // translates CSS into CommonJS
          'sass-loader', // compiles Sass to CSS, using Node Sass by default
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../styles/',
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: 'webfonts/[name].[ext]',
            limit: 50000,
          },
        },
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 30000,
              name(file) {
                if (env === 'development') {
                  return '[path][name].[ext]';
                }
                return '[path][hash].[ext]';
              },
            },
          },
        ],
      },
    ],
  },
  stats: {
    colors: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
