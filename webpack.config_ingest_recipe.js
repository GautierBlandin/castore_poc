const path = require('path');

module.exports = {
  entry: './lib/templateBoundedContext/adapters/primary/ingestRecipePrimaryAdaptor.js',
  target: 'node',
  mode: 'production',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'ingestRecipePrimaryAdaptor.js',
    libraryTarget: 'commonjs',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
};
