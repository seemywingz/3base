'use-strict';

import Sky from '../Sky';
import Level from '../Level';
import Ground from '../Ground';
import GLTFModel from '../GLTFModel';

export default class Level1 extends Level {

  constructor(loader) {
    super(loader);
  }
  
  createScene(){
    new Sky(this, this.loadTexture('assets/images/sky.jpg')).addToScene();
    new Ground(this, this.loadTexture( 'assets/images/ground.jpg')).addToScene();
    
    this.ankh = new GLTFModel(this, 0, 0.018, -20, 'assets/models/ankh', .25, 0, true)
    .then( (ankh) => {
      ankh.mesh.rotation.y = Math.PI / 2;
      ankh.addPositionalAudio('assets/audio/rickRoll.ogg', 5);
    });

    // this.wind = this.getAudio('./assets/audio/wind.wav', 0.3).play();
    // this.scene.fog = new THREE.FogExp2( 0xe5edf9, 0.025 );
  }

  click(){
    // let direction = this.camera.getDirection();
    // let pos = this.camera.controls.position;

    // let spd = 50;
    // let ball = new Ball(this, pos.x,pos.y,pos.z, this.cannonBallTexture, 0.51, 100);
    // ball.body.angularVelocity.set(0, 0, 0);
    // ball.body.velocity.set(direction.x * spd, direction.y * spd, direction.z * spd);
    // ball.body.addEventListener("sleep",(event)=>{ball.die();});
    // ball.addToScene();
  }
}
