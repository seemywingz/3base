3Base
-------------
###### 3d Web Application Engine

### Install
`yarn add 3base`

### Usage Example
webpack.config.js
```js
const path = require('path');

module.exports = {
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

export default class Scene1 extends tb.Scene {

  constructor(manager) {
    super(manager);
  }
  
  createScene(){
    this.enablePhysics();
    this.cannonBallTexture = this.manager.loadTexture( 'assets/images/ball.jpg');
    new tb.Sky(this, this.manager.loadTexture('assets/images/sky.jpg')).addToScene();
    new tb.Ground(this, this.manager.loadTexture( 'assets/images/ground.jpg')).addToScene();
    var ballTexture = this.manager.loadTexture( 'assets/images/beachBall.jpg');
    for (let index = 0; index < 30; index++) {
      let ball = new tb.Ball(this, tb.Utils.randNum(-50,50), tb.Utils.randNum(0.5, 200), tb.Utils.randNum(-50,50), ballTexture, 1, 0.05);
      ball.mesh.shinyness = 100;
      ball.addToScene();
    }

    new tb.GLTFModel(this, 0, 0, -10, 'assets/models/deadpool', 1.25, 0, true)
    .then(deadpool=>{
      deadpool.playAnimation(0);
    })
  }

  createLights(){
    let dl = new tb.DirectionalLight(this, 1, 200, 0);
    dl.addShadow(-30,30,30,-30);
    dl.addHelper();
    dl.addToScene()

    let skyColor = 0xe5efff;
    let groundColor = 0xecffd1;
    new tb.HemisphereLight(this, skyColor, groundColor, 0.02).addToScene();
  }

  click(){
    let direction = this.camera.getDirection();
    let pos = this.camera.controls.position;

    let spd = 5;
    let ball = new tb.Ball(this, pos.x,pos.y,pos.z, this.cannonBallTexture, 0.51, 100);
    ball.body.angularVelocity.set(0, 0, 0);
    ball.body.velocity.set(direction.x * spd, direction.y * spd, direction.z * spd);
    ball.body.addEventListener("sleep",(event)=>{ball.die();});
    ball.addToScene();
  }
}
```