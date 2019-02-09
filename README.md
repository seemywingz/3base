3Base
-------------
###### 3d Web Application Engine

### Install
`yarn add 3base`

### Usage Example
Folder Scructure
```bash
.
├── README.md
├── package-lock.json
├── package.json
├── src
│   ├── ExampleScene.js
│   ├── index.js
├── srv
│   ├── assets
│   │   ├── audio
│   │   ├── images
│   │   ├── models
│   │   └── stylesheets
│   ├── bundle.js
│   └── index.html
├── webpack.config.js
└── yarn.lock
```
webpack.config.js
```js
const path = require('path');

module.exports = {
  node: {
    fs: "empty" // Nedded For Ammo.js, webpack does weird things with node fs module...
  },

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
index.html
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Three Base Example</title>
  <link rel="stylesheet" type="text/css" href="./assets/stylesheets/main.css">
</head>
<body>
  <canvas id="myCanvas" width="500" height="300"></canvas>
  <script src="bundle.js"></script>
</body>
</html>
```
index.js
```js
'use-strict';

import * as tb from '3base';
import Scene1 from './Scene1';

let manager = new tb.Manager({canvas: myCanvas});
manager.loadScene(Scene1);
```  
Scene1.js
```js
'use-strict';

import * as tb from '3base';

export default class ExampleScene extends tb.Scene {

  constructor(manager) {
    super(manager);// required
    this.load(); // required
  }
  
  createScene(){
    new tb.Sky(this, this.manager.loadTexture('assets/images/sky.jpg')).addToScene();
    new tb.Ground(this, this.manager.loadTexture( 'assets/images/ground.jpg')).addToScene();
    new tb.GLTFModel(this, 0, 0, -10, 'assets/models/deadpool', 3, 0, true)
    .then(deadpool=>{
      deadpool.playAnimation(0);
    })
  }

  createLights(){
    let dl = new tb.DirectionalLight(this, 1, 200, 0);
    dl.addShadow(-30,30,30,-30);
    dl.addToScene()

    let skyColor = 0xe5efff;
    let groundColor = 0xecffd1;
    new tb.HemisphereLight(this, skyColor, groundColor, 0.02).addToScene();
  }
}
```

### PRs are Welcomed and Encouraged!!
### Please Report Any [Issues](https://github.com/seemywingz/3base/issues)