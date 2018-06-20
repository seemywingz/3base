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
    this.camera = new Camera(0,5,10, this);
    this.load();
  }

  createScene(){
    this.cannonBallTexture = textureLoader.load( 'assets/images/ball.jpg');
    new Sky(this, textureLoader.load('assets/images/sky.jpg'));
    new Ground(this, textureLoader.load( 'assets/images/ground.jpg'));
    
    new GLTFModel(this, 0, 9, 0, 'warehouse', 10, -1);
    new GLTFModel(this, 0, 0.8, -10, 'deadpool', 3.5, 0);
    
    this.loader.loading = false;
  }

  extra(){
    new GLTFModel(this, 0, 0.8, -20, 'deadpool', 3.5, 0);
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
