var path = require('path');
  module.exports = {
      entry: './src/index.js',
      target: 'node',
      output: {
          path: __dirname + "./srv/",
          filename: 'bundle.js'
      },
      module: {
        loaders: [
         {
           test: /\.js$/,
           exclude: /(node_modules)/,
           loader: 'babel-loader?presets[]=es2015', // 'babel-loader' is also a valid name to reference
         },
         {
           test: /\.scss$/,
          loaders: ["style", "css", "sass"]
        }
       ]
     },
     devServer: {
       port: 10001
     }
  };
