'use-strict';

import Sky from '../Sky';
import Ball from '../Ball';
import Level from '../Level';
import Ground from '../Ground';
import Camera from '../Camera';
import { randNum } from '../Utils';
import GLTFModel from '../GLTFModel';
import * as THREE from 'three';

import { 
  textureLoader, 
  audioLoader 
} from '../LevelLoader';

export default class Level1 extends Level {

  constructor(loader) {
    super(loader);
    this.scene = new THREE.Scene();
    this.camera = new Camera(0,5,10, this);
    this.rolled = false;
    this.load();
  }

  createScene(){
    this.cannonBallTexture = textureLoader.load( 'assets/images/ball.jpg');
    new Sky(this, textureLoader.load('assets/images/sky.jpg'));
    new Ground(this, textureLoader.load( 'assets/images/ground.jpg'));

    var ballTexture = textureLoader.load( 'assets/images/beachBall.jpg');
    for (let index = 0; index < 300; index++) {
      let ball = new Ball(this, randNum(-50,50), randNum(0.5, 200), randNum(-50,50), ballTexture, 1, 0.05);
      ball.mesh.shinyness = 100;
    }

    this.scene.fog = new THREE.FogExp2( 0xe5edf9, 0.025 );
    // this.playAudio('./assets/audio/wind.wav', 0.5)
  }

  roll(){
    new GLTFModel(this, 0, 0.8, -20, 'deadpool', 3.5, 0);
    this.playPositionalAudio('./assets/audio/rickRoll.ogg', 0.8);
    this.rolled = true;
  }

  playAudio(fileName = "", volume = 1){
    let audio = new Audio(fileName);
    audio.volume = volume;
    audio.play();
  }

  playPositionalAudio(fileName = ""){
    // create an AudioListener and add it to the camera
    let listener = new THREE.AudioListener();
    this.camera.lens.add( listener );
    // create the PositionalAudio object (passing in the listener)
    let sound = new THREE.PositionalAudio( listener );
    // load a sound and set it as the PositionalAudio object's buffer
    audioLoader.load( fileName, function( buffer ) {
    	sound.setBuffer( buffer );
      sound.setRefDistance( 20 );
    	sound.play();
    });
  }

  click(){
    let direction = this.camera.getDirection();
    let pos = this.camera.controls.position;

    let spd = 50;
    let ball = new Ball(this, pos.x,pos.y,pos.z, this.cannonBallTexture, 0.51, 100);
    ball.body.angularVelocity.set(0, 0, 0);
    ball.body.velocity.set(direction.x * spd, direction.y * spd, direction.z * spd);
    ball.body.addEventListener("sleep",(event)=>{ball.die();});

    if (!this.rolled) {
      this.roll();
    }

  }
}
