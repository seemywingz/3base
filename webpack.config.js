const path = require('path');
console.log(path.join( __dirname + "/srv"));

module.exports = {
  node: {
    fs: "empty"
  },

  entry: {
    app: './src/examples/index.js',
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
      },
      // {
      //   test: /three\/examples\/js/,
      //   use: 'imports-loader?THREE=three'
      // }
    ]
  },

  // resolve: {
  //   alias: {
  //     'three-loaders': path.join(__dirname, './node_modules/three/examples/js/loaders')
  //   },
  //   extensions: ['*', '.js', '.jsx']
  // },
  
  devServer: {
    port: 10001
  }
};