'use-strict';

import Sky from '../Sky';
import Cube from '../Cube';
import Ball from '../Ball';
import {Scene} from 'three';
import Level from '../Level';
import Ground from '../Ground';
import Camera from '../Camera';
import { randNum } from '../Utils';
import { textureLoader } from '../LevelLoader';
import GLTFModel from '../GLTFModel';

export default class Level1 extends Level {

  constructor(loader) {
    super(loader);
    this.scene = new Scene();
    this.camera = new Camera(0,0,10, this);
    this.load();
  }

  createScene(){
    this.cannonBallTexture = textureLoader.load( 'assets/images/ball.jpg');
    new Sky(this, textureLoader.load('assets/images/sky.jpg'));
    new Ground(this, textureLoader.load( 'assets/images/ground.jpg'));
    
    // var cubeTexture = textureLoader.load( 'assets/images/box/0.jpg');
    // for (let index = 0; index < 50; index++) {
    //   new Cube(this, randNum(-50,50), randNum(0.5, 200), randNum(-50,50), cubeTexture, 1, 200);
    // }

    var ballTexture = textureLoader.load( 'assets/images/beachBall.jpg');
    for (let index = 0; index < 200; index++) {
      let ball = new Ball(this, randNum(-50,50), randNum(0.5, 200), randNum(-50,50), ballTexture, 1, 0.1);
      ball.mesh.shinyness = 100;
    }

    new GLTFModel(this, 10, 10, -20, 'raptor', 0.3, 0);
    new GLTFModel(this, 0, 0.8, -20, 'deadpool', 3.5, 0);
    
    this.playAudio();
  }

  playAudio(){
    var audio = new Audio('./assets/audio/wind.wav');
    audio.volume = 0.5;
    audio.play();
    
    // audio = new Audio('./assets/audio/mem.mp3');
    var audio = new Audio('./assets/audio/rickRoll.mp3');
    audio.volume = 0.8;
    audio.play();
  }

  click(){
    let direction = this.camera.getDirection();
    let pos = this.camera.controls.position;

    let spd = 50;
    let ball = new Ball(this, pos.x,pos.y,pos.z, this.cannonBallTexture, 0.51, 100);
    ball.body.angularVelocity.set(0, 0, 0);
    ball.body.velocity.set(direction.x * spd, direction.y * spd, direction.z * spd);
    ball.body.addEventListener("sleep",(event)=>{ball.die();});
  }
}
