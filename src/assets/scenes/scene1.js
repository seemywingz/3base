
import Sky from '../../Sky';
import Ground from '../../Ground';
import Box from '../../Box';
import * as THREE from 'three';
import { scene } from '../../init';
import SceneObject from '../../SceneObject';
import { createMesh, loadModel, randNum } from '../../Utils';


function createLights(){

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


export default function createScene(){
  createLights();

  new Sky(0, 800, 0, '/sky.jpg', 10000);
  new Ground(0, 0, 0, 'dry.jpg', 1000);

  let scale = 10;
  for (let x = 0; x < 2; x++) {
    for (var z = 0; z < 1; z++) {
      for (var y = 0; y < 20; y++) {
        let box = new Box((x*scale), (0.5*scale)+(y*scale), z*scale, 'box/1.jpg', scale, 10);
        box.body.sleep();
      }
    }
  }

  scale = 1;
  for (let x = 0; x < 2; x++) {
    for (let z = 0; z < 1; z++) {
      for (let y = 0; y < 20; y++) {
        let box = new Box(-20+(x*scale), (0.5*scale)+(y*scale), z*scale, 'box/1.jpg', scale, 1);
        box.body.sleep();
      }
    }
  }

  scale = 1;
  for (let x = 0; x < 2; x++) {
    for (let z = 0; z < 1; z++) {
      for (let y = 0; y < 20; y++) {
        let box = new Box(30+(x*scale), (0.5*scale)+(y*scale), z*scale, 'box/1.jpg', scale, 1);
        box.body.sleep();
      }
    }
  }

  // var audio = new Audio('./assets/audio/wind.wav');
  // audio.play();

}
