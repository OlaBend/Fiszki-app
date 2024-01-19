const webpack = require('webpack');
const process = require('process');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist',
  },
  mode: 'development',
  resolve: {
    alias: {
        'process/browser': require.resolve('process/browser'),
    },
    extensions: ['.js', '.jsx', '.json', '.css'],
    fallback: {
      zlib: require.resolve('browserify-zlib'),
      querystring: require.resolve('querystring-es3'),
      path: require.resolve('path-browserify'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      url: require.resolve('url/'),
      util: require.resolve('util/'),
      buffer: require.resolve('buffer/'),
      http: require.resolve('stream-http'),
      assert: require.resolve('assert/'),
      fs: require.resolve("browserify-fs"), //require.resolve('fs')   "fs": ,
      net: require.resolve('net-browserify'),
      async_hooks: false,
      os: require.resolve('os-browserify/browser'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  module: {
    rules: [
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                },
            },
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        },
    ],
  },
};
