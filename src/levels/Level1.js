'use-strict';

import Sky from '../Sky';
import Ball from '../Ball';
import Level from '../Level';
import Ground from '../Ground';
// import { randNum } from '../Utils';
import GLTFModel from '../GLTFModel';
import * as THREE from 'three';

export default class Level1 extends Level {

  constructor(loader) {
    super(loader);
    // this.camera.setPOS(0,50,10);
    this.rolled = false;
  }
  
  createScene(){
    this.cannonBallTexture = this.loadTexture( 'assets/images/ball.jpg');

    new Sky(this, this.loadTexture('assets/images/sky.jpg')).addToScene();
    new Ground(this, this.loadTexture( 'assets/images/ground.jpg')).addToScene();
    
    this.ankh = new GLTFModel(this, 0, 0.8, -2, 'ankh', .25, 0).addToScene();

    // this.wind = this.getAudio('./assets/audio/wind.wav', 0.3).play();
    this.scene.fog = new THREE.FogExp2( 0xe5edf9, 0.025 );
  }
  
  unPause(){
  }
  
  roll(){
    this.rolled = true;
    this.ankh.addToScene();
    this.ankh.playAnimation();
    this.ankh.mesh.add(this.getPositionalAudio('./assets/audio/rickRoll.ogg', 5));
  }

  click(){
    let direction = this.camera.getDirection();
    let pos = this.camera.controls.position;

    let spd = 50;
    let ball = new Ball(this, pos.x,pos.y,pos.z, this.cannonBallTexture, 0.51, 100);
    ball.body.angularVelocity.set(0, 0, 0);
    ball.body.velocity.set(direction.x * spd, direction.y * spd, direction.z * spd);
    ball.body.addEventListener("sleep",(event)=>{ball.die();});
    ball.addToScene();

    // if (!this.rolled) {
    //   this.roll();
    // }

  }
}
