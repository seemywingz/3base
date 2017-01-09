'use-strict';

import Ball from '../Ball';
import Box from '../Box';
import * as THREE from 'three';
import { randNum } from '../Utils';
import { scene } from '../init';

export default class Level {

  constructor() {
  }

  createScene(){}

  load(){
    this.createLights();
    this.createScene();
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

  click(camera){
      let getDirection = camera.getDirection;
      let direction = new THREE.Vector3();
      camera.controls.getDirection( direction );
      let pos = camera.controls.getObject().position;

      let spd = 300;
      let velocity = camera.getDirection(new THREE.Vector3(direction.x * spd, direction.y * spd, direction.z * spd));

      let ball = new Ball(0, 0, 0, null, 1, 10);
      ball.body.angularVelocity.set(0, 0, 0);
      ball.body.position.set(pos.x,pos.y,pos.z);
      ball.body.velocity.set(velocity.x, velocity.y, velocity.z);
      ball.body.addEventListener("sleep",(event)=>{
        ball.die();
      });
  }

  extra(){
    for (var i = 1; i < 10; i++) {
      new Box(randNum(-100,100), randNum(100,200), randNum(-100,-200), 'box/'+~~randNum(0,4)+'.jpg', ~~randNum(2,10));
    }
  }

}
