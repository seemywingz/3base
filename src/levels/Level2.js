'use-strict';

import Sky from '../Sky';
import Box from '../Box';
import Level from '../Level';
import * as THREE from 'three';
import Ground from '../Ground';
import { randNum } from '../Utils';

export class Level2 extends Level {

  constructor() {
    super();
  }

  createScene(){

    new Sky(0, 800, 0, '/sky.jpg', 10000);
    new Ground(0, 0, 0, 'ground.jpg', 1000);

    let scale = 10,
        start = 5;
    for (let x = -start; x < start; x++) {
      for (let z = 0; z < 1; z++) {
        for (let y = 0; y < 10; y++) {
          let box = new Box((x*scale), (0.5*scale)+(y*scale), z*scale, 'box/1.jpg', scale, 10);
          box.body.sleep();
        }
      }
    }

    // let audio = new Audio('./assets/audio/wind.wav');
    // audio.play();
  }

}
