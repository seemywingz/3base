'use-strict';

import Sky from '../Sky';
import Box from '../Box';
import Level from '../Level';
import Camera from '../Camera';
import * as THREE from 'three';
import Ground from '../Ground';
import Level2 from './Level2';
import { randNum } from '../Utils';

export default class Level1 extends Level {

  constructor(loader) {
    super(loader);
    this.scene = new THREE.Scene();
    this.camera = new Camera(this);
  }

  createScene(){

    new Sky(this, 0, 800, 0, '/sky.jpg', 10000);
    new Ground(this, 0, 0, 0, 'ground.jpg', 1000);

    let scale = 1,
        start = 1;
    for (let x = -start; x < start; x++) {
      for (let z = 0; z < 1; z++) {
        for (let y = 0; y < 20; y++) {
          let box = new Box(this, (x*scale), (0.5*scale)+(y*scale), z*scale, 'box/1.jpg', scale, 10);
          box.body.sleep();
        }
      }
    }

    scale = 2;
    start = 10;
    for (let x = -start; x < -start+1; x++) {
      for (let z = 0; z < 1; z++) {
        for (let y = 0; y < 20; y++) {
          let box = new Box(this, (x*scale), (0.5*scale)+(y*scale), z*scale, 'box/1.jpg', scale, 1);
          box.body.sleep();
        }
      }
    }

    // var audio = new Audio('./assets/audio/wind.wav');
    // audio.play();
  }

  next(){
    this.die();
    this.loader.next(new Level2(this.loader));
  }

  extra(){
    let scale = 10,
        start = 1;
    for (let x = -start; x < start; x++) {
      for (let z = 0; z < 1; z++) {
        for (let y = 0; y < 20; y++) {
          let box = new Box(this, (x*scale), (0.5*scale)+(y*scale), z*scale, 'box/1.jpg', scale, 10);
          box.body.sleep();
        }
      }
    }
  }

}
