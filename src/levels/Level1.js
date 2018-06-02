'use-strict';

import Sky from '../Sky';
import Level from '../Level';
import Camera from '../Camera';
import * as THREE from 'three';
import {textureLoader} from '../LevelLoader';

export default class Level1 extends Level {

  constructor(loader) {
    super(loader);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xfff000 );
    this.camera = new Camera(0,0,100);
    this.load();
  }

  createScene(){
    var texture = textureLoader.load( 'assets/images/sky.jpg');
    var sky = new Sky(this, 0, 0, 0, texture, 100);
  }
}
