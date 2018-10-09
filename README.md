3Base
-------------
###### 3d Web Application Engine

### Install
`yarn add 3base`

### Usage  
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

  constructor(loader) {
    super(loader);
  }
  
  createScene(){
    new tb.Sky(this, this.manager.loadTexture('assets/images/sky.jpg')).addToScene();
    new tb.Ground(this, this.manager.loadTexture( 'assets/images/ground.jpg')).addToScene();
    
    this.ankh = new tb.GLTFModel(this, 0, 0.018, -20, 'assets/models/ankh', .25, 0, true)
    .then( (ankh) => {
      ankh.mesh.rotation.y = Math.PI / 2;
    });
  }
}
```