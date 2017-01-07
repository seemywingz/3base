
import Sky from '../../Sky';
import Box from '../../Box';
import Ball from '../../Ball';
import * as THREE from 'three';
import { scene } from '../../init';
import SceneObject from '../../SceneObject';
import { createMesh, loadModel, randNum } from '../../Utils';


function createLights(){

  let light = new THREE.PointLight( 0xffffff, 1, 700);
  light.position.set(5, 10, 10);
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

  new Sky(0, 800, 0, '/sky.jpg');
  // new SceneObject(0, 0, -30, null, null, 'buddha', 10);



}

export function explodeScene(){
  for (var i = 1; i < 16; i++) {
    new Ball( randNum(-100,100), randNum(100,200), randNum(-100,-200),'/redsf.jpeg', 5);
    new Box(randNum(-100,100), randNum(100,200), randNum(-100,-200), '/gift.png', 10);
  }
}
