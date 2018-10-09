'use-strict';

import * as tb from '../3base';

export default class Scene1 extends tb.Scene {

  constructor(manager) {
    super(manager);
  }
  
  createScene(){
    // this.enablePhysics();
    new tb.Sky(this, this.loadTexture('assets/images/sky.jpg')).addToScene();
    new tb.Ground(this, this.loadTexture( 'assets/images/ground.jpg')).addToScene();
    
    new tb.GLTFModel(this, 0, 0, -10, 'assets/models/deadpool', 1.25, 0, true)
    .then(deadpool=>{
      deadpool.playAnimation(0);
    })
  }

  click(){
  }
}
