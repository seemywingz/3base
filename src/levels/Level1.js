'use-strict';

import Sky from '../Sky';
import Box from '../Box';
import Ball from '../Ball';
import Level from '../Level';
import Camera from '../Camera';
import * as THREE from 'three';
import Ground from '../Ground';
import Level2 from './Level2';
import { randNum } from '../Utils';
import SceneObject from '../SceneObject';
import {textureLoader} from '../LevelLoader';

export default class Level1 extends Level {

  constructor(loader) {
    super(loader);
    this.scene = new THREE.Scene();
    this.camera = new Camera(this);
    this.load();
  }

  click(){
    let direction = new THREE.Vector3();
    this.camera.controls.getDirection( direction );
    let pos = this.camera.controls.getObject().position;

    let spd = 150;
    let ball = new Ball(this,0, 0, 0, null, 1, 1000);
    ball.body.angularVelocity.set(0, 0, 0);
    ball.body.position.set(pos.x,pos.y,pos.z);
    ball.body.velocity.set(direction.x * spd, direction.y * spd, direction.z * spd);
    ball.body.addEventListener("sleep",(event)=>{
      ball.die();
    });
  }

  createLights(){
    let light = new THREE.PointLight( 0xc9c9c9, 1, 0, 3);
    light.position.set(0, 500, 100);
    light.castShadow = true;
    light.shadowMapBias = 0.01;
    light.shadowMapDarkness = 0.01;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    this.scene.add( light );

    // var pointLightHelper = new THREE.PointLightHelper( light, 2 );
    // scene.add( pointLightHelper );

    light = new THREE.HemisphereLight( 0xe8ffe9, 0x262626, 1 );
    this.scene.add( light );

    // light = new THREE.AmbientLight(0xd6d6d6);
    // light = new THREE.AmbientLight(0xffffff);
    // this.scene.add( light );
  }

  createScene(){

    this.boxTexture = textureLoader.load( 'assets/images/box/1.jpg');
    this.skyTexture = textureLoader.load( 'assets/images/sky.jpg');
    this.groundTexture = textureLoader.load( 'assets/images/ground.jpg');

    // new SceneObject(this, 20, 0, 0, null, null, 'buddha', 10);

    // new SceneObject(this, -10, 100, 0, null, null, 'test', 10, 20000);

    new Sky(this, 0, 800, 0, this.skyTexture, 10000);
    new Ground(this, 0, 0, 0, this.groundTexture, 1000);

    let n = 100;
    for (let i = 0; i < n; i++) {
      new SceneObject(this, randNum(-n,n), 0, randNum(-n,n), null, null, 'test', randNum(2,20), 0);
    }

    this.buildTower(2, 1, 50, 1, 0);


    // var audio = new Audio('./assets/audio/wind.wav');
    // audio.play();
  }

  buildTower(length=5, width=1, height=20, scale=1, start=2){
    for (let x = -start; x < -start+length; x++) {
      for (let z = 0; z < width; z++) {
        for (let y = 0; y < height; y++) {
          let box = new Box(this, (x*scale), (0.5*scale)+(y*scale), z*scale, this.boxTexture, scale, 10);
          box.body.sleep();
        }
      }
    }
  }

  next(){
    this.die();
    this.loader.next(new Level2(this.loader));
  }

  extra(){
    this.buildTower();
  }

}
