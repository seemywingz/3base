'use-strict';

import Sky from '../Sky';
import Box from '../Box';
import Level from './Level';
import * as THREE from 'three';
import Ground from '../Ground';
import { scene } from '../init';
import { randNum } from '../Utils';

export class Level1 extends Level {

  constructor() {
    super();
  }

  createLights(){
    let light = new THREE.PointLight( 0xc9c9c9, 1, 0, 3);
    light.position.set(0, 500, 100);
    light.castShadow = true;
    light.shadowMapBias = 0.01;
    light.shadowMapDarkness = 0.01;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add( light );

    // var pointLightHelper = new THREE.PointLightHelper( light, 2 );
    // scene.add( pointLightHelper );

    light = new THREE.HemisphereLight( 0xe8ffe9, 0x262626, 1 );
    scene.add( light );

    // light = new THREE.AmbientLight(0xd6d6d6);
    // light = new THREE.AmbientLight(0xffffff);
    // scene.add( light );
  }

  createScene(){

    new Sky(0, 800, 0, '/sky.jpg', 10000);
    new Ground(0, 0, 0, 'ground.jpg', 1000);

    let scale = 10,
        start = 2;
    for (let x = -start; x < start; x++) {
      for (var z = 0; z < 1; z++) {
        for (var y = 0; y < 10; y++) {
          let box = new Box((x*scale), (0.5*scale)+(y*scale), z*scale, 'box/1.jpg', scale, 10);
          box.body.sleep();
        }
      }
    }

    // var audio = new Audio('./assets/audio/wind.wav');
    // audio.play();
  }

}
