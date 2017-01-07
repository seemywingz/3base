
import Sky from '../../Sky';
import Box from '../../Box';
import * as THREE from 'three';
import { scene } from '../../init';
import SceneObject from '../../SceneObject';
import { randNum } from '../../Utils';

const os = require('os');

let
  cpuCount = os.cpus().length;

function createLights(){

  let light = new THREE.PointLight( 0xffffff, 1, 700);
  light.position.set(5, 10, 40);
  light.castShadow = true;
  light.shadowMapBias = 0.00001;
  light.shadowMapDarkness = 0.000001;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  scene.add( light );
  // var pointLightHelper = new THREE.PointLightHelper( light, 20 );
  // scene.add( pointLightHelper );

  // light = new THREE.AmbientLight(0xd6d6d6);
  light = new THREE.AmbientLight(0xffffff);
  scene.add( light );
}

export default function createScene(){
  createLights();

  new SceneObject(10, 0, -700, '/mb.jpg', null, null, 1000);// background

  let scale = 10;
  console.log("number of cpu's: "+cpuCount);
  for (let i = 0; i < cpuCount; i++) {
    new SceneObject((i*scale)*1.2, 0, -110, '/cpu.png', null, null, scale);// background
    // new Box((i*scale), 0, -100, 'cpu.png' , scale);
  }

  let cpus = os.cpus();
  for(let i = 0; i < cpus.length; i++) {
      console.log("CPU %s:", i);
      var cpu = cpus[i], total = 0;

      for(var type in cpu.times) {
          total += cpu.times[type];
      }

      for(type in cpu.times) {
          console.log("\t", type, Math.round(100 * cpu.times[type] / total));
      }
  }

}
