'use-strict';

import Sky from '../Sky';
import Box from '../Box';
import Ball from '../Ball';
import Level from '../Level';
import * as THREE from 'three';
import Ground from '../Ground';
import Camera from '../Camera';
import { randNum } from '../Utils';
import SceneObject from '../SceneObject';
import {textureLoader} from '../LevelLoader';

export default class Level1 extends Level {

  constructor(loader) {
    super(loader);
    this.scene = new THREE.Scene();
    this.camera = new Camera(0,0,10, this);
    this.load();
  }

  createScene(){
    var skyTexture = textureLoader.load( 'assets/images/sky.jpg');
    new Sky(this, 0, 0, 0, skyTexture);

    var groundTexture = textureLoader.load( 'assets/images/ground.jpg');
    new Ground(this, 0, 0, 0, groundTexture, 1000);
    
    var boxTexture = textureLoader.load( 'assets/images/box/0.jpg');
    for (let index = 0; index < 100; index++) {
      new Box(this, randNum(-100,100), randNum(0.5, 200), randNum(-100,100), boxTexture, 1, 100);
    }

    this.cannonBallTexture = textureLoader.load( 'assets/images/ball.jpg');
    var ballTexture = textureLoader.load( 'assets/images/beachBall.jpg');
    for (let index = 0; index < 200; index++) {
      new Ball(this, randNum(-50,50), randNum(0.5, 200), randNum(-50,50), ballTexture, 1, 1);
    }

    new SceneObject(this, 0, 10, -20, null, null, 'buddha', 5, 1000);

    // var audio = new Audio('./assets/audio/wind.wav');
    // audio.volume = 0.5;
    // audio.play();

    // audio = new Audio('./assets/audio/mem.mp3');
    // audio.volume = 0.8;
    // audio.play();
  }

  click(){
    let direction = this.camera.getDirection();
    let pos = this.camera.controls.position;

    let spd = 150;
    let ball = new Ball(this,0, 0, 0, this.cannonBallTexture, 0.51, 10);
    ball.body.angularVelocity.set(0, 0, 0);
    ball.body.position.set(pos.x,pos.y,pos.z);
    ball.body.velocity.set(direction.x * spd, direction.y * spd, direction.z * spd);
    ball.body.addEventListener("sleep",(event)=>{
      ball.die();
    });
  }
}
