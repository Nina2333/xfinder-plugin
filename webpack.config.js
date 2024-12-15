const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/content.tsx',
  output: {
    filename: 'content.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    // 禁用压缩以避免 eval
    minimize: false
  }
};