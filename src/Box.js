'use-strict';

import * as THREE from 'three';
import * as CANNON from 'cannon';
import SceneObject from './SceneObject';
import {world, animatedObjects, physic_enabled} from './init';

export default class Box extends SceneObject {

  constructor(x, y, z, texturesrc, scale=1){
    super(x, y, z, texturesrc, new THREE.BoxGeometry( scale, scale, scale ), null);
    if(physic_enabled)
      this.initPhysics(scale);
  }

  initPhysics(scale){
    // console.log(scale);
    let shape = new CANNON.Box(new CANNON.Vec3(scale*0.5, scale*0.5, scale*0.5));
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
    if(physic_enabled){
      this.mesh.position.copy(this.body.position);
      this.mesh.quaternion.copy(this.body.quaternion);
    }else{

    }
  }
}
