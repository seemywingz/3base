'use-strict';

import Sky from '../Sky';
import Box from '../Box';
import Level from '../Level';
import Level1 from './Level1';
import Camera from '../Camera';
import * as THREE from 'three';
import Ground from '../Ground';
import { randNum } from '../Utils';

export default class Level2 extends Level {

  constructor(loader) {
    super(loader);
    this.scene = new THREE.Scene();
    this.camera = new Camera(this);
  }

  createScene(){

    new Sky(this, 0, 800, 0, '/sky.jpg', 10000);
    new Ground(this, 0, 0, 0, 'ground.jpg', 1000);

    let scale = 10,
        start = 5;
    for (let x = -start; x < start; x++) {
      for (var z = 0; z < 1; z++) {
        for (var y = 0; y < 10; y++) {
          let box = new Box(this, (x*scale), (0.5*scale)+(y*scale), z*scale, 'box/1.jpg', scale, 10);
          box.body.sleep();
        }
      }
    }

    // var audio = new Audio('./assets/audio/wind.wav');
    // audio.play();
  }

  next(){
    this.loader.next(new Level1(this.loader));
  }
}
