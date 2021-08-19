const path = require('path');
srvPath = path.join( __dirname + "/srv");
console.log("Server Path: " + srvPath);


module.exports = {
  
  resolve: {
    fallback: {
      fs: false,
      path: false
    }
  },

  entry: {
    app: './src/examples/index.js',
  },

  output: {
    path: srvPath,
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
    port: 10001,
    static: {
      directory: srvPath,
    },
  }
};
