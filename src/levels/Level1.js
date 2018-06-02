'use-strict';

import Sky from '../Sky';
import Box from '../Box';
import Level from '../Level';
import Camera from '../Camera';
import * as THREE from 'three';
import {textureLoader} from '../LevelLoader';

export default class Level1 extends Level {

  constructor(loader) {
    super(loader);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xfff000 );
    this.camera = new Camera(0,0,0, this);
    this.load();
  }

  createScene(){
    var skyTexture = textureLoader.load( 'assets/images/sky.jpg');
    var sky = new Sky(this, 0, 0, 0, skyTexture, 100);
    
    var boxTexture = textureLoader.load( 'assets/images/box/0.jpg');
    let box = new Box(this, 0, 0, 0, boxTexture, 1, 10);

  }
}
