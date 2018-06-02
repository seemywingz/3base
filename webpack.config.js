const path = require('path');
console.log(path.join( __dirname + "/srv"));

module.exports = {
  entry: {
    app: './src/index.js',
  },

  output: {
    path: path.join( __dirname + "/srv"),
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },

  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  
  devServer: {
    port: 10001
  }
};