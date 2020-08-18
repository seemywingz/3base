const path = require('path');
console.log(path.join( __dirname + "/srv"));

module.exports = {
  // target: "web",
  // externals:{
  //   fs:    "commonjs fs",
  //   path:  "commonjs path",
  //   require:  "commonjs require"
  // },

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
      //   test: /three\/examples\/jsm/,
      //   use: 'imports-loader'
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
