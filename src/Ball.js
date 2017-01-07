'use-strict';

import * as THREE from 'three';
import * as CANNON from 'cannon';
import SceneObject from './SceneObject';
import {world, animatedObjects} from './init';

export default class Ball extends SceneObject {

  constructor(x, y, z, texturesrc, scale=1, mass=1){
    super(x, y, z, texturesrc, new THREE.SphereGeometry( scale, 32, 32 ), null);
    if(physic_enabled)
      this.initPhysics(scale);
  }

  initPhysics(scale, mass){
    let shape = new CANNON.Sphere(scale);
    this.body = new CANNON.Body({
      mass: 1
    });
    this.body.addShape(shape);
    this.body.position.set(this.x,this.y,this.z);
    this.body.angularVelocity.set(0,0,0);
    this.body.angularDamping = 0.7;
    world.addBody(this.body);
    animatedObjects.push(this);
  }

  animate(){
    this.mesh.position.copy(this.body.position);
    this.mesh.quaternion.copy(this.body.quaternion);
  }
}
