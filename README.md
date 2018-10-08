3Base
-------------
###### 3d Web Application Engine

### Install
`yarn add 3base`

### Example webpack.config.js
```js
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

  devServer: {
    port: 10001
  }
};
```

### Usage  
index.js
```js
'use-strict';

import * as tb from '3base';
import Scene1 from './Scene1';

let loaders = new tb.Loaders();
loaders.loadScene(Scene1);
```  
Scene1.js
```js
'use-strict';

import * as tb from '3base';

export default class Scene1 extends tb.Scene {

  constructor(loader) {
    super(loader);
  }
  
  createScene(){
    new tb.Sky(this, this.loadTexture('assets/images/sky.jpg')).addToScene();
    new tb.Ground(this, this.loadTexture( 'assets/images/ground.jpg')).addToScene();
    
    this.ankh = new tb.GLTFModel(this, 0, 0.018, -20, 'assets/models/ankh', .25, 0, true)
    .then( (ankh) => {
      ankh.mesh.rotation.y = Math.PI / 2;
      ankh.addPositionalAudio('assets/audio/rickRoll.ogg', 5);
    });
  }
}
```