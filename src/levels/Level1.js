'use-strict';

import Sky from '../Sky';
import Box from '../Box';
import Ball from '../Ball';
import Level from '../Level';
import Camera from '../Camera';
import * as THREE from 'three';
import Ground from '../Ground';
import Level2 from './Level2';
import * as CANNON from 'cannon';
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
    let ball = new Ball(this,0, 0, 0, null, 0.51, 1000);
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

    new Sky(this, 0, 800, 0, this.skyTexture, 10000);
    new Ground(this, 0, 0, 0, this.groundTexture, 1000);

    let buddha = new SceneObject(this, 0, 10, -20, null, null, 'buddha', 5, 1000);

    let fl_start = -1000;

    let fl_addAnimation = (fl) => {
      return () => {
        let start = -1000;
        fl.body.position.z += 1;
        fl.body.allowSleep = false;
        if (fl.body.position.z >= -start){
          fl.body.position.z = start;
        }
      };
    };

    let flamingo = new SceneObject(this, 0, 100, fl_start, null, null, 'flamingo', 0.08, 0, 0.03);
    flamingo.addAnimation = fl_addAnimation(flamingo);

    flamingo = new SceneObject(this, 10, 99, fl_start - 10, null, null, 'flamingo', 0.05, 0, 0.031);
    flamingo.addAnimation = fl_addAnimation(flamingo);

    flamingo = new SceneObject(this, 5, 98, fl_start - 10, null, null, 'flamingo', 0.03, 0, 0.033);
    flamingo.addAnimation = fl_addAnimation(flamingo);

    let m = 10;
    let n = m*20;
    for (let i = 0; i < m; i++) {
      let scale = randNum(2,20);
      let obj = new SceneObject(this, randNum(-n,n), scale*1.3, randNum(-n,n), null, null, 'test', scale, scale * 1000);
    }

    // this.buildTower(2, 1, 50, 1, 0);

    // var audio = new Audio('./assets/audio/wind.wav');
    // audio.play();
    //
    // audio = new Audio('./assets/audio/mem.mp3');
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
