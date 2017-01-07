
import Sky from '../../Sky';
import Ground from '../../Ground';
import Box from '../../Box';
import * as THREE from 'three';
import { scene } from '../../init';
import SceneObject from '../../SceneObject';
import { createMesh, loadModel, randNum } from '../../Utils';


function createLights(){

  let light = new THREE.PointLight( 0xffffff, 1, 0, 2);
  light.position.set(0, 100, 100);
  light.castShadow = true;
  light.shadowMapBias = 0.01;
  light.shadowMapDarkness = 0.01;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  scene.add( light );

  var pointLightHelper = new THREE.PointLightHelper( light, 2 );
  scene.add( pointLightHelper );

  light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
  scene.add( light );

  // light = new THREE.AmbientLight(0xd6d6d6);
  // light = new THREE.AmbientLight(0xffffff);
  // scene.add( light );

}


export default function createScene(){
  createLights();

  new Sky(0, 800, 0, '/sky.jpg');
  new Ground(0, 0, 0, '/dry.jpg', 1000);

  for (var i = 1; i < 16; i++) {
    new Box(randNum(-100,100), randNum(100,200), randNum(-100,-200), 'box/'+~~randNum(0,4)+'.jpg', ~~randNum(2,6));
  }

}
