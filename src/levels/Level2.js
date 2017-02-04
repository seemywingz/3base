'use-strict';

import Sky from '../Sky';
import Box from '../Box';
import Level from '../Level';
import Level1 from './Level1';
import Camera from '../Camera';
import * as THREE from 'three';
import Ground from '../Ground';
import { randNum } from '../Utils';
import {textureLoader} from '../LevelLoader';

export default class Level2 extends Level {

  constructor(loader) {
    super(loader);
    this.scene = new THREE.Scene();
    this.camera = new Camera(this);
  }

  createScene(){

    this.boxTexture = textureLoader.load( 'assets/images/box/1.jpg');
    this.skyTexture = textureLoader.load( 'assets/images/sky.jpg');
    this.groundTexture = textureLoader.load( 'assets/images/ground.jpg');
    new Sky(this, 0, 800, 0, this.skyTexture, 10000);
    new Ground(this, 0, 0, 0, this.groundTexture, 1000);


    let scale = 1,
        start = 5;
    for (let x = -start; x < start; x++) {
      for (var z = 0; z < 3; z++) {
        for (var y = 0; y < 60; y++) {
          let box = new Box(this, (x*scale), (0.5*scale)+(y*scale), z*scale, this.boxTexture, scale, 10);
          box.body.sleep();
        }
      }
    }

    // var audio = new Audio('./assets/audio/wind.wav');
    // audio.play();
  }

  createLights(){
    let light = new THREE.PointLight( 0xc9c9c9, 1, 0, 3);
    light.position.set(0, 500, 100);
    // light.castShadow = true;
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
    // scene.add( light );
  }

  next(){
    this.loader.next(new Level1(this.loader));
  }
}
