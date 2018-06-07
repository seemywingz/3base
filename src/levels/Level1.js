'use-strict';

import Sky from '../Sky';
import Cube from '../Cube';
import Ball from '../Ball';
import {Scene} from 'three';
import Level from '../Level';
import Ground from '../Ground';
import Camera from '../Camera';
import { randNum } from '../Utils';
import SceneObject from '../SceneObject';
import {textureLoader} from '../LevelLoader';

export default class Level1 extends Level {

  constructor(loader) {
    super(loader);
    this.scene = new Scene();
    this.camera = new Camera(0,0,10, this);
    this.load();
  }

  createScene(){
    this.cannonBallTexture = textureLoader.load( 'assets/images/ball.jpg');
    var skyTexture = textureLoader.load( 'assets/images/sky.jpg');
    new Sky(this, 0, 0, 0, skyTexture);

    var groundTexture = textureLoader.load( 'assets/images/ground.jpg');
    new Ground(this, 0, 0, 0, groundTexture, 1000);
    
    // var cubeTexture = textureLoader.load( 'assets/images/box/0.jpg');
    // for (let index = 0; index < 50; index++) {
    //   new Cube(this, randNum(-50,50), randNum(0.5, 200), randNum(-50,50), cubeTexture, 1, 200);
    // }

    var ballTexture = textureLoader.load( 'assets/images/beachBall.jpg');
    for (let index = 0; index < 200; index++) {
      new Ball(this, randNum(-50,50), randNum(0.5, 200), randNum(-50,50), ballTexture, 1, 0.1);
    }

    // new SceneObject(this, 10, 1, -20, null, null, 'ptolemaic_woman', 0.1, 0);
    new SceneObject(this, 10, 1, -20, null, null, 'deadpool', 3, 0);

  }

  playAudio(){
    var audio = new Audio('./assets/audio/wind.wav');
    audio.volume = 0.5;
    audio.play();

    audio = new Audio('./assets/audio/mem.mp3');
    audio.volume = 0.8;
    audio.play();
  }

  click(){
    let direction = this.camera.getDirection();
    let pos = this.camera.controls.position;

    let spd = 50;
    let ball = new Ball(this,0, 0, 0, this.cannonBallTexture, 0.51, 100);
    ball.body.angularVelocity.set(0, 0, 0);
    ball.body.position.set(pos.x,pos.y,pos.z);
    ball.body.velocity.set(direction.x * spd, direction.y * spd, direction.z * spd);
    ball.body.addEventListener("sleep",(event)=>{
      ball.die();
    });
  }
}
