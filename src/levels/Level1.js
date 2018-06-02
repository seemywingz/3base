'use-strict';

import Sky from '../Sky';
import Box from '../Box';
import Level from '../Level';
import * as THREE from 'three';
import Ground from '../Ground';
import Camera from '../Camera';
import { randNum } from '../Utils';
import {textureLoader} from '../LevelLoader';

export default class Level1 extends Level {

  constructor(loader) {
    super(loader);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xfff000 );
    this.camera = new Camera(0,0,10, this);
    this.load();
  }

  createScene(){
    var skyTexture = textureLoader.load( 'assets/images/sky.jpg');
    new Sky(this, 0, 0, 0, skyTexture);

    var groundTexture = textureLoader.load( 'assets/images/grass.jpg');
    new Ground(this, 0, 0, 0, groundTexture, 1000);
    
    var boxTexture = textureLoader.load( 'assets/images/box/0.jpg');
    for (let index = 0; index < 100; index++) {
      new Box(this, randNum(-100,100), 0.5, randNum(-100,100), boxTexture);
    }
  }
}
