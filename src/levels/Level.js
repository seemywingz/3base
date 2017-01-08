'use-strict';

import Ball from '../Ball';
import * as THREE from 'three';
import { camera } from '../init';

export default class Level {

  constructor() {
    this.createLights();
    this.createScene();
  }

  createLights(){}
  createScene(){}
  extra(){}

  click(){
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

}
